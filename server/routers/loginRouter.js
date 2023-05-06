import { Router } from 'express';
import { sendForgotPasswordMail } from '../util/mailSender.js';
import { sendSMS } from '../util/smsSender.js';
import db from "../database/connection.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const router = Router();

router.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({
            message: 'Venligst udfyld alle felter',
            status: 400
        });
    } else {
        const [user] = await db.all('SELECT * FROM users WHERE LOWER(email) = ?', [email.toLowerCase()]);
        if (!user) {
            return res.status(400).send({
                message: 'Kunne ikke finde bruger',
                status: 400
            });
        } else {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).send({
                    message: 'Forkert adgangskode',
                    status: 400
                });
            } else {
                const { password, token, token_expiration, phone, ...userWithoutPassword } = user;
                req.session.user = userWithoutPassword;
                return res.status(200).send({
                    message: 'Du er nu logget ind',
                    user: userWithoutPassword,
                    status: 200
                });
            }
        }
    }
});

router.post('/api/register', async (req, res) => {
    const { first_name, last_name, email, password, confirm_password, phone } = req.body;
    if (!first_name || !last_name || !email || !password || !confirm_password || !phone) {
        return res.status(400).send({
            message: 'Venligst udfyld alle felter',
            status: 400
        });
    } else {
        const [userMail] = await db.all('SELECT * FROM users WHERE email = ?', [email]);
        const [userPhone] = await db.all('SELECT * FROM users WHERE phone = ?', [phone]);
        if (userMail || userPhone) {
            return res.status(400).send({
                message: 'Bruger med denne email eller telefonnummer eksisterer allerede',
                status: 400
            });
        } else {
            if (password !== confirm_password) {
                return res.status(400).send({
                    message: 'Adgangskoderne er ikke ens',
                    status: 400
                });
            } else {
                const hashedPassword = await bcrypt.hash(password, 12);
                const message = `Dette er en bekræftelse på oprettelsen af bruger: ${email}`;
                sendSMS(message, phone);
                const user = await db.run('INSERT INTO users (first_name, last_name, email, password, phone) VALUES (?, ?, ?, ?, ?)', [first_name, last_name, email, hashedPassword, phone]);
                await db.run('INSERT INTO users_tax_data (user_id) VALUES (?)', [user.lastID]);
                return res.status(200).send({
                    message: 'Du er nu oprettet som bruger, du vil modtage en SMS med bekræftelse',
                    status: 200,
                })
            }
        }
    }
});

router.post('/api/logout', (req, res) => {
    req.session.destroy()
    return res.status(200).send({
        message: 'Du er nu logget ud',
        status: 200,
    })
});

router.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({
            message: 'Udfyld venligst med din email',
            status: 400
        });
    } else {
        const [user] = await db.all('SELECT * FROM users WHERE LOWER(email) = ?', [email.toLowerCase()]);
        if (!user) {
            return res.status(400).send({
                message: 'Kunne ikke finde bruger',
                status: 400
            });
        } else {
            const token = crypto.randomBytes(5).toString('hex');
            const token_expiration = Date.now() + 3600000;
            await db.run('UPDATE users SET token = ?, token_expiration = ? WHERE email = ?', [token, token_expiration, email]);
            const message = `Nulstil adgangskode-link udløber om 1 time. http://localhost:5173/nulstil-adgangskode/${token}`;
            sendSMS(message, user.phone);
            return sendForgotPasswordMail(res, email, token);
        }
    }
});

router.post('/api/reset-password', async (req, res) => {
    const { token, password, confirm_password } = req.body;
    if (!password || !confirm_password) {
        return res.status(400).send({
            message: 'Venligst udfyld alle felter',
            status: 400
        });
    } else if (!token) {
        return res.status(400).send({
            message: 'Noget gik galt',
            error: 'Token ikke fundet',
            status: 400
        });
    } else {
        if (password !== confirm_password) {
            return res.status(400).send({
                message: 'Adgangskoderne er ikke ens',
                status: 400
            });
        } else {
            const [user] = await db.all('SELECT * FROM users WHERE token = ?', [token]);
            if (!user) {
                return res.status(400).send({
                    message: 'Noget gik galt',
                    error: 'Kunne ikke finde bruger',
                    status: 400
                });
            } else {
                if (token !== user.token) {
                    return res.status(400).send({
                        message: 'Noget gik galt',
                        error: 'Invalid Token',
                        status: 400
                    });
                } else {
                    if (Date.now() > Number(user.token_expiration)) {
                        return res.status(400).send({
                            message: 'Noget gik galt',
                            error: 'Token Udløbet',
                            status: 400
                        });
                    } else {
                        const hashedPassword = await bcrypt.hash(password, 12);
                        await db.run('UPDATE users SET password = ?, token = NULL, token_expiration = NULL WHERE id = ?', [hashedPassword, user.id]);
                        return res.status(200).send({
                            message: 'Din adgangskode er nu ændret',
                            status: 200,
                        })
                    }
                }
            }
        }

    }

});

router.post('/api/check-token', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).send({
            message: 'Ingen token angivet',
            status: 400
        });
    };
    const [user] = await db.all('SELECT * FROM users WHERE token = ?', [token]);
    if (!user) {
        return res.status(400).send({
            message: 'Link virker ikke',
            status: 400
        });
    }
    if (Number(user.token_expiration) < Date.now()) {
        return res.status(400).send({
            message: 'Link er udløbet',
            status: 400
        });
    }
    return res.status(200)
});

router.get('/api/check-session', async (req, res) => {
    if (!req.session.user) {
        return res.status(400).send({
            message: 'Ingen session fundet',
            status: 400
        });
    }
    return res.status(200).send({
        message: 'Session fundet',
        status: 200
    })
});


export default router;
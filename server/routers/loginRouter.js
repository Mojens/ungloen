import { Router } from 'express';
import { sendForgotPasswordMail } from '../util/mailSender.js';
import { sendSMS } from '../util/smsSender.js';
import db from '../database/connection.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const router = Router();

router.post('/api/auth/login', async (req, res) => {
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
        } else if (user.verified === 0) {
            return res.status(400).send({
                message: 'Du har ikke aktiveret din bruger endnu',
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
                const { password, verified, verification_code, token, token_expiration, phone, ...userWithoutPassword } = user;
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

router.post('/api/auth/verify', async (req, res) => {
    const { verification_code, phone } = req.body;
    if (!verification_code || !phone) {
        return res.status(400).send({
            message: 'Venligst indtast din aktiveringskode og telefonnummer',
            status: 400
        });
    } else {
        const [user] = await db.all('SELECT * FROM users WHERE phone = ? AND verified = 0', [phone]);
        if (!user) {
            return res.status(400).send({
                message: 'Kunne ikke finde din bruger. <br>Prøv at oprette en ny bruger eller <br> anmod om en ny aktiveringskode',
                status: 400
            });
        } else if (user.verification_code_expiration < Date.now()) {
            return res.status(400).send({
                message: 'Din aktiveringskode er udløbet',
                status: 400
            });
        } else {
            const isVerification_code_correct = await bcrypt.compare(verification_code, user.verification_code);
            if (!isVerification_code_correct) {
                return res.send(400).send({
                    message: "Din aktiveringskode er ikke korrekt, anmod om en ny hvis du ikke kan finde din egen",
                    status: 400
                });
            }
            await db.run('UPDATE users SET verified = 1, verification_code = NULL, verification_code_expiration = NULL WHERE id = ?', [user.id]);
            const message = `Hej ${user.first_name} ${user.last_name}, din bruger er nu aktiveret hos UngLøn`;
            await sendSMS(message, user.phone);
            return res.status(200).send({
                message: 'din bruger er nu aktiveret',
                status: 200
            });
        }
    }
});

router.post('/api/auth/resend-verification', async (req, res) => {
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
        } else if (user.verified === 1) {
            return res.status(400).send({
                message: 'Din bruger er allerede aktiveret',
                status: 400
            });
        } else {
            const verification_code = crypto.randomBytes(4).toString('hex');
            const verification_code_expiration = Date.now() + (24 * 60 * 60 * 1000);
            const hashed_verification_code = await bcrypt.hash(verification_code, 12)
            await db.run('UPDATE users SET verification_code = ?, verification_code_expiration = ? WHERE id = ?', [hashed_verification_code, verification_code_expiration, user.id]);
            const message = `Din aktiveringskode udløber om 24 timer: ${verification_code}`;
            sendSMS(message, user.phone);
            return res.status(200).send({
                message: 'Din aktiveringskode er nu sendt til dig',
                status: 200,
            })
        }
    }
});

router.post('/api/auth/register', async (req, res) => {
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
                const verification_code = crypto.randomBytes(4).toString('hex');
                const hashed_verification_code = await bcrypt.hash(verification_code, 12);
                const verification_code_expiration = Date.now() + (24 * 60 * 60 * 1000);
                const message = `Din aktiveringskode udløber om 24 timer: ${verification_code}`;
                sendSMS(message, phone);
                const user = await db.run('INSERT INTO users (first_name, last_name, email, password, phone, verification_code, verification_code_expiration) VALUES (?, ?, ?, ?, ?, ?, ?)', [first_name, last_name, email, hashedPassword, phone, hashed_verification_code, verification_code_expiration]);
                await db.run('INSERT INTO users_tax_data (user_id) VALUES (?)', [user.lastID]);
                return res.status(200).send({
                    message: 'Du er nu oprettet som bruger, du vil modtage en SMS med aktiveringskoden',
                    status: 200,
                })
            }
        }
    }
});

router.post('/api/auth/logout', (req, res) => {
    req.session.destroy()
    return res.status(200).send({
        message: 'Du er nu logget ud',
        status: 200,
    })
});

router.post('/api/auth/forgot-password', async (req, res) => {
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
            const token = crypto.randomBytes(10).toString('hex');
            const token_expiration = Date.now() + 3600000;
            await db.run('UPDATE users SET token = ?, token_expiration = ? WHERE LOWER(email) = ?', [token, token_expiration, email.toLowerCase()]);
            const message = `Du har anmodet om at nulstille din adgangskode, tjek din email for at nulstille din adgangskode`;
            sendSMS(message, user.phone);
            return sendForgotPasswordMail(res, email, token);
        }
    }
});

router.post('/api/auth/reset-password', async (req, res) => {
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
                        error: 'Din token virker ikke, anmod om en ny',
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

router.post('/api/auth/check-token', async (req, res) => {
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
    if (token !== user.token) {
        return res.status(400).send({
            message: 'Noget gik galt',
            error: 'Din token virker ikke, anmod om en ny',
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

router.get('/api/private/auth/check-session', async (req, res) => {
  
    return res.status(200).send({
        message: 'Session fundet',
        status: 200
    })
});


export default router;
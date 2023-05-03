import { Router } from 'express';
import { sendForgotPasswordMail } from '../util/mailSender.js';
import db from "../database/connection.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const router = Router();

router.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({
            message: 'Please Fill In All Fields',
            status: 400
        });
    } else {
        const [user] = await db.all('SELECT * FROM users WHERE LOWER(email) = ?', [email.toLowerCase()]);
        if (!user) {
            return res.status(400).send({
                message: 'Could Not Find User',
                status: 400
            });
        } else {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).send({
                    message: 'Invalid Password',
                    status: 400
                });
            } else {
                const { password, token, token_expiration, ...userWithoutPassword } = user;
                req.session.user = userWithoutPassword;
                return res.status(200).send({
                    message: 'Logged In',
                    user: userWithoutPassword,
                    status: 200
                });
            }
        }
    }
});

router.post('/api/register', async (req, res) => {
    const { first_name, last_name, email, password, confirm_password } = req.body;
    if (!first_name || !last_name || !email || !password || !confirm_password) {
        return res.status(400).send({
            message: 'Please Fill In All Fields',
            status: 400
        });
    } else {
        const [user] = await db.all('SELECT * FROM users WHERE email = ?', [email]);
        if (user) {
            return res.status(400).send({
                message: 'User Already Exists',
                status: 400
            });
        } else {
            if (password !== confirm_password) {
                return res.status(400).send({
                    message: 'Passwords Do Not Match',
                    status: 400
                });
            } else {
                const hashedPassword = await bcrypt.hash(password, 12);
                await db.run('INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)', [first_name, last_name, email, hashedPassword]);
                return res.status(200).send({
                    message: 'Successfully Registered',
                    status: 200,
                })
            }
        }
    }
});

router.post('/api/logout', (req, res) => {
    req.session.destroy()
    return res.status(200).send({
        message: 'Logged out',
        status: 200,
    })
});

router.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({
            message: 'Please Fill out your email',
            status: 400
        });
    } else {
        const [user] = await db.all('SELECT * FROM users WHERE LOWER(email) = ?', [email.toLowerCase()]);
        if (!user) {
            return res.status(400).send({
                message: 'Could Not Find User',
                status: 400
            });
        } else {
            const token = crypto.randomBytes(25).toString('hex');
            const token_expiration = Date.now() + 3600000;
            await db.run('UPDATE users SET token = ?, token_expiration = ? WHERE email = ?', [token, token_expiration, email]);
            return sendForgotPasswordMail(res, email, token);
        }
    }
});

router.post('/api/reset-password', async (req, res) => {
    const { token, password, confirm_password } = req.body;
    if (!password || !confirm_password) {
        return res.status(400).send({
            message: 'Please Fill In All Fields',
            status: 400
        });
    } else if (!token) {
        return res.status(400).send({
            message: 'Something went wrong',
            error: 'Token Not Found',
            status: 400
        });
    } else {
        if (password !== confirm_password) {
            return res.status(400).send({
                message: 'Passwords Do Not Match',
                status: 400
            });
        } else {
            const [user] = await db.all('SELECT * FROM users WHERE token = ?', [token]);
            if (!user) {
                return res.status(400).send({
                    message: 'Something went wrong',
                    error: 'Could Not Find User',
                    status: 400
                });
            } else {
                if (token !== user.token) {
                    return res.status(400).send({
                        message: 'Something went wrong',
                        error: 'Invalid Token',
                        status: 400
                    });
                } else {
                    if (Date.now() > Number(user.token_expiration)) {
                        return res.status(400).send({
                            message: 'Something went wrong',
                            error: 'Token Expired',
                            status: 400
                        });
                    } else {
                        const hashedPassword = await bcrypt.hash(password, 12);
                        await db.run('UPDATE users SET password = ?, token = NULL, token_expiration = NULL WHERE id = ?', [hashedPassword, user.id]);
                        return res.status(200).send({
                            message: 'Successfully Reset Password',
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
            message: 'No Token Provided',
            status: 400
        });
    };
    const [user] = await db.all('SELECT * FROM users WHERE token = ?', [token]);
    if (!user) {
        return res.status(400).send({
            message: 'Link is broken',
            status: 400
        });
    }
    if (Number(user.token_expiration) < Date.now()) {
        return res.status(400).send({
            message: 'Link Expired',
            status: 400
        });
    }
    return res.status(200)
});


export default router;
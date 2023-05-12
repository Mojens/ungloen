import { Router } from 'express';
import { sendContactMail, sendFooterContactMail } from '../util/mailSender.js';
import db from '../database/connection.js';
import dotenv from 'dotenv/config';


const router = Router();

router.get('/api/private/users/:id', async (req, res) => {
    if (req.session.user.id !== Number(req.params.id)) {
        return res.status(401).send({
            message: 'Ingen adgang',
            status: 401
        });
    }
    const [user] = await db.all('SELECT * FROM users WHERE id = ?', [Number(req.params.id)]);
    if (!user) {
        return res.status(404).send({
            message: 'Kunne ikke hente bruger informationer',
            status: 404
        });
    } else {
        return res.status(200).send({
            message: 'Bruger informationer hentet',
            user: user,
            status: 200
        });
    }
})

router.put('/api/private/users/:id', async (req, res) => {
    const { first_name, last_name, email } = req.body;
    if (req.session.user.id !== Number(req.params.id)) {
        return res.status(401).send({
            message: 'Ingen adgang',
            status: 401
        });
    }
    if (!first_name || !last_name || !email) {
        return res.status(400).send({
            message: 'Venligst udfyld alle felter',
            status: 400
        });
    }
    await db.run('UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?', [first_name, last_name, email, Number(req.params.id)]);
    const [user] = await db.all('SELECT * FROM users WHERE id = ?', [Number(req.params.id)]);
    const { password, token, token_expiration, ...userWithoutPassword } = user;
    req.session.user = userWithoutPassword;
    return res.status(200).send({
        message: 'Bruger informationer opdateret',
        user: userWithoutPassword,
        status: 200
    });
});

router.post('/api/contact/footer', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({
            message: 'Venligst udfyld din email',
            status: 400
        });
    }
    return sendFooterContactMail(res, email);
});

router.post('/api/contact', async (req, res) => {
    const { email, message, name, title } = req.body;
    if (!email || !message || !name || !title) {
        return res.status(400).send({
            message: 'Venligst udfyld alle felter',
            status: 400
        });
    }
    return sendContactMail(res, email, name, message, title)
});

export default router;
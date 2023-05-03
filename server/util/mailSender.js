import nodemail from 'nodemailer';
import dotenv from 'dotenv/config';

const transporter = nodemail.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    secure: false
});

export function sendForgotPasswordMail(res, email, token) {
    const mailData = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Nulstil din adgangskode',
        html: `
        <p>Du modtager denne e-mail, fordi du har anmodet om at nulstille din adgangskode.</p>
        <p>Hvis du ikke har bedt om at nulstille din adgangskode, skal du ignorere denne e-mail.</p>
        <p>Klik venligst på følgende link for at nulstille din adgangskode:</p>
        <a href="http://localhost:5173/reset-password/${token}">Nulstil adgangskode</a>
        <p>Dette link udløber om 1 time.</p>
        `,
    };

    transporter.sendMail(mailData, (err) => {
        if (err) {
            return res.status(400).send({
                message: 'Noget gik galt, prøv igen senere',
                status: 400
            });
        } else {
            return res.status(200).send({
                message: 'Email og SMS er sendt',
                status: 200
            });
        }
    });
}

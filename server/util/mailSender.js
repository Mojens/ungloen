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
        <a href="http://localhost:5173/nulstil-adgangskode/${token}">Nulstil adgangskode</a>
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
                message: 'Email er sendt',
                status: 200
            });
        }
    });
}
export function sendFooterContactMail(res, email) {
    const mailData = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Modtaget besked',
        html: `
        <p>Tak for at tage kontakt, vi vender tilbage hurtigst muligt.</p>
        `,
    };
    const mailDataToLead = {
        from: process.env.MAIL_USER,
        to: process.env.MAIL_USER,
        subject: 'Modtaget besked',
        html: `
        <p>${email} har taget kontakt igennem Contact Footer.</p>
        `,
    };
    transporter.sendMail(mailDataToLead)
    transporter.sendMail(mailData, (err) => {
        if (err) {
            return res.status(400).send({
                message: 'Noget gik galt, prøv igen senere',
                status: 400
            });
        } else {
            return res.status(200).send({
                message: 'Email er sendt',
                status: 200
            });
        }
    });
}
export function sendContactMail(res, email, name, message, title) {
    const mailData = {
        from: email,
        to: process.env.MAIL_USER,
        subject: title,
        html: `
          <p>Navn: ${name}</p>
          <p>Email: ${email}</p>
          <p>Besked: ${message}</p>
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
                message: 'Email er sendt',
                status: 200
            });
        }
    });
}
export function sendInvitationForTeam(email, res, token, teamName, userName, teamId){
    const mailData = {
        from: process.env.MAIL_USER,
        to: email,
        subject: `Invitation til ${teamName}`,
        html: `
        <p>
        Hej!, du er blevet inviteret til at deltage i ${teamName} af ${userName}.
        </p>
        <p>
        Klik venligst på følgende link for at acceptere invitationen:
        </p>
        <a href="http://localhost:5173/accepter-invitation/${token}/${teamId}">Accepter invitation</a>
        <p>Dette link udløber om 7 dage</p>
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
                message: 'Invitation sendt',
                status: 200
            });
        }
    });
}
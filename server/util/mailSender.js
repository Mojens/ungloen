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
        subject: 'Reset your password',
        html: `
          <p>You are receiving this email because you has requested to reset your password.</p>
          <p>If you did not ask to reset your password, please ignore this email.</p>
          <p>Please click on the following link to reset your password:</p>
          <a href="http://localhost:5173/reset-password/${token}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
        `,
    };

    transporter.sendMail(mailData, (err) => {
        if (err) {
            return res.status(400).send({
                message: 'Something went wrong. Please try again.',
                status: 400
            });
        } else {
            return res.status(200).send({
                message: 'Successfully sent email',
                status: 200
            });
        }
    });
}

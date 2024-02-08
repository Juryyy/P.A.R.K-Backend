import nodemailer from 'nodemailer';
import env from './env-config';

const transporter = nodemailer.createTransport({
    host: 'smtp.seznam.cz',
    port: 465,
    secure: true,
    auth: {
        user: env.getEnv('EMAIL_SENDER'),
        pass: env.getEnv('EMAIL_PASSWORD')
    },
});

export default transporter;
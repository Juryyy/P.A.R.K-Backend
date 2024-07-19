import nodemailer from 'nodemailer';
import env from './env-config';

const transporter = nodemailer.createTransport({
    host: env.getEnv('EMAIL_HOST'),
    port: env.getEnv('EMAIL_PORT') as unknown as number,
    secure: true,
    auth: {
        user: env.getEnv('EMAIL_SENDER'),
        pass: env.getEnv('EMAIL_PASSWORD')
    },
});

export default transporter;
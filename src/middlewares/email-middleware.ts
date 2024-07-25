import env from "../configs/env-config";
import logger from "../configs/logger";
import transporter from "../configs/mail-config";
import {styledHtml, authorizationCode, passwordReset} from "../helpers/mail-helper";

async function sendEmail(to: string, subject: string, password: string, firstName: string, lastName: string) {
    const user = `${firstName} ${lastName}`;
    const html = styledHtml(password, user, to);

    const mailOptions = {
        from: env.getEnv('EMAIL_SENDER') as string, // sender address
        to, // list of receivers
        subject, // Subject line
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        logger.error('Error occurred while sending email: %s', error);
    }
}

async function sendCode(to: string, subject: string, code: string, firstName: string, lastName: string) {
    const user = `${firstName} ${lastName}`;
    const html = authorizationCode(code, user, to);

    const mailOptions = {
        from: env.getEnv('EMAIL_SENDER') as string, // sender address
        to, // list of receivers
        subject, // Subject line
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        logger.error('Error occurred while sending email: %s', error);
    }
}

async function sendPassword(to: string, subject: string, password: string, firstName: string, lastName: string) {
    const user = `${firstName} ${lastName}`;
    const html = passwordReset(password, user, to);

    const mailOptions = {
        from: env.getEnv('EMAIL_SENDER') as string, // sender address
        to, // list of receivers
        subject, // Subject line
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        logger.error('Error occurred while sending email: %s', error);
    }
}



export { sendEmail, sendCode, sendPassword };
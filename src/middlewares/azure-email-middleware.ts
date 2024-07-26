import env from "../configs/env-config";
import logger from "../configs/logger";
import { styledHtml, authorizationCode, passwordReset } from "../helpers/mail-helper";
import client from '../configs/onedrive-config'; // Import the client

const emailSender = env.getEnv('EMAIL_SENDER_PARK') as string; // Get the sender email from environment variables
const emailSenderName = env.getEnv('EMAIL_SENDER_NAME_PARK') as string; // Get the sender name from environment variables
const emailSenderAvatar = env.getEnv('EMAIL_SENDER_AVATAR_PARK') as string; // Get the sender avatar URL from environment variables

const sendMail = async (to: string, subject: string, html: string) => {
    const mail = {
        message: {
            subject: subject,
            body: {
                contentType: 'HTML',
                content: html,
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: to,
                    },
                },
            ],
            from: {
                emailAddress: {
                },
            },
        },
        saveToSentItems: 'true',
    };

    try {
        await client.api(`/users/${emailSender}/sendMail`).post(mail);
        logger.info(`Message sent to ${to}`);
    } catch (error) {
        console.error(error);
        logger.error(`Error occurred while sending email to ${to}`);
    }
};

async function sendEmail(to: string, subject: string, password: string, firstName: string, lastName: string) {
    const user = `${firstName} ${lastName}`;
    const html = styledHtml(password, user, to);
    console.log(password)
    await sendMail(to, subject, html);
}

async function sendCode(to: string, subject: string, code: string, firstName: string, lastName: string) {
    const user = `${firstName} ${lastName}`;
    const html = authorizationCode(code, user, to);
    await sendMail(to, subject, html);
}

async function sendPassword(to: string, subject: string, password: string, firstName: string, lastName: string) {
    const user = `${firstName} ${lastName}`;
    const html = passwordReset(password, user, to);
    await sendMail(to, subject, html);
}

export { sendEmail, sendCode, sendPassword };
import env from "../configs/env-config";
import transporter from "../configs/mail-config";
import {styledHtml} from "../helpers/mail-helper";

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
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error occurred while sending email: %s', error);
    }
}

export default sendEmail;
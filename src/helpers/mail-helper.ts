export function styledHtml(password: string, user: string, email: string) {
    return `
    <html>
<body>
    <table width="50%" height="75%" style="background-color: #D9D9D9; border-radius: 150px; margin: 0 auto; background-color: #D5ECA1;">
        <tr>
            <td align="center">
                <table width="1200px" height="941px">
                    <tr>
                        <td align="center" style="font-size: 48px; font-family: Istok Web; font-weight: 400; color: black;">
                        Hi!
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="font-size: 48px; font-family: Istok Web; font-weight: 400; color: black;">
                         ${user}
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="font-size: 24px; font-family: Istok Web; font-weight: 400; color: black;">
                            We would love to welcome you to P.A.R.K Exams center. Part of the work is done through our application. Your login details:
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="font-size: 24px; font-family: Istok Web; font-weight: 700; color: black;">
                            Login: ${email}<br/>
                            Password: ${password}
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="font-size: 24px; font-family: Istok Web; font-weight: 400; color: black;">
                            Thank you for your time and we look forward to working with you.<br/>
                            Best regards,<br/>
                            P.A.R.K Team
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <img width="269px" height="103px" src="https://www.zkouskypark.cz/www/upload/logo/20210118070023666.png" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

export function generatedHtml(password: string, user: string, email: string) {
    return `
    <html>
        <body>
            <p>Hi ${user},</p>
            <p>We would love to welcome you to P.A.R.K. Exam center. Part of the work is done through our application. Your login details:</p>
            <ul>
            <li> Your email is: ${email} </li>
            <li> Your password is: ${password} </li>
            </ul>
            <p>Thank you for your time and we look forward to working with you.</p>
            <p>Best regards,</p>
            <p>Team</p>
        </body>
    </html>
    `;
}

export function authorizationCode(code: string, user: string, email: string) {
    return `
    <html>
        <body>
            <p>Hi ${user},</p>
            <p>Your authorization code is: ${code} </p>
            <p>It will expire in 10 minutes.</p>
        </body>
    </html>
    `;
}
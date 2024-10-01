export function styledHtml(password: string, user: string, email: string) {
    return `
    <html>
<head>
    <style>
        body {
            background-color: #f4f4f9;
            font-family: 'Istok Web', sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 60%;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1), 0 10px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #e0e0e0;
        }
        .header {
            background-color: #d5eca1;
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #cccccc;
        }
        .header img {
            width: 150px;
        }
        .content {
            padding: 30px;
            text-align: center;
            color: #333333;
        }
        .content h1 {
            font-size: 48px;
            font-weight: 400;
            margin-bottom: 10px;
        }
        .content h2 {
            font-size: 36px;
            font-weight: 400;
            margin-bottom: 20px;
        }
        .content p {
            font-size: 24px;
            font-weight: 400;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .credentials {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
        }
        .footer {
            background-color: #f4f4f9;
            padding: 20px;
            text-align: center;
            font-size: 20px;
            font-weight: 400;
            color: #666666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.zkouskypark.cz/www/upload/logo/20210118070023666.png" alt="P.A.R.K. Logo">
        </div>
        <div class="content">
            <h1>Hi!</h1>
            <h2>${user}</h2>
            <p>We would love to welcome you to P.A.R.K. Exams center. Part of the work is done through our application. Your login details:</p>
            <div class="credentials">
                Login: ${email}<br/>
                Password: ${password}
            </div>
            <p>Thank you for your time and we look forward to working with you.</p>
            <p>Best regards,<br/>P.A.R.K. Team</p>
        </div>
        <div class="footer">
            © 2024 P.A.R.K. Exams Center. All rights reserved.
            This is an automated message. Please do not reply. If you have any questions, please contact Exam Day Manager or at info@zkouskypark.cz
        </div>
    </div>
</body>
</html>
    `;
}

export function authorizationCode(code: string, user: string, email: string) {
    return `
    <html>
<head>
    <style>
        body {
            background-color: #f4f4f9;
            font-family: 'Istok Web', sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 60%;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1), 0 10px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #e0e0e0;
        }
        .header {
            background-color: #d5eca1;
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #cccccc;
        }
        .header img {
            width: 150px;
        }
        .content {
            padding: 30px;
            text-align: center;
            color: #333333;
        }
        .content h1 {
            font-size: 48px;
            font-weight: 400;
            margin-bottom: 10px;
        }
        .content h2 {
            font-size: 36px;
            font-weight: 400;
            margin-bottom: 20px;
        }
        .content p {
            font-size: 24px;
            font-weight: 400;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .credentials {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
        }
        .footer {
            background-color: #f4f4f9;
            padding: 20px;
            text-align: center;
            font-size: 20px;
            font-weight: 400;
            color: #666666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.zkouskypark.cz/www/upload/logo/20210118070023666.png" alt="P.A.R.K. Logo">
        </div>
        <div class="content">
            <h1>Hi!</h1>
            <h2>${user}</h2>
            <p>Your authorization code is:</p>
            <div class="credentials">
                ${code}
            </div>
            <p>It will expire in 10 minutes.</p>
            <p>If you did not request this change, please contact us immediately.</p>
        </div>
        <div class="footer">
            © 2024 P.A.R.K. Exams Center. All rights reserved.
            This is an automated message. Please do not reply. If you have any questions, please contact Exam Day Manager or at info@zkouskypark.cz
        </div>
    </div>
</body>
</html>
    `;
}

export function passwordReset(password: string, user: string, email: string) {
    return `
    <html>
<head>
    <style>
        body {
            background-color: #f4f4f9;
            font-family: 'Istok Web', sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 60%;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1), 0 10px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #e0e0e0;
        }
        .header {
            background-color: #d5eca1;
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #cccccc;
        }
        .header img {
            width: 150px;
        }
        .content {
            padding: 30px;
            text-align: center;
            color: #333333;
        }
        .content h1 {
            font-size: 48px;
            font-weight: 400;
            margin-bottom: 10px;
        }
        .content h2 {
            font-size: 36px;
            font-weight: 400;
            margin-bottom: 20px;
        }
        .content p {
            font-size: 24px;
            font-weight: 400;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .credentials {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
        }
        .footer {
            background-color: #f4f4f9;
            padding: 20px;
            text-align: center;
            font-size: 20px;
            font-weight: 400;
            color: #666666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.zkouskypark.cz/www/upload/logo/20210118070023666.png" alt="P.A.R.K. Logo">
        </div>
        <div class="content">
            <h1>Hi!</h1>
            <h2>${user}</h2>
            <p>Your password has been reseted. Your new password is:</p>
            <div class="credentials">
                ${password}
            </div>
            <p>It is recommended to change it to something different once you log in.</p>
            <p>If you did not request this change, please contact us immediately.</p>
        </div>
        <div class="footer">
            © 2024 P.A.R.K. Exams Center. All rights reserved.
            This is an automated message. Please do not reply. If you have any questions, please contact Exam Day Manager or at info@zkouskypark.cz
        </div>
    </div>
</body>
</html>
    `;
}

export function newAvailabilityDates(user: string, startDate: string, endDate: string, dateOfSubmits: string) {
    return `
    <html>
<head>
    <style>
        body {
            background-color: #f4f4f9;
            font-family: 'Istok Web', sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 60%;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1), 0 10px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #e0e0e0;
        }
        .header {
            background-color: #d5eca1;
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #cccccc;
        }
        .header img {
            width: 150px;
        }
        .content {
            padding: 30px;
            text-align: center;
            color: #333333;
        }
        .content h1 {
            font-size: 48px;
            font-weight: 400;
            margin-bottom: 10px;
        }
        .content h2 {
            font-size: 36px;
            font-weight: 400;
            margin-bottom: 20px;
        }
        .content p {
            font-size: 24px;
            font-weight: 400;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .credentials {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
        }
        .footer {
            background-color: #f4f4f9;
            padding: 20px;
            text-align: center;
            font-size: 20px;
            font-weight: 400;
            color: #666666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.zkouskypark.cz/www/upload/logo/20210118070023666.png" alt="P.A.R.K. Logo">
        </div>
        <div class="content">
            <h1>Hi ${user}!</h1>
            <h2>New Availability Dates</h2>
            <p>We have created new availability dates and need you to review them and mark your availability.</p>
            <div class="credentials">
            <h2> Please have them completed by ${dateOfSubmits}:</h2><br/>
                Availability starts: ${startDate}<br/>
                Availability ends: ${endDate}
            </div>
            <p>Please log in to your account and update your availability accordingly.</p>
            <p>If you have any questions or need assistance, feel free to reach out to us.</p>
            <p>Best regards,<br/>P.A.R.K. Team</p>
        </div>
        <div class="footer">
            © 2024 P.A.R.K. Exams Center. All rights reserved.
            This is an automated message. Please do not reply. If you have any questions, please contact Exam Day Manager or at info@zkouskypark.cz
        </div>
    </div>
</body>
</html>
    `;
}

export function examAssignment(user: string, exam: string, role: string, date : string, time: string) {
    return `
    <html>
<head>
    <style>
        body {
            background-color: #f4f4f9;
            font-family: 'Istok Web', sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 60%;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1), 0 10px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #e0e0e0;
        }
        .header {
            background-color: #d5eca1;
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #cccccc;
        }
        .header img {
            width: 150px;
        }
        .content {
            padding: 30px;
            text-align: center;
            color: #333333;
        }
        .content h1 {
            font-size: 48px;
            font-weight: 400;
            margin-bottom: 10px;
        }
        .content h2 {
            font-size: 36px;
            font-weight: 400;
            margin-bottom: 20px;
        }
        .content p {
            font-size: 24px;
            font-weight: 400;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .credentials {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
        }
        .footer {
            background-color: #f4f4f9;
            padding: 20px;
            text-align: center;
            font-size: 20px;
            font-weight: 400;
            color: #666666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.zkouskypark.cz/www/upload/logo/20210118070023666.png" alt="P.A.R.K. Logo">
        </div>
        <div class="content">
            <h1>Hi ${user}!</h1>
            <h2>New Exam Assignment</h2>
            <p>We are pleased to inform you that you have been assigned to the following exam:</p>
            <div class="credentials">
                Date: ${date} - ${time}<br/>
                Location: ${exam}<br/>
                Role: ${role}<br/>
            </div>
            <p>Visit the application for more details.</p>
            <p>The exam might not be complete yet. If so, you will be informed about completion in the near future.</p>
            <p>Please make sure to prepare accordingly and reach out to us if you have any questions or concerns.</p>
            <p>Thank you for your dedication and hard work.</p>
            <p>Best regards,<br/>P.A.R.K. Team</p>
        </div>
        <div class="footer">
            © 2024 P.A.R.K. Exams Center. All rights reserved.
            This is an automated message. Please do not reply. If you have any questions, please contact Exam Day Manager or at info@zkouskypark.cz
        </div>
    </div>
</body>
</html>
    `;
}


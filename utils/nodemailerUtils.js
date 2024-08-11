const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
    timeout: 10000, // 10 seconds
});

transporter.verify((error, success) => {
    if (error) {
        console.log('Transporter verification error:', error);
    } else {
        console.log('Transporter is ready to send emails');
    }
});

const generateEmailContent = (name) =>
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                margin: 0;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #4CAF50;
            }
            p {
                font-size: 16px;
                line-height: 1.5;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Thank You, ${name}!</h1>
            <p>Thank you for letting us know about the garbage collected near you. We appreciate your feedback and will look into quickly resolving the issue.</p>
            <p>Best regards,<br>The HWI Team</p>
            <div class="footer">
                <p>If you have any more concerns, feel free to contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
            </div>
        </div>
    </body>
    </html>`;

const generateGovEmailContent = (name, email, longitude, latitude) =>
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Garbage Issue Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #4CAF50;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Garbage Issue Report</h1>
        <p>Dear Civic Body,</p>
        <p>This is to bring to your attention that garbage has been spotted at the following location:</p>
        <p><strong>Location Coordinates:</strong></p>
        <p>Latitude: <strong>${latitude}</strong></p>
        <p>Longitude: <strong>${longitude}</strong></p>
        <p>The issue has been raised by the following user:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>We kindly request your prompt action to address this issue. The health and safety of the community are of utmost importance, and we trust that you will take the necessary steps to resolve this matter.</p>
        <p>Thank you for your attention to this matter.</p>
        <p>Sincerely,</p>
        <p>HWI</p>
    </div>
</body>
</html>
`;

const sendEmail = (to, subject, text, html = '') => {
    console.log('Sending email to:', to);
    const mailOptions = {
        from: process.env.SMTP_PASSWORD,
        to,
        subject,
        text,
        html,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                reject(error);
            } else {
                console.log('Email sent:', info.response);
                resolve(info);
            }
        });
    });
};

module.exports = {
    sendEmail,
    generateEmailContent,
    generateGovEmailContent,
};

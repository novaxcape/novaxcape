require('dotenv').config();
const { TransactionalEmailsApi, SendSmtpEmail } = require('@getbrevo/brevo');

const brevoClient = new TransactionalEmailsApi();
brevoClient.setApiKey('api-key', process.env.BREVO_API_KEY || process.env.BERVO_API_KEY);

const brevo = async (userEmail, username, html) => {
    const senderEmail = process.env.SMTP_EMAIL?.trim();

    if (!senderEmail) {
        throw new Error('SMTP_EMAIL is required for Brevo sender email');
    }

    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = "OTP Verification";
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = {
        email: senderEmail,
        name: "Novaxcape Support",
    };
    sendSmtpEmail.to = [{
        email: userEmail,
        name: username
    }];

    await brevoClient.sendTransacEmail(sendSmtpEmail);
    console.log('email sent successfully to', userEmail);
};

module.exports = { brevo };

require('dotenv').config();
const { TransactionalEmailsApi, SendSmtpEmail } = require('@getbrevo/brevo');

const brevoClient = new TransactionalEmailsApi();

brevoClient.setApiKey('api-key', process.env.BREVO_API_KEY || process.env.BREVO_API_KEY);

exports.sendEmail = async (payloads) => {
    const senderEmail = process.env.SMTP_EMAIL?.trim();

    if (!senderEmail) {
        throw new Error('SMTP_EMAIL is required for Brevo sender email');
    }

    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = "OTP Verification";
    sendSmtpEmail.htmlContent = payloads.html;
    sendSmtpEmail.sender = {
        email: senderEmail,
        name: "Novaxcape Support",
    };
    sendSmtpEmail.to = [{
        email: payloads.email,
        name: payloads.name
    }];

    await brevoClient.sendTransacEmail(sendSmtpEmail);
    console.log('email sent successfully to', payloads.email);
};

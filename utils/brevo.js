require('dotenv').config();
const BrevoClient = require("@getbrevo/brevo");

const brevoClient = new BrevoClient.TransactionalEmailsApi()
brevoClient.setApiKey(
    BrevoClient.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY || process.env.BERVO_API_KEY
);

const brevo = async (userEmail, username, html) => {
    const senderEmail = process.env.SMTP_EMAIL?.trim();

    if (!senderEmail) {
        throw new Error('SMTP_EMAIL is required for Brevo sender email');
    }

    const sendSmtpEmail = new BrevoClient.SendSmtpEmail()
    const data = {
        htmlContent: `<html><head></head><body><p>Hello ${username} ,</p>Welcome to backend!.</p></body></html>`,
        sender: {
            email: senderEmail,
            name: "oshio from Splita",
        },
        subject: "Hello from Splita!",
    };
    sendSmtpEmail.to = [{
        email: userEmail
    }] 
    sendSmtpEmail.subject = data.subject
    sendSmtpEmail.htmlContent = html
    sendSmtpEmail.sender = data.sender
   
    await brevoClient.sendTransacEmail(sendSmtpEmail);
    console.log('email sent successfully to', userEmail)
}

module.exports = {brevo}

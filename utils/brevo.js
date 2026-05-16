require('dotenv').config();
const Brevo = require('@getbrevo/brevo');


exports.sendSingleEmail = async (options) => {
  try {
    const apikey = process.env.BREVO_API_KEY;
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apikey);
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.to = [{ email: options.email }];
    sendSmtpEmail.sender = { name: process.env.BREVO_SENDER_NAME, email: process.env.BREVO_SENDER_EMAIL };
    sendSmtpEmail.htmlContent = options.html;
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent to:", options.email);
  } catch (error) {
    throw new Error("Email not sent to:", options.email)
  }
};
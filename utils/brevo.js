require('dotenv').config();
const Brevo = require('@getbrevo/brevo');


exports.sendSingleEmail = async (payloads) => {
  console.log("Sending email to:", payloads);
  try {
    const apikey = process.env.BREVO_API_KEY;
    if (!apikey) {
      throw new Error("BREVO_API_KEY is not configured");
    }

    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apikey);
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = payloads.subject;
    sendSmtpEmail.to = [{ email: payloads.email }];
    sendSmtpEmail.sender = { name: process.env.BREVO_SENDER_NAME, email: process.env.BREVO_SENDER_EMAIL };
    sendSmtpEmail.htmlContent = payloads.html;
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent to:", payloads.email);
  } catch (error) {
    const status = error?.response?.status;
    const brevoMessage = error?.response?.data?.message || error.message;
    const emailError = new Error(`Email not sent to ${payloads.email}: ${brevoMessage}`);

    emailError.code = 'BREVO_EMAIL_FAILED';
    emailError.status = status;
    emailError.brevoMessage = brevoMessage;

    console.error('Brevo email failed:', {
      recipient: payloads.email,
      status,
      message: brevoMessage
    });

    throw emailError;
  }
};

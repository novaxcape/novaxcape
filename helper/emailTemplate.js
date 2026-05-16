exports.sendOTPEmail = async (name, otp) => {
    const html = `
        <html>
            <head></head>
            <body>
                <p>Hello ${name},</p>
                <p>Your OTP for email verification is: <strong>${otp}</strong></p>
                <p>This OTP will expire in 5 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </body>
        </html>
    `;
};
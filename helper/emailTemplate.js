exports.sendOTPEmail = async (name, otp) => {
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
                <body>
                    <p>Hello ${name},</p>
                    <p>Your OTP for email verification is: <strong>${otp}</strong></p>
                    <p>This OTP will expire in 5 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </body>
            </html>
        `
};
exports.sendOTPEmail = async (name, otp) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>

    <style>
        @media screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                border-radius: 0px !important;
            }

            .otp-code {
                font-size: 30px !important;
                letter-spacing: 6px !important;
            }

            .content {
                padding: 30px 20px !important;
            }
        }
    </style>
</head>

<body style="margin:0; padding:0; background-color:#f4f7f6; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">

    <center>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f7f6;">
            <tr>
                <td align="center" style="padding:40px 10px;">

                    <!-- Main Card -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="container"
                        style="width:100%; max-width:500px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.08);">

                        <!-- Header -->
                        <tr>
                            <td align="center"
                                style="padding:30px 20px; background-color:#ffffff; border-bottom:1px solid #eeeeee;">
                                <h1 style="margin:0; color:#00d2ff; font-size:24px; font-weight:800; letter-spacing:1px;">
                                    NOVAXCAPE
                                </h1>
                            </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                            <td class="content"
                                style="padding:40px; text-align:center; color:#333333;">

                                <h2 style="margin:0 0 15px; font-size:22px; font-weight:700; color:#1a1a1a;">
                                    Email OTP Verification
                                </h2>

                                <p style="font-size:16px; line-height:1.6; margin:0 0 20px; color:#666666;">
                                    Hello <strong>${name}</strong>,
                                </p>

                                <p style="font-size:15px; line-height:1.6; margin:0 0 25px; color:#666666;">
                                    Below is your one-time passcode needed to complete your authentication.
                                    Please do not share this code with anyone.
                                </p>

                                <!-- OTP Box -->
                                <div style="background-color:#f8fafc; border:2px dashed #00d2ff; border-radius:12px; padding:25px; margin:20px 0;">

                                    <span class="otp-code"
                                        style="font-family:'Courier New', Courier, monospace; font-size:38px; font-weight:bold; letter-spacing:10px; color:#1a1a1a; display:block;">
                                        ${otp}
                                    </span>

                                </div>

                                <p style="font-size:14px; color:#999999; margin-top:25px; line-height:1.5;">
                                    This OTP is valid for <strong>5 minutes</strong>. <br>
                                    If you did not request this code, please ignore this email or contact support immediately.
                                </p>

                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td align="center"
                                style="padding:25px; background-color:#fafafa; font-size:12px; color:#aaaaaa;">

                                <p style="margin:0;">
                                    If you are having issues with your account, please contact support.
                                </p>

                                <p style="margin:10px 0 0;">
                                    Enjoy the fastest & most secure way to buy Airtime, Mobile Data & pay Bills.
                                </p>

                                <p style="margin:15px 0 0; font-weight:bold;">
                                    NOVAXCAPE Team
                                </p>

                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>
    </center>

</body>
</html>
`
};

exports.resetPasswordTemplate = (data)=> {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your NOVAXCAPE Password</title>
    <style>
        /* Mobile Styles */
        @media screen and (max-width: 600px) {
            .container { width: 100% !important; border-radius: 0px !important; }
            .otp-code { font-size: 32px !important; letter-spacing: 6px !important; }
            .content { padding: 30px 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <center>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7f6;">
            <tr>
                <td align="center" style="padding: 40px 10px;">
                    <!-- Main Card -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="container" style="width: 100%; max-width: 500px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                        
                        <!-- Brand Header -->
                        <tr>
                            <td align="center" style="padding: 30px 20px; background-color: #ffffff; border-bottom: 1px solid #eeeeee;">
                                <h1 style="margin: 0; color: #00d2ff; font-size: 24px; font-weight: 800; letter-spacing: 1px;">NOVAXCAPE</h1>
                            </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                            <td class="content" style="padding: 40px; text-align: center; color: #333333;">
                                <h2 style="margin: 0 0 15px; font-size: 22px; font-weight: 700; color: #1a1a1a;">Password Reset</h2>
                                <p style="font-size: 16px; line-height: 1.5; margin: 0 0 25px; color: #666666;">
                                    Hi ${data.name}, we received a request to reset your password. Use the code below to proceed:
                                </p>
                                
                                <!-- OTP Box -->
                                <div style="background-color: #f8fafc; border: 2px dashed #00d2ff; border-radius: 12px; padding: 25px; margin: 20px 0;">
                                    <span class="otp-code" style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: bold; letter-spacing: 10px; color: #1a1a1a; display: block;">
                                        ${data.otp}
                                    </span>
                                </div>

                                <p style="font-size: 14px; color: #999999; margin-top: 25px; line-height: 1.4;">
                                    This code is valid for <strong>15 minutes</strong>. <br>
                                    If you didn't request this, please ignore this email or contact support if you're concerned about your account security.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td align="center" style="padding: 25px; background-color: #fafafa; font-size: 12px; color: #aaaaaa;">
                                <p style="margin: 0;">&copy; 2026 NOVAXCAPE App. All rights reserved.</p>
                                <p style="margin: 8px 0 0;">
                                    <a href="#" style="color: #00d2ff; text-decoration: none;">Help Center</a> • 
                                    <a href="#" style="color: #00d2ff; text-decoration: none;">Security Tips</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>

    `
}

exports.resetPasswordSuccessfulTemplate = (name)=> {
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful</title>
    <style>
        @media screen and (max-width: 600px) {
            .container { width: 100% !important; border-radius: 0px !important; }
            .content { padding: 30px 20px !important; }
            .cta-button { width: 100% !important; box-sizing: border-box; text-align: center; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <center>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7f6;">
            <tr>
                <td align="center" style="padding: 40px 10px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="container" style="width: 100%; max-width: 500px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                        
                        <!-- Header -->
                        <tr>
                            <td align="center" style="padding: 30px 20px; background-color: #ffffff; border-bottom: 1px solid #eeeeee;">
                                <h1 style="margin: 0; color: #00d2ff; font-size: 24px; font-weight: 800; letter-spacing: 1px;">NOVAXCAPE</h1>
                            </td>
                        </tr>

                        <!-- Success Content -->
                        <tr>
                            <td class="content" style="padding: 40px; text-align: center; color: #333333;">
                                <!-- Success Icon (Simple Circle Check) -->
                                <div style="margin-bottom: 20px; font-size: 50px; color: #10b981;">✓</div>
                                
                                <h2 style="margin: 0 0 15px; font-size: 22px; font-weight: 700; color: #1a1a1a;">Password Reset Successful</h2>
                                <p style="font-size: 16px; line-height: 1.5; margin: 0 0 30px; color: #666666;">
                                    Hi ${name}, your password for <strong>NOVAXCAPE</strong> has been successfully updated. You can now log back into your account using your new credentials.
                                </p>
                                
                                <!-- CTA Button -->
                                <a href="https://novaxcape.app" class="cta-button" style="display: inline-block; background-color: #00d2ff; color: #ffffff; padding: 16px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                                    Log In to NOVAXCAPE
                                </a>

                                <!-- Security Warning -->
                                <p style="font-size: 13px; color: #999999; margin-top: 40px; line-height: 1.4; border-top: 1px solid #f3f4f6; padding-top: 20px;">
                                    <strong>Didn't do this?</strong> If you did not reset your password, please secure your account immediately by contacting our support team.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td align="center" style="padding: 25px; background-color: #fafafa; font-size: 12px; color: #aaaaaa;">
                                <p style="margin: 0;">&copy; 2026 NOVAXCAPE App. All rights reserved.</p>
                                <p style="margin: 8px 0 0;">
                                    <a href="#" style="color: #00d2ff; text-decoration: none;">Security Settings</a> • 
                                    <a href="#" style="color: #00d2ff; text-decoration: none;">Contact Support</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>

    `
}


exports.confirmBooking = ({ location, visitDate, bookingId, passcode }) => {
   return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmed</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;padding:20px;">
    <tr>
        <td align="center">

            <table width="600" cellpadding="0" cellspacing="0" border="0"
                style="background:#ffffff;border-radius:16px;padding:30px;max-width:600px;">

                <!-- Success Icon -->
                <tr>
                    <td align="center" style="padding-bottom:20px;">
                        <div style="
                            width:80px;
                            height:80px;
                            line-height:80px;
                            border-radius:50%;
                            background:#d8f5d9;
                            color:#34a853;
                            font-size:40px;
                            font-weight:bold;
                            text-align:center;">
                            ✓
                        </div>
                    </td>
                </tr>

                <!-- Heading -->
                <tr>
                    <td align="center">
                        <h1 style="
                            margin:0;
                            font-size:36px;
                            color:#222222;
                            font-weight:700;">
                            Booking Confirmed!
                        </h1>
                    </td>
                </tr>

                <tr>
                    <td align="center"
                        style="padding-top:10px;padding-bottom:25px;color:#555555;font-size:16px;">
                        Your booking has been successfully confirmed.
                    </td>
                </tr>

                <!-- Ticket Sent Notice -->
                <tr>
                    <td>
                        <table width="100%" cellpadding="0" cellspacing="0"
                            style="
                            border:1px solid #2d73c8;
                            background:#eaf4ff;
                            border-radius:12px;">
                            <tr>
                                <td style="
                                    padding:15px;
                                    color:#1f5fa8;
                                    font-size:15px;">
                                    📧 Your digital ticket has been sent to your email.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td height="25"></td>
                </tr>

                <!-- Booking Details -->
                <tr>
                    <td style="
                        background:#fafafa;
                        border-radius:12px;
                        padding:20px;">

                        <h3 style="
                            margin:0 0 20px;
                            color:#333333;
                            font-size:22px;">
                            Booking Details
                        </h3>

                        <p style="margin:0 0 18px;">
                            <span style="color:#888888;font-size:13px;">Location</span><br>
                            <strong>${location}</strong>
                        </p>

                        <p style="margin:0 0 18px;">
                            <span style="color:#888888;font-size:13px;">Visit Date</span><br>
                            <strong>${visitDate}</strong>
                        </p>

                        <p style="margin:0;">
                            <span style="color:#888888;font-size:13px;">Booking ID</span><br>
                            <strong>${bookingId}</strong>
                        </p>

                    </td>
                </tr>

                <tr>
                    <td height="25"></td>
                </tr>

                <!-- Passcode Section -->
                <tr>
                    <td style="
                        border:2px solid #ff6b35;
                        background:#fff3ee;
                        border-radius:16px;
                        padding:25px;
                        text-align:center;">

                        <h3 style="
                            margin:0;
                            color:#333333;
                            font-size:24px;">
                            🛡️ Gate Verification Passcode
                        </h3>

                        <p style="
                            margin:15px 0 25px;
                            color:#666666;
                            font-size:14px;">
                            Show this code at the gate for entry verification
                        </p>

                        <div style="
                            display:inline-block;
                            background:#ffffff;
                            border-radius:12px;
                            padding:18px 40px;
                            font-size:40px;
                            font-weight:bold;
                            letter-spacing:10px;
                            color:#111111;">
                            ${passcode}
                        </div>

                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>

</body>
</html>



`
}

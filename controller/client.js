const { clients: Client } = require('../models');
const { autoCapitalizeFirstChar } = require('../helper/validateInput');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const { sendOTPEmail } = require('../helper/emailTemplate');
const { sendSingleEmail } = require('../utils/brevo')


exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, gender } = req.body;

        const normalizedFirstname = await autoCapitalizeFirstChar(firstName);
        const normalizedLastname = await autoCapitalizeFirstChar(lastName);
        const existingClient = await Client.findOne({ where: { email: email.toLowerCase() } });

        if (existingClient) {
            return res.status(400).json({
                message: 'User with this email already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });
        const otpExpire = new Date(Date.now() + 1000 * 60 * 5);

        const newClient = await Client.create({
            firstName: normalizedFirstname,
            lastName: normalizedLastname,
            email: email.toLowerCase(),
            password: hashedPassword,
            phoneNumber,
            gender,
            otp,
            otpExpire
        })

        try {
            await sendSingleEmail({
                email: email.toLowerCase(),
                name: `${normalizedFirstname} ${normalizedLastname}`,
                html: await sendOTPEmail(`${normalizedFirstname} ${normalizedLastname}`, otp),
                subject: "VERIFY OTP"
            })
        } catch (emailError) {
            await newClient.destroy();

            return res.status(502).json({
                message: 'Registration failed because the verification email could not be sent.',
                error: emailError.brevoMessage || emailError.message
            });
        }

        const { password: _password, otp: _otp, ...clientData } = newClient.toJSON();

        res.status(201).json({
            message: 'User registered successfully. Please check your email for OTP verification.',
            data: clientData
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Something went wrong'
        });
    }
};


exports.verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: 'Email and OTP are required'
            });
        }

        const existingClient = await Client.findOne({ where: { email: email.toLowerCase() } });
        if (!existingClient) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (existingClient.isVerified) {
            return res.status(400).json({
                message: 'Email already verified'
            });
        }


        if (Date.now() > existingClient.otpExpire.getTime()) {
            return res.status(400).json({
                message: 'OTP has expired. Please request a new one.'
            });
        }


        if (existingClient.otp !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP'
            });
        }


        await existingClient.update({ isVerified: true, otp: null, otpExpire: null });

        res.status(200).json({
            message: 'Email verified successfully'
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });
    }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        const existingClient = await Client.findOne({ where: { email: email.toLowerCase() } });
        if (!existingClient) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Generate new OTP
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });
        const otpExpire = new Date(Date.now() + 1000 * 60 * 7);


        console.log(otp)
        // Update client with new OTP
        await existingClient.update({ otp, otpExpire });

        await sendSingleEmail({
            email: existingClient.email,
            name: `${existingClient.firstName} ${existingClient.lastName}`,
            html: await sendOTPEmail(`${existingClient.firstName} ${existingClient.lastName}`, otp),
            subject: "VERIFY OTP"
        })

        res.status(200).json({
            message: 'OTP sent successfully. Please check your email.'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

// Login client
exports.login = async (req, res) => {
    try {

        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            })
        }

        const user = await Client.findOne({ where: { email: email.toLowerCase() } })
        if (!user){
            return res.status(404).json({
                message: 'Invalid Credentials'
            })
        }
        
        if (user.isLocked) {
            return res.status(423).json({
                message: 'Account locked'
            })
        }

        const correctPassword = await bcrypt.compare(password, user.password)

        if (!correctPassword) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1
            if (user.failedLoginAttempts >= 5){
                user.isLocked = true
                await user.save()
                return res.status(429).json({
                    message: 'Account locked'
                })
            }

            await user.save()

            return res.status(400).json({
                message: 'Invalid Credentials',
                attemptsRemaining: 5 - user.failedLoginAttempts
            })
        }
        if (user.isVerified == false) {
            return res.status(400).json({
                message: 'Please verify your email'
            })
        };

        user.failedLoginAttempts = 0
        await user.save()

        const token = jwt.sign(
            {id: user.id, role: user.role},
            process.env.SECERT_KEY,
            {expiresIn: '1d'}
        );

        res.status(200).json({
            message: 'Login successfull',
            token,
            user
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: `Something went wrong`
        })
    }
}


exports.updateProfile = async (req, res) => {
    try {
        console.log("anything")
        const files = req.file;
        console.log(files)
        const filePath = files['path']

        const uploadToCloudinary = await cloudinary.uploader.upload(filePath,(error, result) => {
            if (error) {
                console.log(error)
            } else {
                console.log(result)
            };})
       
        const response = [{
            secureUrl: uploadToCloudinary.secure_url,
            publicId: uploadToCloudinary.public_id
        }]
        fs.unlinkSync(filePath)

        const {userName} = req.body;
        const {id} = req.params;

        const client = await Client.findById(id)

        const updatedClient = await Client.update({
            userName,
            profilePicture: response 
        })
        
        res.status(200).json({
            message: "Profile updated successfully",
            data: updatedClient
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        const client = await Client.findOne({ where: { email: email.toLowerCase() } })
        if(client == null){
            return res.status(404).json({
                message: 'Invalid credential'
            })
        }
        const OTP = Math.round(Math.random() * 1e6).toString().padStart(6, "0")

        client.otp = OTP
        console.log(OTP)
        client.otpExpire = new Date(Date.now() + (1000 * 60 * 7))

        await client.save()

        await sendSingleEmail({
            email: client.email,
            name: `${client.firstName} ${client.lastName}`,
            html: await sendOTPEmail(`${client.firstName} ${client.lastName}`, OTP),
            subject: "RESET PASSWORD OTP"
        })

        res.status(200).json({
            message: 'Forgot password successful. Please check your email for OTP.'
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const {otp, password, email} = req.body
        const user = await Client.findOne({ where: { email: email.toLowerCase() } })

        if (user == null) {
            return res.status(404).json({
                message: 'Invalid credential'
            })
        }
        if (!user.otpExpire || Date.now() > user.otpExpire.getTime() || otp !== user.otp){
            return res.status(400).json({
                message: 'Invalid or expired OTP'
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword
        user.otp = null
        user.otpExpire = null
        
        await user.save()

         res.status(200).json({
            message: 'Password reset successful'
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: "Old password and new password are required"
            })
        }

        const client = await Client.findByPk(req.user.id);

        if (!client){
            return res.status(404).json({
                message: "User not found"
            })
        }

        const checkPassword = await bcrypt.compare(oldPassword, client.password);
        if(!checkPassword){
            return res.status(400).json({
                message: "Old password is invalid"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        client.password = hashedPassword;

        await client.save()

        res.status(200).json({
            message: "Password changed successfully"
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.loginWithGoogle = async (req, res) => {
    try {
        const token = await jwt.sign({
            id: req.user._id,
            role: req.user.role
        }, process.env.SECERT_KEY, {expiresIn: '1d'});

        res.status(200).json({
            message: 'Login successful',
            data: req.user.fullname,
            token
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

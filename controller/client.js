const { client } = require('../models');
const { autoCapitalizeFirstChar } = require('../helper/validateInput');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const { sendOTPEmail } = require('../helper/emailTemplate');
const { sendEmail } = require('../utils/brevo')


exports.register = async (req, res) => {
    console.log(`Hello, I'm called`)
    try {
        const { fullName, email, password, phoneNumber, age, gender } = req.body;
        const normalizedName = await autoCapitalizeFirstChar(fullName);
        const existingClient = await client.findOne({ where: { email: email.toLowerCase() } });

        if (existingClient) {
            return res.status(400).json({
                message: 'User with this email already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });

        const newClient = await client.create({
            fullName: normalizedName,
            email: email.toLowerCase(),
            password: hashedPassword,
            phoneNumber,
            age,
            gender,
            otp,
            otpExpire: Date.now() + (1000 * 60 * 5),
        })

        await sendEmail({
            email: email,
            name: normalizedName,
            html: await sendOTPEmail(normalizedName, otp)
        })
        res.status(201).json({
            message: 'User registered successfully. Please check your email for OTP verification.',
            data: newClient
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: `Something wents wrong`
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

        const user = await client.findOne({ where: { email: email.toLowerCase() } });
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: 'Email already verified'
            });
        }

        // Check if OTP is expired
        if (Date.now() > user.otpExpire) {
            return res.status(400).json({
                message: 'OTP has expired. Please request a new one.'
            });
        }

        // Check if OTP matches
        if (user.otp !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP'
            });
        }

        // Mark user as verified
        await user.update({ isVerified: true, otp: null, otpExpire: null });

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

        const user = await client.findOne({ where: { email: email.toLowerCase() } });
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Generate new OTP
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });
        const otpExpire = Date.now() + (1000 * 60 * 5);

        // Update user with new OTP
        await user.update({ otp, otpExpire });

        await sendEmail({
            email: user.dataValues.email,
            name: user.dataValues.fullName,
            html: await sendOTPEmail(user.dataValues.fullName, otp)
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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const user = await client.findOne({ where: { email: email.toLowerCase() } });
        if (!user) {
            return res.status(404).json({
                message: 'Invalid password'
            });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(403).json({
                message: 'Please verify your email before logging in'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.dataValues.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.dataValues.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.dataValues.id,
                fullName: user.dataValues.fullName,
                email: user.dataValues.email
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};
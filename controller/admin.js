const { Admin: adminModel } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
const { sendSingleEmail } = require('../utils/brevo')
const { resetPasswordTemplate, resetPasswordSuccessfulTemplate } = require('../helper/emailTemplate')


exports.registerAdmin = async (req, res) => {
    try {
        const { fullName, email, password } = req.body

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const existingAdmin = await adminModel.findOne({ where: { email: email.toLowerCase() } });
        
                if (existingAdmin) {
                    return res.status(400).json({
                        message: 'User with this email already exists'
                    });
                }

        const admin = await adminModel.create({
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword
        })
        
        res.status(201).json({
            message: "Admin created successfully",
            admin
        })
    } catch (error) {
        next(error);
    }
}

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        if(!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        const admin = await adminModel.findOne({ where: { email: email.toLowerCase() } })
        if (!admin){
            return res.status(404).json({
                message: 'Invalid Credentials'
            })
        }
                
        const correctPassword = await bcrypt.compare(password, admin.password)
        if(!correctPassword) {
            return res.status(404).json({
                message: 'Invalid Credentials'
            })
        }

        const token = jwt.sign(
            {id: admin.id,
            email: admin.email,
            role: admin.role,},
            process.env.SECERT_KEY,
            {expiresIn: '1d'}
        ) 

        res.status(200).json({
            message: "Login successful",
            token,
            admin
        })
    } catch (error) {
         next(error);
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const admin = await adminModel.findOne({ where: { email: email.toLowerCase() } })
        if(admin == null){
            return res.status(404).json({
                message: 'Invalid credential'
            })
        }

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });

        admin.otp = otp
        admin.otpExpire = new Date(Date.now() + (1000 * 60 * 5))

        await sendSingleEmail({
            email: admin.email,
            name: `${admin.fullName}`,
            html: await resetPasswordTemplate(`${admin.fullName}`, otp),
            subject: "RESET PASSWORD OTP"
        })

        res.status(200).json({
            message: "Forgot password successful. Please check your email for OTP"
        })
    } catch (error) {
        next(error);
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const {email, otp, password} = req.body
        const admin = await adminModel.findOne({ where: { email: email.toLowerCase() } })
        if(admin == null){
            return res.status(404).json({
                message: 'Invalid credential'
            })
        }


        if (!admin.otpExpire || Date.now() > admin.otpExpire.getTime() || otp !== admin.otp){
                    return res.status(400).json({
                        message: 'Invalid or expired OTP'
                    })
                }
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt);
        
            admin.password = hashedPassword
            admin.otp = null
            admin.otpExpire = null

            await sendSingleEmail({
                email: admin.email,
                name: `${admin.fullName}`,
                html: await resetPasswordSuccessfulTemplate(`${admin.fullName}`),
                subject: "RESET PASSWORD SUCCESSFUL"
            })
            await admin.save()
            
            res.status(200).json({
                message: 'Password reset successful'
            })
        
    } catch (error) {
        next(error);
    }
}
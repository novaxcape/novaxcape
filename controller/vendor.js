const { Vendor } = require('../models')
const jwt = require('jsonwebtoken')
const {sendSingleEmail} = require('../utils/brevo')
const {sendOTPEmail} = require('../helper/emailTemplate')
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')


exports.register = async (req, res, next) => {
    try {
        const {centerName, email, phoneNumber, password} = req.body;
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });
        const otpExpire = new Date(Date.now() + 1000 * 60 * 5);


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const existingVendor = await Vendor.findOne({where: {email: email.toLowerCase()}})

        if (existingVendor) {
            return res.status(400).json({
                message: "Vendor already exist"
            })       
        }


        const newVendor = await Vendor.create({
            centerName,
            email: email.toLowerCase(),
            phoneNumber,
            password: hashedPassword,
            otp,
            otpExpire
        })
        res.status(201).json({
            message: "Vendor registered successfully, Please check your email to verify OTP"
        });

        (async () => {
            try {
                await sendSingleEmail({
                    email: email.toLowerCase(),
                    name: `${centerName}`,
                    html: await sendOTPEmail(`${centerName}`, otp),
                    subject: "VERIFY OTP"
                })
            } catch (error) {
                await newVendor.destroy()
            }
        })()
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}


exports.verifyEmail = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const vendor = await Vendor.findOne({ where: {email: email.toLowerCase()}});

        if(!vendor) {
            return res.status(404).json({
                message: 'Vendor not found '
            })
        }

        if (vendor.isVerified) {
            return res.status(400).json({
                message: 'Email already verified'
            })
        }

        if (Date.now() > vendor.otpExpire.getTime()) {
            return res.status(400).json({
                message: 'OTP has expired. Please request a new one.'
            })
        }

        if (vendor.otp !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP'
            })
        }

        await vendor.update({ isVerified: true, otp: null, otpExpire: null})

        return res.status(200).json({
            message: 'Email verified successfully'
        })
    } catch (error) {
        console.log(error.message)
        next(error)
}
} 


exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const vendor = await Vendor.findOne({ where: { email: email.toLowerCase() } });

    if (!vendor) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    await vendor.update({ otp, otpExpire });

    res.status(200).json({
      message: 'OTP resent successfully. Please check your email.'
    });

    (async () => {
      try {
        await sendSingleEmail({
          email: email.toLowerCase(),
          name: `${vendor.dataValues.centerName}`,
          html: await sendOTPEmail(`${vendor.dataValues.centerName}`, otp),
          subject: "RESEND: VERIFY OTP"
        })
      } catch (error) {
        next(error);
      }
    })()
  } catch (error) {
    console.log(error.message)
    next(error);
  }
};


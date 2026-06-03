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
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });
    const otpExpire = new Date(Date.now() + 1000 * 60 * 5);
    const vendor = await Vendor.findOne({ where: { email: email.toLowerCase() } });

    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found'
      });
    }

    if (vendor.isVerified) {
      return res.status(400).json({
        message: 'Email already verified'
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
        console.log(error.message)
      }
    })()
  } catch (error) {
    console.log(error.message)
    next(error);
  }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const vendor = await Vendor.findOne({ where: { email: email.toLowerCase() } })
        
        if (!vendor) {
            return res.status(404).json({
                message: 'Invalid Credentials'
            })
        }
        
        
            const correctPassword = await bcrypt.compare(password, vendor.dataValues.password)
        
            if (!correctPassword) {
                return res.status(400).json({
                  message: 'Invalid credential'
                })
              }
        
              await vendor.save()
        
              return res.status(400).json({
                message: 'Invalid Credentials',
                attemptsRemaining: 5 - vendor.dataValues.failedLoginAttempts
              })
            
            if (vendor.dataValues.isVerified == false) {
              return res.status(400).json({
                message: 'Please verify your email'
              })
            };
        
            
            await vendor.save()
        
            const token = jwt.sign(
              { id: vendor.dataValues.id, role: vendor.dataValues.role },
              process.env.SECERT_KEY,
              { expiresIn: '1d' }
            );
        
            res.status(200).json({
              message: 'Login successfull',
              token,
              user
            })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });
    const otpExpire = new Date(Date.now() + 1000 * 60 * 5);
    const vendor = await Vendor.findOne({ where: { email: email.toLowerCase() } })

    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found'
      })
    }

    await vendor.update({ otp, otpExpire });

    res.status(200).json({
      message: 'Forgot password successful. Please check your email for OTP.'
    });

    (async () => {
      try {
        await sendSingleEmail({
          email: email.toLowerCase(),
          name: `${vendor.dataValues.centerName}`,
          html: await sendOTPEmail(`${vendor.dataValues.centerName}`, otp),
          subject: "Reset password"
        })
      } catch (error) {
        console.log(error.message)
      }
    })()
  } catch (error) {
    console.log(error.message)
    next(error);
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    const { password, email } = req.body
    const vendor = await Vendor.findOne({ where: { email: email.toLowerCase() } })

    if (!vendor) {
      return res.status(404).json({
        message: 'Invalid credential'
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);

    await vendor.update({ password: hashedPassword });

    res.status(200).json({
      message: 'Password reset successful'
    })

  } catch (error) {
    next(error);
  }
}


exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const vendor = await Client.findByPk(req.user.id);

    if (!vendor) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const checkPassword = await bcrypt.compare(oldPassword, vendor.dataValues.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Old password is invalid"
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await vendor.update({ password: hashedPassword });

    res.status(200).json({
      message: "Password changed successfully"
    })
  } catch (error) {
    next(error);
  }
}

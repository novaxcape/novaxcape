const { Client, Vendor } = require('../models');
const { autoCapitalizeFirstChar } = require('../helper/validateInput');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const { sendOTPEmail, resetPasswordTemplate, resetPasswordSuccessfulTemplate } = require('../helper/emailTemplate');
const { sendSingleEmail } = require('../utils/brevo');
const cloudinary = require('../middleware/cloudinary');
const fs = require('fs');

const generateOTP = () => ({
  otp: otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true,
    lowerCaseAlphabets: false
  }),
  otpExpire: new Date(Date.now() + 1000 * 60 * 5)
});


exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password  } = req.body;
    const normalizedFirstname = await autoCapitalizeFirstChar(firstName);
    const normalizedLastname = await autoCapitalizeFirstChar(lastName);

    const existingClient = await Client.findOne({ where: { email: email.toLowerCase() } });

    if (existingClient) {
      return res.status(400).json({
        message: 'Client already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const { otp, otpExpire } = generateOTP();

    const newClient = await Client.create({
      firstName: normalizedFirstname,
      lastName: normalizedLastname,
      email: email.toLowerCase(),
      password: hashedPassword,
      otp,
      otpExpire
    });

    res.status(201).json({
      message: 'Client registered successfully. Please check your email for OTP verification.'
    });

    (async () => {
      try {
        await sendSingleEmail({
          email: email.toLowerCase(),
          name: `${normalizedFirstname} ${normalizedLastname}`,
          html: await sendOTPEmail(`${normalizedFirstname} ${normalizedLastname}`, otp),
          subject: "VERIFY OTP"
        })
      } catch (error) {
        await newClient.destroy();
      }
    })()
  } catch (error) {
    console.log(error)
    next(error)
  }
};


exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const clientUser = await Client.findOne({ where: { email: email.toLowerCase() } });

    if (!clientUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (clientUser.isVerified) {
      return res.status(400).json({
        message: 'Email already verified'
      });
    }

    if (Date.now() > clientUser.otpExpire.getTime()) {
      return res.status(400).json({
        message: 'OTP has expired. Please request a new one.'
      });
    }

    if (clientUser.otp !== otp) {
      return res.status(400).json({
        message: 'Invalid OTP'
      });
    }

    await clientUser.update({ isVerified: true, otp: null, otpExpire: null });

    res.status(200).json({
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const clientUser = await Client.findOne({ where: { email: email.toLowerCase() } });

    if (!clientUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Update client with new OTP
    const { otp, otpExpire } = generateOTP();
    await clientUser.update({ otp, otpExpire });

    res.status(200).json({
      message: 'OTP resent successfully. Please check your email.'
    });

    (async () => {
      try {
        await sendSingleEmail({
          email: email.toLowerCase(),
          name: `${clientUser.dataValues.firstName} ${clientUser.dataValues.lastName}`,
          html: await sendOTPEmail(`${clientUser.dataValues.firstName} ${clientUser.dataValues.lastName}`, otp),
          subject: "RESEND: VERIFY OTP"
        })
      } catch (error) {
        next(error);
      }
    })()
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Client.findOne({ where: { email: email.toLowerCase() } })

    if (!user) {
      return res.status(404).json({
        message: 'Invalid Credentials'
      })
    }

    if (user.dataValues.isLocked) {
      return res.status(423).json({
        message: 'Account locked'
      })
    }

    const correctPassword = await bcrypt.compare(password, user.dataValues.password)

    if (!correctPassword) {
      return res.status(400).json({
        message: "Invalid credentials"
      })
    }
    // if (!correctPassword) {
    //   user.dataValues.failedLoginAttempts = (user.dataValues.failedLoginAttempts || 0) + 1
    //   if (user.dataValues.failedLoginAttempts >= 5) {
    //     user.dataValues.isLocked = true
    //     await user.save()
    //     return res.status(429).json({
    //       message: 'Account locked'
    //     })
    //   }

    //   await user.save()

    //   return res.status(400).json({
    //     message: 'Invalid Credentials',
    //     attemptsRemaining: 5 - user.dataValues.failedLoginAttempts
    //   })
    // }
    if (user.dataValues.isVerified == false) {
      return res.status(400).json({
        message: 'Please verify your email'
      })
    };

    // user.dataValues.failedLoginAttempts = 0
    await user.save()

    const token = jwt.sign(
      { id: user.dataValues.id, role: user.dataValues.role },
      process.env.SECERT_KEY,
      { expiresIn: '1d' }
    );

    const data = {
      id: user.dataValues.id,
      email: user.dataValues.email,
      role: user.dataValues.role,
      firstName: user.dataValues.firstName,
      lastName: user.dataValues.lastName
    }
    res.status(200).json({
      message: 'Login successfull',
      token,
      data
    })
  } catch (error) {
    console.log(error.message)
    next(error);
  }
}

exports.updateProfile = async (req, res, next) => {
  try {
    const files = req.file;
    const filePath = files?.path;
    const { userName } = req.body;

    const client = await Client.findByPk(req.user.id);

    if (!client) {
      return res.status(404).json({
        message: 'Client not found'
      });
    }

    if (!filePath) {
      return res.status(400).json({
        message: 'Profile picture is required'
      });
    }

    const uploadToCloudinary = await cloudinary.uploader.upload(filePath, (error, result) => {
      if (error) {
        next(error);
      } else {
        console.log(result)
      };
    })

    fs.unlinkSync(filePath)

    const updatedClient = await client.update({
      userName,
      profilePicture: uploadToCloudinary.secure_url,
      profilePicturePublicUrl: uploadToCloudinary.public_id
    })

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedClient
    })
  } catch (error) {
    console.log(error.message)
    next(error);
  }
}

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const clientData = await Client.findOne({ where: { email: email.toLowerCase() } })

    if (!clientData) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    const { otp, otpExpire } = generateOTP();

    await clientData.update({ otp, otpExpire });

    res.status(200).json({
      message: 'Forgot password successful. Please check your email for OTP.'
    });

    (async () => {
      try {
        await sendSingleEmail({
          email: email.toLowerCase(),
          name: `${clientData.dataValues.firstName} ${clientData.dataValues.lastName}`,
          html: await sendOTPEmail(`${clientData.dataValues.firstName} ${clientData.dataValues.lastName}`, otp),
          subject: "Reset password"
        })
      } catch (error) {
        next(error);
      }
    })()
  } catch (error) {
    next(error);
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    const { password, email } = req.body
    const clientData = await Client.findOne({ where: { email: email.toLowerCase() } })

    if (!clientData) {
      return res.status(404).json({
        message: 'Invalid credential'
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);

    await clientData.update({ password: hashedPassword });

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
    const clientData = await Client.findByPk(req.user.id);

    if (!clientData) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const checkPassword = await bcrypt.compare(oldPassword, clientData.dataValues.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Old password is invalid"
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await clientData.update({ password: hashedPassword });

    res.status(200).json({
      message: "Password changed successfully"
    })
  } catch (error) {
    next(error);
  }
}

exports.loginWithGoogle = async (req, res, next) => {
  try {
    const token = await jwt.sign({
      id: req.user.id,
      role: req.user.role
    }, process.env.SECERT_KEY, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful',
      data: {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role,
        profilePicture: req.user.profilePicture
      },
      token
    })
  } catch (error) {
    next(error);
  }
}

exports.getOneClient = async (req, res, next) => {
  try {
    const oneClient = await Client.findOne({ where: { id: req.params.id } })
    if (!oneClient) {
      return res.status(404).json({
        message: "client not found"
      })
    }
    res.status(200).json({
      message: "client found",
      data: oneClient
    })
  } catch (error) {
    next(error)
  }
}

exports.getAllClients = async (req, res, next) => {
  try {
    const allClients = await client.findAll().sort({ createdAt: -1 })
    res.status(200).json({
      message: "Clients found",
      data: allClients,
      count: allClients.length
    })
  } catch (error) {
    next(error)
  }
}

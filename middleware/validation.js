const joi = require('joi');
const { profile } = require('./passport');


exports.clientReg = (req, res, next) => {
    const schema = joi.object({
        firstName: joi.string().trim().pattern(/^[A-Za-z\s]{3,}$/).required().messages({
            'any.required': 'Firstname is required',
            'string.empty': 'Firstname cannot be empty',
            'string.pattern.base': 'Firstname cannot contain numbers and must be at least 4 characters'
        }),
        lastName: joi.string().trim().pattern(/^[A-Za-z\s]{3,}$/).required().messages({
            'any.required': 'Lastname is required',
            'string.empty': 'Lastname cannot be empty',
            'string.pattern.base': 'Lastname cannot contain numbers and must be at least 4 characters'
        }),
        email: joi.string().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email'
        }),
        phoneNumber: joi.string().pattern(/^\d{11}$/).required().messages({
            'any.required': 'Phone number is required',
            'string.empty': 'Phone number cannot be empty',
            'string.pattern.base': 'Phone number must only contain numbers and must be 11 digits'
        }),
        password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_\-+=])[A-Za-z\d@$!%*?&.#^()_\-+=]{8,}$/).required().messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty',
            'string.pattern.base': 'Password must be atleast 8 characters and must include at least one uppercase, one lowercase, one digit and one special character'
        }),
        gender: joi.string().max(6).min(4).pattern(/^[A-Za-z]/).required().messages({
            'any.required': 'Gender is required',
            'string.empty': 'Gender cannot be empty',
        }),
    })

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        console.log(error.details[0])
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    next()
}


exports.verifyOtp = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email'
        }),
        otp: joi.string().pattern(/^\d{6}$/).required().messages({
            'any.required': 'otp is required',
            'string.empty': 'otp cannot be empty',
            'string.pattern.base': 'otp must only contain numbers and must be 6 digits'
        }),
    })

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        console.log(error.details[0])
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    next()
}


exports.resendOtp = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email'
        })
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        console.log(error.details[0])
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    next()
}


exports.login = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email'
        }),
        password: joi.string().pattern(/^(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty',
            'string.pattern.base': 'Password must be at least 8 characters and must include 1 uppercase and 1 lowercase'
        }),
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        console.log(error.details[0])
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    next()
}


exports.resetPasswordValidator = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email'
        }),
        password: joi.string().pattern(/^(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty',
            'string.pattern.base': 'Password must be at least 8 characters and must include 1 uppercase and 1 lowercase'
        })
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    // console.log(error.details[0])
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    next()
}


exports.forgotPasswordValidator = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email'
        })
    })
    const { error } = schema.validate(req.body, { abortEarly: false });
    // console.log(error.details[0])
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    next()
}


exports.updateProfile = (req, res, next) => {
    const schema = joi.object({
        userName: joi.string().pattern(/^[A-Za-z\s]{3,}$/).required().messages({
            'any.required': 'username is required',
            'string.empty': 'username cannot be empty',
            'string.pattern.base': 'username cannot contain numbers and must be at least 4 characters'
        }),
        profilePictue: joi.optional()
    })

    const { error } = schema.validate(req.body, { abortEarly: false });
    // console.log(error.details[0])
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    next()
}


exports.changePasswordValidator = (req, res, next) => {
    const schema = joi.object({
        oldPassword: joi.string().pattern(/^(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required': 'old password is required',
            'string.empty': 'old password cannot be empty',
            'string.pattern.base': 'old password must be at least 8 characters and must include 1 uppercase and 1 lowercase'
        }),
        newPassword: joi.string().pattern(/^(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required': 'new password is required',
            'string.empty': 'new password cannot be empty',
            'string.pattern.base': 'new password must be at least 8 characters and must include 1 uppercase and 1 lowercase'
        })
    })

    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    next()
}

    exports.createPackageValidation = (req, res, next) => {
    
        const schema = Joi.object({
          packageName: Joi.string().trim().required().messages({
              'string.empty': 'Package name is required',
              'any.required': 'Package name is required'
            }),
          packageType: Joi.string().trim().required().messages({
              'string.empty': 'Package type is required',
              'any.required': 'Package type is required'
            }),
      
          amount: Joi.number().integer().positive().required().messages({
              'number.base': 'Amount must be a number',
              'number.integer': 'Amount must be an integer',
              'number.positive': 'Amount must be greater than 0',
              'any.required': 'Amount is required'
            }),
      
          numberOfPeople: Joi.string()  .trim() .required() .messages({
              'string.empty': 'Number of people is required',
              'any.required': 'Number of people is required'
            })
        });
      
        const { error } = schema.validate(req.body);
      
        if (error) {
          return res.status(400).json({
            success: false,
            message: error.details[0].message
          });
        }
      
        next();
      };
  

      exports.updatePackageValidation = (req, res, next) => {

        const schema = Joi.object({
          packageName: Joi.string().trim(),

          packageType: Joi.string().trim(),

          amount: Joi.number().integer().positive(),
      
          numberOfPeople: Joi.string().trim()
        });
      
        const { error } = schema.validate(req.body);
      
        if (error) {
          return res.status(400).json({
            success: false,
            message: error.details[0].message
          });
        }
      
        next();
      };
      


exports.vendorSignUpValidator = (req, res, next) => {
    const schema = joi.object({
        centerName: joi.string().pattern(/^[A-Za-z\s]{4,}$/).required().messages({
            'any.required': "center name is required",
         "string.empty": "center name cannot be empty",
        'string.pattern.base': "center name must be at least 4 characters long and contain only letters and spaces"
        }),
        email: joi.string().email().required().messages({
            'any.required': "email is required",
            'string.empty': "email cannot be empty",
            "string.email": "email must be a valid email"
        }),
        phoneNumber: joi.string().pattern(/^\d{11}$/).required().messages({
            'any.required': "phone number is required",
            "string.empty": "phone number cannot be empty",
            'string.pattern.base': "phone number must be 11 digits long"
        }),
        password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required': "password is required",
            "string.empty": "password cannot be empty",
            'string.pattern.base': "password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
        })
    })

    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}


exports.kycValidator = (req, res, next) => {
    const schema = joi.object({
        centreName: joi.string().pattern(/^[A-Za-z\s]{4,}$/).required().messages({
            'any.required': "center name is required",
         "string.empty": "center name cannot be empty",
        'string.pattern.base': "center name must be at least 4 characters long and contain only letters and spaces"
        }),
        lankmark: joi.string().pattern(/^[A-Za-z\s]{4,}$/).required().messages({
            'any.required': "lankmark is required",
         "string.empty": "lankmark cannot be empty",
        'string.pattern.base': "lankmark must be at least 4 characters long and contain only letters and spaces"
        }),
        CAC: joi.string().pattern(/^[A-Za-z0-9\s]{4,}$/).required().messages({
            'any.required': "CAC is required",
         "string.empty": "CAC cannot be empty",
        'string.pattern.base': "CAC must be at least 4 characters long and contain only letters, digits and spaces"
        }),
        yearEstalished: joi.integer().pattern(/^\d{4}$/).required().messages({
            'any.required': "Year Established is required",
            "string.empty": "Year Established cannot be empty",
            'string.pattern.base': "Year Established must be 4 digits long"
        }),
        phoneNumber: joi.integer().pattern(/^\d{11}$/).required().messages({
            'any.required': "phone number is required",
            "string.empty": "phone number cannot be empty",
            'string.pattern.base': "phone number must be 11 digits long"
        }),
        centreType: joi.string().pattern().required().messages({
            
        })
    })
}
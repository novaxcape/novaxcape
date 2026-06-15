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
        password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_\-+=])[A-Za-z\d@$!%*?&.#^()_\-+=]{8,}$/).required().messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty',
            'string.pattern.base': 'Password must be atleast 8 characters and must include at least one uppercase, one lowercase, one digit and one special character'
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
        }),
        confirmPassword: joi.string().required().valid(joi.ref('newPassword')).messages({
            'any.only': 'confirm password must match New password',
            'any.required': 'confirm password is required'
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
    
        const schema = joi.object({
          packageName: joi.string().trim().required().messages({
              'string.empty': 'Package name is required',
              'any.required': 'Package name is required'
            }),
          packageType: joi.string().trim().required().messages({
              'string.empty': 'Package type is required',
              'any.required': 'Package type is required'
            }),
      
          amount: joi.number().integer().positive().required().messages({
              'number.base': 'Amount must be a number',
              'number.integer': 'Amount must be an integer',
              'number.positive': 'Amount must be greater than 0',
              'any.required': 'Amount is required'
            }),
      
          numberOfPeople: joi.string().trim().required().messages({
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

        const schema = joi.object({
          packageName: joi.string().trim(),

          packageType: joi.string().trim(),

          amount: joi.number().integer().positive(),
      
          numberOfPeople: joi.string().trim()
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

 exports.createKycValidation = (req, res, next) => {
          const schema = joi.object({
              touristId: joi.string().guid({ version: ['uuidv4'] }).required().messages({
                  'any.required': 'Tourist ID is required',
                  'string.empty': 'Tourist ID cannot be empty',
                  'string.guid': 'Tourist ID must be a valid UUID'
              }),
              lankmark: joi.string().trim().required().messages({
                  'any.required': 'Landmark is required',
                  'string.empty': 'Landmark cannot be empty'
              }),
              CAC: joi.string().trim().required().messages({
                  'any.required': 'CAC is required',
                  'string.empty': 'CAC cannot be empty'
              }),
              yearEstablished: joi.number().integer().min(1900).max(new Date().getFullYear()).required().messages({
                  'any.required': 'Year established is required',
                  'number.base': 'Year established must be a number',
                  'number.integer': 'Year established must be an integer',
                  'number.min': 'Year established must be a valid year',
                  'number.max': `Year established cannot be greater than ${new Date().getFullYear()}`
              }),
              phoneNumber: joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
                  'any.required': 'Phone number is required',
                  'string.empty': 'Phone number cannot be empty',
                  'string.pattern.base': 'Phone number must contain only digits and be between 10 and 15 digits long'
              }),
              centreType: joi.string().trim().required().messages({
                  'any.required': 'Centre type is required',
                  'string.empty': 'Centre type cannot be empty'
              }),
              postal: joi.string().trim().required().messages({
                  'any.required': 'Postal is required',
                  'string.empty': 'Postal cannot be empty'
              }),
              state: joi.string().trim().required().messages({
                  'any.required': 'State is required',
                  'string.empty': 'State cannot be empty'
              }),
              directorFullName: joi.string().trim().required().messages({
                  'any.required': 'Director full name is required',
                  'string.empty': 'Director full name cannot be empty'
              }),
              directorEmail: joi.string().email().required().messages({
                  'any.required': 'Director email is required',
                  'string.empty': 'Director email cannot be empty',
                  'string.email': 'Director email must be a valid email'
              }),
              directorPhoneNumber: joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
                  'any.required': 'Director phone number is required',
                  'string.empty': 'Director phone number cannot be empty',
                  'string.pattern.base': 'Director phone number must contain only digits and be between 10 and 15 digits long'
              }),
              bankName: joi.string().trim().required().messages({
                  'any.required': 'Bank name is required',
                  'string.empty': 'Bank name cannot be empty'
              }),
              accountNumber: joi.string().pattern(/^[0-9]{6,20}$/).required().messages({
                  'any.required': 'Account number is required',
                  'string.empty': 'Account number cannot be empty',
                  'string.pattern.base': 'Account number must contain only digits'
              }),
              accountName: joi.string().trim().required().messages({
                  'any.required': 'Account name is required',
                  'string.empty': 'Account name cannot be empty'
              }),
              bankCode: joi.string().trim().allow('', null).optional().messages({
                  'string.base': 'Bank code must be a string'
              })
          });
      
          const { error } = schema.validate(req.body, { abortEarly: false });
          if (error) {
              return res.status(400).json({
                  message: error.details[0].message
              });
          }
      
          next();
      };
  

exports.vendorLoginValidator = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required().messages({           
            'any.required': "email is required",
            'string.empty': "email cannot be empty",
            "string.email": "email must be a valid email"
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

     exports.vendorEmailVerificationValidator = (req, res, next) => {
        const schema = joi.object({
            email: joi.string().email().required().messages({
                'any.required': "email is required",
                'string.empty': "email cannot be empty",
                "string.email": "email must be a valid email"
            }),
            otp: joi.string().pattern(/^\d{6}$/).required().messages({
                'any.required': "otp is required",
                'string.empty': "otp cannot be empty",
                'string.pattern.base': "otp must be a 6-digit number"
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

        exports.vendorResendOtpValidator = (req, res, next) => {
            const schema = joi.object({
                email: joi.string().email().required().messages({
                    'any.required': "email is required",
                    'string.empty': "email cannot be empty",
                    "string.email": "email must be a valid email"
                })
            })
            const { error } = schema.validate(req.body, {
                abortEarly: false
            })
            if (error) {
                return res.status(400).json({
                    message: error.details[0].message   
                })
            }
            next()
        }

        exports.vendorPasswordResetValidator = (req, res, next) => {
            const schema = joi.object({
                email: joi.string().email().required().messages({
                    'any.required': "email is required",
                    'string.empty': "email cannot be empty",
                    "string.email": "email must be a valid email"
                }),
                password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
                    'any.required': "password is required",
                    "string.empty": "password cannot be empty",
                    'string.pattern.base': "password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
                })
            })
            const { error } = schema.validate(req.body, {
                abortEarly: false
            })
            if (error) {
                return res.status(400).json({
                    message: error.details[0].message   
                })
            }   
            next()
        } 

        exports.vendorProfileUpdateValidator = (req, res, next) => {
            const schema = joi.object({
                userName: joi.string().pattern(/^[A-Za-z\s]{3,}$/).messages({
                    'string.empty': "username cannot be empty",
                    'string.pattern.base': "username must be at least 4 characters long and contain only letters and spaces"
                }), 
                profilePicture: joi.optional()
            })
            const { error } = schema.validate(req.body, {
                abortEarly: false
            })
            if (error) {
                return res.status(400).json({
                    message: error.details[0].message
                })
            }
            next()
        }

        exports.vendorChangePasswordValidator = (req, res, next) => {
            const schema = joi.object({
                oldPassword: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
                    'any.required': "old password is required",
                    "string.empty": "old password cannot be empty",
                    'string.pattern.base': "old password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
                }),
                newPassword: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
                    'any.required': "new password is required",
                    "string.empty": "new password cannot be empty",
                    'string.pattern.base': "new password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
                }),
                confirmPassword: joi.string().required().valid(joi.ref('newPassword')).messages({
                    'any.only': "confirm password must match new password",
                    'any.required': "confirm password is required"
                })
            })
            const { error } = schema.validate(req.body, {
                abortEarly: false
            })
            if (error) {
                return res.status(400).json({
                    message: error.details[0].message   
                })
            }   
            next()
        }   

        exports.createTouristCenterValidation = (req, res, next) => {
            const schema = joi.object({
                centerName: joi.string().pattern(/^[A-Za-z\s]{4,}$/).required().messages({
                    'any.required': "center name is required",
                    "string.empty": "center name cannot be empty",
                    'string.pattern.base': "center name must be at least 4 characters long and contain only letters and spaces"
                }),
                description: joi.string().required().messages({
                    'any.required': "description is required",
                    "string.empty": "description cannot be empty"
                }),
                city: joi.string().required().messages({
                    'any.required': "city is required",
                    "string.empty": "city cannot be empty"
                }),
                state: joi.string().required().messages({
                    'any.required': "state is required",
                    "string.empty": "state cannot be empty"
                }), 
                streetAddress: joi.string().required().messages({
                    'any.required': "street address is required",
                    "string.empty": "street address cannot be empty"
                }), 
                facilitiesAndAmenities: joi.string().required().messages({
                    'any.required': "facilities and amenities is required", 
                    "string.empty": "facilities and amenities cannot be empty"
                }),
                dailySlotCapacity: joi.number().integer().positive().required().messages({
                    'number.base': "daily slot capacity must be a number",
                    'number.integer': "daily slot capacity must be an integer", 
                    'number.positive': "daily slot capacity must be greater than 0",
                    'any.required': "daily slot capacity is required"
                }),
                installmentPayment: joi.boolean().required().messages({
                    'boolean.base': "installment payment must be a boolean",
                    'any.required': "installment payment is required"
                }),
                openingHours: joi.string().required().messages({
                    'any.required': "opening hours is required",    
                    "string.empty": "opening hours cannot be empty"
                }),
                location: joi.string().required().messages({
                    'any.required': "location is required",
                    "string.empty": "location cannot be empty"
                })
            })
            const { error } = schema.validate(req.body, {
                abortEarly: false
            })  
            if (error) {
                return res.status(400).json({
                    message: error.details[0].message   
                })
            }
            next()
        }

  exports.updateTouristCenterValidator = (req, res, next) => {
    const schema = joi.object({
        centreName: joi.string().trim().min(3).messages({
            'string.empty': 'Centre name cannot be empty',
            'string.min': 'Centre name must be at least 3 characters long'
        }), 
        description: joi.string().trim().min(10).messages({
            'string.empty': 'Description cannot be empty',
            'string.min': 'Description must be at least 10 characters long' 
        }),
        city: joi.string().trim().messages({
            'string.empty': 'City cannot be empty'      
        }),
        streetAddress: joi.string().trim().messages({
            'string.empty': 'Street address cannot be empty'            
        }),
        facilitiesAndAmenities: joi.alternatives().try(
            joi.string().trim(),    
            joi.array().items(joi.string()),
            joi.object()
        ).messages({    
            'string.empty': 'Facilities and amenities cannot be empty'
        }),
        dailySlotCapacity: joi.number().integer().positive().messages({ 
            'number.base': 'Daily slot capacity must be a number',
            'number.integer': 'Daily slot capacity must be an integer',
            'number.positive': 'Daily slot capacity must be greater than 0' 
        }),
        installmentPayment: joi.boolean().messages({
            'boolean.base': 'Installment payment must be true or false'     
        }),
        openingHours: joi.alternatives().try(
            joi.string().trim(),    
            joi.array().items(joi.object()),
            joi.object()
        ).messages({        
            'string.empty': 'Opening hours cannot be empty'
        }),
        location: joi.string().trim().messages({
            'string.empty': 'Location cannot be empty'            
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



exports.createPaymentPlanValidation = (req, res, next) => {
    const schema = joi.object({
        durationInMonths: joi.number().integer().positive().required().messages({           
            'number.base': 'Duration in months must be a number',
            'number.integer': 'Duration in months must be an integer',
            'number.positive': 'Duration in months must be greater than 0', 
            'any.required': 'Duration in months is required'
        }),
        frequency: joi.string().valid('weekly', 'monthly').required().messages({    
            'any.only': 'Frequency must be either weekly or monthly',
            'any.required': 'Frequency is required'
        }),

        installmentAmount: joi.number().positive().required().messages({
            'number.base': 'Installment amount must be a number',
            'number.positive': 'Installment amount must be greater than 0',
            'any.required': 'Installment amount is required'
        }),
            totalAmount: joi.number().positive().required().messages({      
            'number.base': 'Total amount must be a number',
            'number.positive': 'Total amount must be greater than 0',
            'any.required': 'Total amount is required'
        }),

       frequency: joi.string().valid('weekly', 'monthly').required().messages({
            'any.only': 'Frequency must be either weekly or monthly',
            'any.required': 'Frequency is required'
        }),

     packageId: joi.string().uuid().required().messages({
           'string.guid': 'Package ID must be a valid UUID',
           'any.required': 'Package ID is required'
      }),

      startDate: joi.date().iso().required().messages({
        'date.base': 'Start date must be a valid date',
        'date.format': 'Start date must be in ISO format (YYYY-MM-DD)',
        'any.required': 'Start date is required'
      }),

        numberOfInstallments: joi.number().integer().positive().required().messages({
            'number.base': 'Number of installments must be a number',
            'number.integer': 'Number of installments must be an integer',
            'number.positive': 'Number of installments must be greater than 0',
            'any.required': 'Number of installments is required'
        }),
        
        })
     
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({   
            message: error.details[0].message
        })
    }
    next()
}

const { Client, Booking, Payment } = require('../models')
const otpGenerator = require('otp-generator')
const axios = require('axios')

exports.initiatePayment = async (req, res, next) => {
    try {
        const clientId = req.user.id;
        const 
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
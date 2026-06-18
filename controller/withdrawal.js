const { Withdrawal, Tourist, Wallet } = require('../models')
const axios = require('axios')
const otpGenerator = require('otp-generator')



exports.createWithdrawal = async (req, res, next) => {
  try {
    const { touristId, walletId } = req.params

    const {} = req.body;

    const tourist = await Tourist.findByPk(touristId)
    if (!tourist) {
      return res.status(404).json({
        message: 'Tourist not found'
      })
    }

    const wallet = await Wallet.findByPk(walletId)
    if (!wallet) {
      return res.status(404).json({
        message: 'Wallet not found'
      })
    }

    const ref = otpGenerator.generate(12, {upperCaseAlphabets: false,
      specialChars: false, lowerCaseAlphabets: false
    });
    const reference = `NOV-${ref}`


  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

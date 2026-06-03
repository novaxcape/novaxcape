const { Kyc } = require('../models')
const bcrypt = require('bcrypt')


exports.createKyc = async (req, res, next) => {
    try {
        const { centreName, lankmark, CAC, yearEstablished, phoneNumber, centreType, postal, state, directorFullName, directorEmail, directorPhoneNumber, bankName, accountNumber, accountName, bankCode } = req.body;

        const salt = (await bcrypt.genSalt(10));
        const hashedCac = await bcrypt.hash(CAC, salt);

        const newKyc = await Kyc.create({
            centreName,
            lankmark,
            CAC: hashedCac,
            yearEstablished,
            phoneNumber,
            centreType,
            postal,
            state,
            directorFullName,
            directorEmail,
            directorPhoneNumber,
            bankName,
            bankCode,
            accountName,
            accountNumber
        })

        res.status(201).json({
            message: "Kyc successfully created",
            data: newKyc
        })
    } catch (error) {
        console.log(error.message);
        next(error)
    }
}
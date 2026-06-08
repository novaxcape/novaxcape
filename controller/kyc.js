const { Kyc, Tourist } = require('../models')
const bcrypt = require('bcrypt')


exports.createKyc = async (req, res, next) => {
    try {
        const { lankmark, CAC, yearEstablished, phoneNumber, centreType, postal, state, directorFullName, directorEmail, directorPhoneNumber, bankName, accountNumber, accountName, bankCode } = req.body;

        const {touristId} = req.params

        const tourist = await Tourist.findOne({where: {vendorId: req.user.id, id: touristId}})

        if (!tourist) {
            return res.status(404).json({
                message: 'Tourist not found'
            })
        }

        const existingKyc = await Kyc.findOne({ where: {touristId: tourist.id} });
        if (existingKyc) {
            return res.status(400).json({
                message: "Kyc already exists for this tourist"
            })
        }

        const requiredFields = {
            lankmark,
            CAC,
            yearEstablished,
            phoneNumber,
            centreType,
            postal,
            state,
            directorFullName,
            directorEmail,
            directorPhoneNumber,
            bankName,
            accountNumber,
            accountName
        }

        const missingField = Object.entries(requiredFields).find(([, value]) => value === undefined || value === null || value === '')
        if (missingField) {
            return res.status(400).json({
                message: `${missingField[0]} is required`
            })
        }

        const salt = (await bcrypt.genSalt(10));
        const hashedCac = await bcrypt.hash(CAC, salt);

        const newKyc = await Kyc.create({
            touristId: tourist.id,
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

        res.status(200).json({
            message: "Kyc successfully created",
            data: newKyc
        })
    } catch (error) {
        console.log(error.message);
        next(error)
    }
}

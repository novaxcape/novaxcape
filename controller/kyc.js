const { Kyc, Vendor, Tourist } = require('../models')
const bcrypt = require('bcrypt')


exports.createKyc = async (req, res, next) => {
    try {
        const { centreName, lankmark, CAC, yearEstablished, phoneNumber, centreType, postal, state, directorFullName, directorEmail, directorPhoneNumber, bankName, accountNumber, accountName, bankCode } = req.body;

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
        const salt = (await bcrypt.genSalt(10));
        const hashedCac = await bcrypt.hash(CAC, salt);

        const newKyc = await Kyc.create({
            vendorId: req.user.id,
            touristId: tourist.id,
            centreName: tourist.centreName,
            centreEmail,
            streetAddress: tourist.streetAddress,
            city: tourist.city,
            landmark,
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
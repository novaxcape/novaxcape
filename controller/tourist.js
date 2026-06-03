const { Tourists: Tourist } = require('../models')
const fs = require('fs')
const cloudinary = require('../middleware/cloudinary')

const parseJsonField = (value) => {
    if (typeof value !== 'string') {
        return value
    }

    try {
        return JSON.parse(value)
    } catch (error) {
        return value
    }
}

const uploadFile = async (file) => {
    if (!file) {
        return null
    }

    const uploadToCloudinary = await cloudinary.uploader.upload(file.path)
    console.log(file.path)
    if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
    }

    return {
        secureUrl: uploadToCloudinary.secure_url,
        publicId: uploadToCloudinary.public_id
    }
}


exports.register = async (req, res, next) => {
    try {

        const files = req.files;
        const imageFile = files?.images?.[0]
        const termsFile = files?.termsAndCondition?.[0]
        const privacyFile = files?.privacyPolicy?.[0]

        if (!imageFile || !termsFile || !privacyFile) {
            return res.status(400).json({
                message: "Images, terms and condition, and privacy policy files are required"
            })
        }

        const imageResponse = await uploadFile(imageFile)
        const termsResponse = await uploadFile(termsFile)
        const privacyResponse = await uploadFile(privacyFile)



        const {centreName, description, city, streetAddress,facilitiesAndAmenities,dailySlotCapacity,installmentPayment,images,openingHours,termsAndCondition,privacyPolicy,location } = req.body


        const newTourist = await Tourist.create({
            centreName,
            description,
            city,
            streetAddress,
            facilitiesAndAmenities: parseJsonField(facilitiesAndAmenities),
            dailySlotCapacity,
            installmentPayment,
            images: imageResponse,
            termsAndCondition: termsResponse,
            privacyPolicy: privacyResponse,
            openingHours: parseJsonField(openingHours),
            location
        })

        res.status(201).json({
            message: "Successfully registerd Center",
            data: newTourist
        })
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

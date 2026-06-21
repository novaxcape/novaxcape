const { Tourist, Vendor, Booking, Wallet, PaymentPlan} = require('../models')
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

const getUploadedFiles = (files = {}) => {
    return Object.values(files).flat()
}

const deleteLocalFile = (file) => {
    if (file?.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
    }
}

const deleteLocalFiles = (files = {}) => {
    getUploadedFiles(files).forEach(deleteLocalFile)
}

const uploadFile = async (file) => {
    if (!file) {
        return null
    }

    try {
        const uploadToCloudinary = await cloudinary.uploader.upload(file.path)

        return {
            secureUrl: uploadToCloudinary.secure_url,
            publicId: uploadToCloudinary.public_id
        }
    } catch (error) {
        console.log('Error uploading file to Cloudinary:', error)
        throw new Error('Failed to upload file')
    }
    finally {
        deleteLocalFile(file)
    }
}


exports.register = async (req, res, next) => {
    try {

        const vendorId = req.user.id

        const vendor = await Vendor.findOne({ where: { id: vendorId } })

        if (!vendor) {
            return res.status(404).json({
                message: "Vendor not found"
            })
        }

        const files = req.files || {};
        const imageFiles = files.images || []
        const termsFile = files?.termsAndCondition?.[0]
        const privacyFile = files?.privacyPolicy?.[0]

        if (!imageFiles.length || !termsFile || !privacyFile) {
            deleteLocalFiles(files)
            return res.status(400).json({
                message: "Images, terms and condition, and privacy policy files are required"
            })
        }

        const imageResponses = await Promise.all(imageFiles.map(uploadFile))
        const termsResponse = await uploadFile(termsFile)
        const privacyResponse = await uploadFile(privacyFile)



        const {
            centreName,description,city,state,streetAddress,facilitiesAndAmenities,dailySlotCapacity,installmentPayment,openingHours,location
        } = req.body

        const requiredFields = {
            centreName,
            description,
            city,
            state,
            streetAddress,
            facilitiesAndAmenities,
            dailySlotCapacity,
            installmentPayment,
            openingHours,
            location
        }

        const missingField = Object.entries(requiredFields).find(([, value]) => value === undefined || value === null || value === '')
        if (missingField) {
            deleteLocalFiles(files)
            return res.status(400).json({
                message: `${missingField[0]} is required`
            })
        }


        const newTourist = await Tourist.create({
            vendorId,
            centreName,
            description,
            city,
            state,
            termsAndConditionPublicUrl: termsResponse.secureUrl,
            privacyPolicyPublicUrl: privacyResponse.secureUrl,
            imagesPublicUrl: imageResponses.map((image) => image.secureUrl),
            streetAddress,
            facilitiesAndAmenities: parseJsonField(facilitiesAndAmenities),
            dailySlotCapacity,
            installmentPayment: installmentPayment === true || installmentPayment === 'true',
            images: imageResponses,
            termsAndCondition: termsResponse,
            privacyPolicy: privacyResponse,
            openingHours: parseJsonField(openingHours),
            location
        })
        await Wallet.create({
      touristId: newTourist.id
        })
        // console.log("newTourist:", newTourist)

        // const paymentPlan = await PaymentPlan.create({
        //     touristId: tourist.id,
        // });


        res.status(201).json({
            message: "Successfully registerd Center",
            data: newTourist
        })
    } catch (error) {
        console.log("error:", error);
        next(error);
    }
}


exports.getAllTouristsByState = async (req, res, next) => {
    try {
        const { state } = req.params;

        const centers = await Tourist.findAll({
            where: {
                state,
            }
        })

        if (!centers.length) {
            return res.status(404).json({
                message: `No centers found in ${state}`
            });
        }

        res.status(200).json({
            message: "Centers found",
            count: centers.length,
            data: centers
        })
    } catch (error) {
        console.log(error.message);
        next(error)
    }
}


exports.getOneTourist = async (req, res, next) => {
    try {
        const {id} = req.params;
        const center = await Tourist.findByPk(id)

        if(!center) {
            return res.status(404).json({
                message: "Tourist center not found"
            })
        }

        res.status(200).json({
            message: "Tourist center found",
            data: center
        })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}


exports.getAllTouristsByOpeningHours = async (req, res, next) => {
    try {
        const { openingHours } = req.params;

        const centers = await Tourist.findAll({
            where: {
                openingHours
            }
        })

        if (!centers.length) {
            return res.status(404).json({
                message: `No centers found in ${openingHours}`
            })
        }

        res.status(200).json({
            message: "Centers found",
            count: centers.length,
            data: centers
        })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}


exports.verifyClientPasscode = async (req, res, next) => {
    try {
        const { passcode } = req.body;

        if (!passcode) {
            return res.status(400).json({
                message: 'Passcode is required'
            });
        }

        const booking = await Booking.findOne({
            where: { passcode }
        });

        if (!booking) {
            return res.status(404).json({
                message: 'Invalid passcode'
            });
        }

        return res.status(200).json({
            message: 'Passcode verified successfully',
            data: booking
        });

    } catch (error) {
        console.log(error.message);
        next(error);
    }
};


const adminModel = require('../models/admin')




exports.createAdmin = async (req, res) => {
    try {
        const {} = req.body
        const 
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}
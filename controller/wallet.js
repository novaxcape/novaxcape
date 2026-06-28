const { Wallet, Vendor, Tourist } = require('../models')


exports.getOne = async (req, res, next) => {
    try {
        const vendor = await Vendor.findByPk(req.user.id);

        if (!vendor) {
            return res.status(404).json({
                message: "Vendor not found"
            });
        }
        console.log("vendor:", vendor)
        const tourist = await Tourist.findOne({ where: { vendorId: vendor.dataValues.id  } })

        if (!tourist) {
            return res.status(404).json({
                message: "Tourist not found"
            });
        }
        console.log("tourist:", tourist)

        const wallet = await Wallet.findOne({
            where: {
                touristId: tourist.dataValues.id
            }
        });

        if (!wallet) {
            return res.status(404).json({
                message: "Wallet not found"
            });
        }
        console.log("wallet:", wallet)

        res.status(200).json({
            message: "Wallet successfully retrieved",
            data: wallet
        });

    } catch (error) {
        console.log(error.message);
        next(error);
    }
};
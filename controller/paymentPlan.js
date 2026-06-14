const { PaymentPlan, Package, Tourist, Vendor } = require('../models');

exports.createPaymentPlan = async (req, res, next) => {
    try {
        const { durationInMonths, frequency, currency } = req.body;

        const { packageId } = req.params;
        const package = await Package.findByPk(packageId);

        if (!package) {
            return res.status(404).json({
                message: 'Package not found'
            })
        }

        const vendor = await Vendor.findByPk(req.user.id)

        const tourist = await Tourist.findByPk(package.touristId)
        console.log("tourist:", tourist)
 
        if(!tourist) {
            return res.status(404).json({
                message: 'Tourist not found'
            })
        }
        if (tourist.dataValues.installmentPayment !== true) {
            return res.status(404).json({
                message: 'Installment plan does not exist for this center'
            })
        }

        const existingPlan = await PaymentPlan.findOne({ where: { packageId: package.dataValues.id } });
        if (existingPlan) {
            return res.status(400).json({
                message: "payment plan already exists for this package"
            })
        }

        const totalAmount = Number(package.amount);

        let numberOfInstallments;

        if (frequency === 'weekly') {
            numberOfInstallments = durationInMonths * 4;
        } else {
            numberOfInstallments = durationInMonths;
        }
        // console.log("durationInMonths:", durationInMonths)
        const installmentAmount = (totalAmount / numberOfInstallments).toFixed(2);

        const startDate = new Date()
        const nextPaymentDate = new Date(startDate)

        if (frequency === 'weekly') {
            nextPaymentDate.setDate(nextPaymentDate.getMonth() + 1)
        }

        const newPlan = await PaymentPlan.create({
            packageId,
            durationInMonths,
            frequency,
            totalAmount,
            installmentAmount,
            numberOfInstallments,
            startDate,
            nextPaymentDate
        })

        res.status(201).json({
            message: "Payment plan created successfully",
            data: newPlan
        })

    } catch (error) {
        console.log(error.message);
        next(error)
    }
}


exports.getAllPaymentPlan = async (req, res, next) => {
    try {
        const { packageId } = req.params;

        const paymentPlans = await PaymentPlan.findAll({
            where: {
                packageId
            }
        });

        res.status(200).json({
            message: "Payment plans retrieved successfully",
            count: paymentPlans.length,
            data: paymentPlans
        });

    } catch (error) {
        console.log(error.message);
        next(error);
    }
};
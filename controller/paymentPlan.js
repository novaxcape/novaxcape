const { PaymentPlan, Package, Tourist, Vendor } = require('../models');

exports.createPaymentPlan = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: 'Unauthorized - Invalid token'
            });
        }

        const { durationInMonths, frequency, currency } = req.body;

        const tourist = await Tourist.findByPk(req.user.id);

        if (!tourist) {
            return res.status(404).json({
                message: "Tourist not found"
            });
        }

        if (!tourist.installmentPayment) {
            return res.status(400).json({
                message: "Installment payment is not enabled for this center."
            });
        }

        const existingPlan = await PaymentPlan.findOne({
            where: {
                touristId: tourist.id
            }
        });

        if (existingPlan) {
            return res.status(400).json({
                message: "Payment plan already exists."
            });
        }

        let numberOfInstallments;

        if (frequency === "weekly") {
            numberOfInstallments = durationInMonths * 4;
        } else {
            numberOfInstallments = durationInMonths;
        }

        const startDate = new Date();
        const nextPaymentDate = new Date(startDate);

        if (frequency === "weekly") {
            nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
        } else {
            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
        }

        const paymentPlan = await PaymentPlan.create({
            touristId: tourist.id,
            durationInMonths,
            frequency,
            numberOfInstallments,
            startDate,
            nextPaymentDate
        });

        res.status(201).json({
            message: "Payment plan created successfully.",
            data: paymentPlan
        });

    } catch (error) {
        next(error);
    }
};


exports.getAllPaymentPlan = async (req, res, next) => {
    try {
        const { touristId } = req.params;

        const paymentPlans = await PaymentPlan.findAll({
            where: {
                touristId
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
const { PaymentPlan } = require('../models');

exports.createPaymentPlan = async (req, res, next) => {
    try {
        const {durationInMonths, frequency,totalAmount, numberOfInstallments, currency, startDate} = req.body;

        const {packageId} = req.params;
        const package = await PaymentPlan.findByPk(packageId);

        if(!package) {
            return res.status(404).json({
                message: 'Booking not found'
            })
        }

        const existingPlan = await PaymentPlan.findOne({where: {packageId: package.id}});
        if(existingPlan) {
            return res.status(400).json({
                message: "payment plan already exists for this package"
            })
        }

        const totalAmount = Number(package.totalAmount);

        let numberOfInstallments;

        if(frequency === 'weekly') {
            numberOfInstallments = durationInMonths * 4;
        }else {
            numberOfInstallments = durationInMonths;        
        }

        const installmentAmount = (totalAmount / numberOfInstallments).toFixed(2);

        const startDate = new Date()
        const nextPaymentDate = new Date(startDate)

        if (frequency === 'weekly') {
            nextPaymentDate.setDate(nextPaymentDate.getMonth() + 1)
        }

        const newPlan = await PaymentPlan.create({
            bookingId,
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
        console.log(error);
        next(error)
    }
}
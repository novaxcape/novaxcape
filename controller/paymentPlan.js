const { PaymentPlan, Package } = require('../models');

exports.createPaymentPlan = async (req, res, next) => {
    try {
        const {durationInMonths, frequency,  currency} = req.body;

        const {packageId} = req.params;
        const package = await Package.findByPk(packageId);

        if(!package) {
            return res.status(404).json({
                message: 'Package not found'
            })
        }

        const existingPlan = await PaymentPlan.findOne({where: {packageId: package.dataValues.id}});
        if(existingPlan) {
            return res.status(400).json({
                message: "payment plan already exists for this package"
            })
        }

        const totalAmount = Number(package.amount);
        
        let numberOfInstallments;

        if(frequency === 'weekly') {
            numberOfInstallments = durationInMonths * 4;
        }else {
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

exports.cancelPaymentPlan = async (req, res, next) => {
    try {
        const { id } = req.params;

        const paymentPlan = await PaymentPlan.findByPk(id);

        if (!paymentPlan) {
            return res.status(404).json({
                success: false,
                message: 'Payment plan not found'
            });
        }

        if (paymentPlan.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'A completed payment plan cannot be cancelled'
            });
        }

        await paymentPlan.update({ status: 'cancelled' });

        return res.status(200).json({
            success: true,
            message: 'Payment plan cancelled successfully',
            data: paymentPlan
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
};

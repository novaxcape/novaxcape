const { Client, Booking, Package, Tourist, PaymentPlan } = require('../models');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);

exports.createBooking = async (req, res, next) => {
    try {
        const clientId = req.user.id;
        const { touristId, packageId } = req.params;
        const { visitDate } = req.body;

        const client = await Client.findByPk(clientId);
        const tourPackage = await Package.findByPk(packageId);
        const tourist = await Tourist.findByPk(touristId);

        if (!client) {
            return res.status(404).json({
                message: 'Client not found'
            });
        }

        if (!tourist) {
            return res.status(404).json({
                message: 'Tourist not found'
            });
        }

        if (!tourPackage) {
            return res.status(404).json({
                message: 'Package not found'
            });
        }

        const paymentPlan = await PaymentPlan.findOne({
            where: {
                packageId: tourPackage.id
            }
        });

        if (!paymentPlan) {
            return res.status(404).json({
                message: 'Payment plan not found'
            });
        }

        const visit = dayjs(visitDate, "MM/DD/YYYY");

        if (!visit.isValid()) {
            return res.status(400).json({
                message: 'Invalid visit date format. Use MM/DD/YYYY'
            });
        }

        // Duration end date + 3 days
        const eligibleBookingDate = dayjs(paymentPlan.startDate)
            .add(paymentPlan.durationInMonths, 'month')
            .add(3, 'day');

        // Client cannot book before this date
        if (visit.isBefore(eligibleBookingDate, 'day')) {
            return res.status(400).json({
                message: `You can only book from ${eligibleBookingDate.format('MM/DD/YYYY')} onwards after completing your installment plan.`
            });
        }

        const booking = await Booking.create({
            clientId: client.id,
            touristId: tourist.id,
            packageId: tourPackage.id,
            visitDate: visit.toDate()
        });

        return res.status(201).json({
            message: 'Booking created successfully',
            booking
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};
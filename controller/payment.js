const { Client, Booking, Payment, Package, Tourist, Wallet } = require('../models');
const otpGenerator = require('otp-generator');
const axios = require('axios');
const { confirmBooking } = require('../helper/emailTemplate');
const { sendSingleEmail } = require('../utils/brevo');
const crypto = require('crypto');


exports.initiatePayment = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: 'Unauthorized - Invalid token'
            });
        }

        const clientId = req.user.id;
        const { bookingId } = req.params;

        const client = await Client.findByPk(clientId);

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        const booking = await Booking.findByPk(bookingId, {
            include: [
                {
                    model: Package,
                    as: 'package'
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        let amountToPay;
        let nextInstallmentNumber = 1;

        if (booking.paymentMethod === 'installment') {
            // Automatically determine next unpaid installment
            nextInstallmentNumber = booking.installmentsPaid + 1;

            if (nextInstallmentNumber > booking.totalInstallments) {
                return res.status(400).json({
                    message: 'All installments for this booking have already been paid'
                });
            }

            // Calculate installment amount: totalAmount / totalInstallments
            const perInstallment = Math.ceil(Number(booking.totalAmount) / booking.totalInstallments);
            // Service fee split across installments: 500 per installment
            const serviceFee = 500;
            amountToPay = perInstallment + serviceFee;

        } else {
            // Full payment: package amount + service fee
            amountToPay = Number(booking.totalAmount || booking.package.amount) + 1000;
        }

        const ref = otpGenerator.generate(12, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        });
        const reference = `NOV-XCAPE-${ref}`;

        const paymentData = {
            amount: amountToPay,
            currency: 'NGN',
            reference,
            customer: {
                email: client.email,
                name: `${client.firstName} ${client.lastName}`
            },
            redirect_url: 'https://novaxcape.vercel.app/payment-confirmation',
        };

        const { data } = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', paymentData, {
            headers: {
                Authorization: `Bearer ${process.env.KORA_API_KEY}`
            }
        });

        const payment = await Payment.create({
            amount: amountToPay,
            reference,
            clientId,
            bookingId: booking.id,
            installmentNumber: booking.paymentMethod === 'installment' ? nextInstallmentNumber : 1,
            installmentOf: booking.paymentMethod === 'installment' ? booking.totalInstallments : 1
        });

        res.status(200).json({
            message: "Payment initialized successfully",
            data
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};


const sendBookingConfirmationEmail = async (booking, client, tourist) => {
    try {
        await sendSingleEmail({
            email: client.email.toLowerCase(),
            name: `${client.firstName} ${client.lastName}`,
            html: confirmBooking({
                location: tourist.centreName,
                visitDate: booking.visitDate,
                bookingId: booking.bookingNumber,
                passcode: booking.passcode,
                amount: booking.totalAmount
            }),
            subject: 'BOOKING CONFIRMATION - NOVAXCAPE'
        });
    } catch (error) {
        console.log('Email send error:', error);
    }
};


exports.verifyPayment = async (req, res, next) => {
    try {
        const { reference } = req.query;

        const payment = await Payment.findOne({
            where: { reference },
            include: [
                {
                    model: Booking,
                    as: 'booking',
                    include: [
                        {
                            model: Package,
                            as: 'package'
                        }
                    ]
                }
            ]
        });

        if (!payment) {
            return res.status(404).json({
                message: 'Payment not found'
            });
        }

        const { data } = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.KORA_API_KEY}`
            }
        });

        if (data?.status === true && data?.data.status === 'success') {
            payment.status = 'success';
            await payment.save();

            const booking = payment.booking;
            const client = await Client.findByPk(booking.clientId);
            const tourist = await Tourist.findByPk(booking.touristId);

            // Credit tourist wallet (proportionate for installments)
            let wallet = await Wallet.findOne({ where: { touristId: tourist.id } });
            if (!wallet) {
                wallet = await Wallet.create({ touristId: tourist.id, balance: 0, totalEarnings: 0 });
            }

            const packageAmount = booking.package ? Number(booking.package.amount) : Number(booking.totalAmount);
            // For installments, credit proportionate amount per installment settled
            const creditAmount = booking.paymentMethod === 'installment'
                ? Math.ceil(packageAmount / booking.totalInstallments)
                : packageAmount;

            wallet.balance = Number(wallet.balance) + creditAmount;
            wallet.totalEarnings = Number(wallet.totalEarnings) + creditAmount;
            await wallet.save();

            if (booking.paymentMethod === 'installment') {
                // Increment installments paid on the booking
                booking.installmentsPaid = (booking.installmentsPaid || 0) + 1;

                // Check if fully paid
                if (booking.installmentsPaid >= booking.totalInstallments) {
                    booking.status = 'delivered';
                    await booking.save();

                    // Send digital ticket email only on final installment
                    await sendBookingConfirmationEmail(booking, client, tourist);

                    return res.status(200).json({
                        message: "Payment verified successfully - Booking fully paid",
                        data: data?.data,
                        otp: booking.passcode,
                        visitDate: booking.visitDate,
                        bookingId: booking.bookingNumber,
                        location: tourist.centreName,
                        amount: booking.totalAmount,
                        installmentNumber: payment.installmentNumber,
                        installmentsPaid: booking.installmentsPaid,
                        totalInstallments: booking.totalInstallments,
                        fullyPaid: true
                    });
                }

                // Installment paid but NOT yet fully paid
                await booking.save();

                return res.status(200).json({
                    message: `Installment ${payment.installmentNumber} of ${booking.totalInstallments} paid successfully`,
                    data: data?.data,
                    installmentNumber: payment.installmentNumber,
                    installmentsPaid: booking.installmentsPaid,
                    totalInstallments: booking.totalInstallments,
                    fullyPaid: false,
                    nextInstallment: booking.installmentsPaid + 1
                });
            }

            // Full payment flow (existing behavior)
            booking.status = 'delivered';
            await booking.save();

            await sendBookingConfirmationEmail(booking, client, tourist);

            return res.status(200).json({
                message: "Payment verified successfully",
                data: data?.data,
                otp: booking.passcode,
                visitDate: booking.visitDate,
                bookingId: booking.bookingNumber,
                location: tourist.centreName,
                amount: booking.totalAmount || booking.package.amount
            });

        } else {
            payment.status = data?.data.status || 'failed';
            await payment.save();

            return res.status(400).json({
                message: "Payment verification failed",
                data: payment
            });
        }

    } catch (error) {
        console.log(error.message);
        next(error);
    }
};


exports.getInstallmentStatus = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: 'Unauthorized - Invalid token'
            });
        }

        const { bookingId } = req.params;

        const booking = await Booking.findByPk(bookingId, {
            include: [
                {
                    model: Payment,
                    as: 'payments',
                    where: { status: 'success' },
                    required: false
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            message: 'Installment status retrieved',
            data: {
                bookingId: booking.id,
                bookingNumber: booking.bookingNumber,
                paymentMethod: booking.paymentMethod,
                totalInstallments: booking.totalInstallments,
                installmentsPaid: booking.installmentsPaid,
                totalAmount: booking.totalAmount,
                amountPerInstallment: booking.paymentMethod === 'installment'
                    ? Math.ceil(Number(booking.totalAmount) / booking.totalInstallments)
                    : Number(booking.totalAmount),
                status: booking.status,
                payments: booking.payments
            }
        });

    } catch (error) {
        console.log(error.message);
        next(error);
    }
};


exports.verifyWebhook = async (req, res, next) => {
    try {
        const { event, data } = req.body;
        const hash = crypto.createHmac("sha256", process.env.KORA_API_KEY)
            .update(JSON.stringify(data))
            .digest("hex");
        const signature = req.headers["x-korapay-signature"];

        if (hash !== signature) {
            return res.status(401).json({
                message: "Invalid webhook signature"
            });
        }

        const reference = data?.reference;
        if (!reference) {
            return res.status(400).json({
                message: "No reference in webhook data"
            });
        }

        const payment = await Payment.findOne({ where: { reference } });

        if (!payment) {
            return res.status(404).json({
                message: "No payment record found"
            });
        }

        if (event === 'charge.success') {
            payment.status = 'success';
        } else if (event === 'charge.pending') {
            payment.status = 'pending';
        } else if (event === 'charge.failed') {
            payment.status = 'failed';
        }

        await payment.save();

        res.status(200).json({
            success: true,
            status: "successful",
            message: 'Payment verified successfully'
        });

    } catch (error) {
        console.log(error.message);
        next(error);
    }
};

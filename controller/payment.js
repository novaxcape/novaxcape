const { Client, Booking, Payment, Package, Tourist, Wallet } = require('../models')
const otpGenerator = require('otp-generator')
const axios = require('axios')
const { confirmBooking } = require('../helper/emailTemplate')
const { sendSingleEmail } = require('../utils/brevo')
const crypto = require('crypto')



exports.initiatePayment = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: 'Unauthorized - Invalid token'
            });
        }

        const clientId = req.user.id;
        const { bookingId } = req.params
        const client = await Client.findByPk(clientId)

        if(!Client) {
            return res.status(404).json({
                message: "Client not found"
            })
        }

        const booking = await Booking.findByPk(bookingId);

        const package = await Package.findByPk(booking.dataValues.packageId);
        console.log("package:", package);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            })
        }

        const ref = otpGenerator.generate(12, {upperCaseAlphabets: false,
            specialChars: false, lowerCaseAlphabets: false
        });
        const reference = `NOV-XCAPE-${ref}`

        const serviceFee = 500;
        const totalAmount = Number(package.dataValues.amount) + serviceFee;

        const paymentData = {
            amount: totalAmount,
            currency: 'NGN',
            reference,
            customer: {
                email: client.dataValues.email,
                name: `${client.dataValues.firstName} ${client.dataValues.lastName}`
            },
            redirect_url: 'https://novaxcape.vercel.app/payment-confirmation',
            // notification_url: 'https://novaxcape.onrender.com/api/v1/payment/verify-webhook'
        }

        const {data} = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', paymentData, {
            headers: {
                Authorization: `Bearer ${process.env.KORA_API_KEY}`
            }
        })

        const payment = await Payment.create({
            amount: totalAmount,
            reference,
            clientId,
            bookingId: booking.dataValues.id
        })

        res.status(200).json({
            message: "payment initialized successfully",
            data
        })
        
    } catch (error) {
        console.log(error)
        next(error)
    }
}


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
        console.log('payment:', payment)
        const client = await Client.findByPk(payment.booking.clientId);
        const tourist = await Tourist.findByPk(payment.booking.touristId);
       

        let wallet = await Wallet.findOne({ where: { touristId: tourist.id } });
        if (!wallet) {
            wallet = await Wallet.create({ touristId: tourist.id, balance: 0, totalEarnings: 0 });
        }

        const { data } = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`,{
            headers: {
                Authorization: `Bearer ${process.env.KORA_API_KEY}`
            }
        })
  

        if (data?.status === true && data?.data.status === 'success') {
            payment.status = data?.data.status;
            await payment.save()

         wallet.balance = Number(wallet.balance) + Number(payment.booking.package.amount)
         wallet.totalEarnings = Number(wallet.totalEarnings) + Number(payment.booking.package.amount)
         await wallet.save()
         res.status(200).json({
                message: "Payment verified successfully",
                data: data?.data,
                otp: payment.booking.passcode,
                visitDate: payment.booking.visitDate,
                bookingId: payment.booking.bookingNumber,
                location: tourist.centreName,
                amount: payment.booking.package.amount
            });

          (async () => {
              try {
                await sendSingleEmail({
                    email: client.email.toLowerCase(),
                    name: `${client.firstName} ${client.lastName}`,
                    html: confirmBooking({
                        location: tourist.centreName,
                        visitDate: payment.booking.visitDate,
                        bookingId: payment.booking.bookingNumber,
                        passcode: payment.booking.passcode,
                        amount: payment.booking.package.amount
                    }),
                    subject: 'BOOKING CONFIRMATION'
                });
                console.log("email:", sendSingleEmail)
              } catch (error) {
                  console.log('Email send error:', error);
              }
          })()
            
        } else {
            payment.dataValues.status = data?.data.status
            await payment.save()

            return res.status(400).json({
                message: "Payment verification failed",
                data: payment
            })
        }

      

    } catch (error) {
        console.log(error.message);
        next(error)
        
    }
}


exports.verifyWebhook = async (req, res, next) => {
    try {
  const { event, data } = req.body;
  const hash = crypto.createHmac("sha256", process.env.KORA_API_KEY).update(JSON.stringify(data)).digest("hex");
  const signature = req.headers["x-korapay-signature"];
  if (hash !== signature) return res.status(401).json({
    message: "Invalid webhook signature"
  });
  const payment = await Payment.findOne({where:{reference}})
  if (!payment ) return res.status(404).json({
    message: "NO payment record found"
  });

  if (event === 'charge.success') {
    payment.dataValues.status = success
    await payment.save()
} else if (event === 'charge.pending') {
    payment.dataValues.status = pending
    await payment.save()
} else if (event === 'charge.failed') {
    payment.dataValues.status = failed
    await payment.save()
};

  await payment.save();
  res.status(200).json({
    success: true,
    status: "successful",
    message: 'Payment verified successfully'
  })
} catch (error) {
    console.log(error.message)
    next(error)
}

};

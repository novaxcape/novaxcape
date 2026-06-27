const { Client, Booking, Package, Tourist, PaymentPlan } = require('../models');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);
const otpGenerator = require('otp-generator');

const generateOrderNumber = () => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `NOV-${randomNumber}`;
};


exports.createBooking = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: 'Unauthorized - Invalid token'
            });
        }

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
        const passcode = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });

        // booking.passcode = passcode;
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

        const visit = dayjs(visitDate, "MM/DD/YYYY", true);

        if (!visit.isValid()) {
            return res.status(400).json({
                message: 'Invalid visit date format. Use MM/DD/YYYY'
            });
        }

        // End of installment duration + 3 days grace period
        const eligibleBookingDate = dayjs(paymentPlan.startDate)
            .add(paymentPlan.durationInMonths, 'month')
            .add(3, 'day');

        let status = 'installment';

        if (
            visit.isSame(eligibleBookingDate, 'day') ||
            visit.isAfter(eligibleBookingDate, 'day')
        ) {
            status = 'inProgress';
        }

        if (status === 'installment') {
            return res.status(400).json({
                message: `You can only book from ${eligibleBookingDate.format('MM/DD/YYYY')} onwards after completing your installment plan.`
            });
        }

        const booking = await Booking.create({
            clientId: client.id,
            touristId: tourist.id,
            packageId: tourPackage.id,
            visitDate: visit.toDate(),
            bookingNumber: generateOrderNumber(),
            status,
            passcode
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


exports.getAllBooking = async (req, res, next) => {
    try {
        const { touristId, packageId } = req.params;

        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (pageNumber - 1) * pageSize;

        const where = {};

        if (touristId) {
            where.touristId = touristId;
        }

        if (packageId) {
            where.packageId = packageId;
        }

        const { count, rows } = await Booking.findAndCountAll({
            where,
            include: [
                {
                    model: Tourist,
                    as: "tourist",
                    attributes: ["id", "centreName"]
                },
                {
                    model: Package,
                    as: "package",
                    attributes: ["id", "amount", "packageName"]
                }
            ],
            distinct: true,
            limit: pageSize,
            offset,
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            message: "Bookings retrieved successfully",
            count: rows.length,
            data: rows,
            pagination: {
                pageNumber,
                pageSize,
                totalDocuments: count,
                totalPages: Math.ceil(count / pageSize),
                hasNextPage: pageNumber < Math.ceil(count / pageSize),
                hasPreviousPage: pageNumber > 1
            }
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
};


exports.getAll = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: 'Unauthorized - Invalid token'
            });
        }

        const clientId = req.user.id;

        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const offset = (pageNumber - 1) * pageSize;

        const { count, rows } = await Booking.findAndCountAll({
            where: {
                clientId
            },
            limit: pageSize,
            offset,
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            message: "Bookings retrieved successfully",
            count: rows.length,
            data: rows,
            pagination: {
                pageNumber,
                pageSize,
                totalDocument: count,
                totalPages: Math.ceil(count / pageSize)
            }
        });

    } catch (error) {
        console.log(error.message);
        next(error);
    }
};


// const getBookingStats = async (req, res) => {
//     const todayStart = dayjs().startOf("day").toDate();
//     const todayEnd = dayjs().endOf("day").toDate();

//     const yesterdayStart = dayjs()
//         .subtract(1, "day")
//         .startOf("day")
//         .toDate();

//     const yesterdayEnd = dayjs()
//         .subtract(1, "day")
//         .endOf("day")
//         .toDate();

//     const todayBookings = await Booking.count({
//         where: {
//             createdAt: {
//                 [Op.between]: [todayStart, todayEnd]
//             }
//         }
//     });

//     const yesterdayBookings = await Booking.count({
//         where: {
//             createdAt: {
//                 [Op.between]: [yesterdayStart, yesterdayEnd]
//             }
//         }
//     });

//     let percentageChange = 0;

//     if (yesterdayBookings > 0) {
//         percentageChange =
//             ((todayBookings - yesterdayBookings) / yesterdayBookings) * 100;
//     }

//     return {
//         todayBookings,
//         yesterdayBookings,
//         percentageChange: percentageChange.toFixed(1)
//     };
// };
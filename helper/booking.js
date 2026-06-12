const dayjs = require("dayjs");
const { Op } = require("sequelize");
const { Booking } = require("../models");

const getBookingStats = async () => {
    const todayStart = dayjs().startOf("day").toDate();
    const todayEnd = dayjs().endOf("day").toDate();

    const yesterdayStart = dayjs()
        .subtract(1, "day")
        .startOf("day")
        .toDate();

    const yesterdayEnd = dayjs()
        .subtract(1, "day")
        .endOf("day")
        .toDate();

    const todayBookings = await Booking.count({
        where: {
            createdAt: {
                [Op.between]: [todayStart, todayEnd]
            }
        }
    });

    const yesterdayBookings = await Booking.count({
        where: {
            createdAt: {
                [Op.between]: [yesterdayStart, yesterdayEnd]
            }
        }
    });

    let percentageChange = 0;

    if (yesterdayBookings > 0) {
        percentageChange =
            ((todayBookings - yesterdayBookings) / yesterdayBookings) * 100;
    }

    return {
        todayBookings,
        yesterdayBookings,
        percentageChange: percentageChange.toFixed(1)
    };
};

module.exports = getBookingStats; 
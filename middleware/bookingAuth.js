const getBookingStats = require("../helper/booking")

exports.updateBookingMiddleware = async (req, res, next) => {
    await getBookingStats()
    next()
}
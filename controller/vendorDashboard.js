const { Vendor, Booking, Payment, Package } = require('../models')
const { Op, fn, col } = require('sequelize')
const dayjs = require('dayjs')

const buildTicketTypeStats = (rows) => {
  const breakdown = []
  let total = 0

  rows.forEach((row) => {
    const packageType = row.packageType || 'unknown'
    const count = parseInt(row.count, 10) || 0

    breakdown.push({
      packageType,
      count
    })

    total += count
  })

  return {
    breakdown,
    total
  }
}

exports.getDashboardStats = async (req, res, next) => {
  try {
    const vendorId = req.user.id
    const vendor = await Vendor.findByPk(vendorId, {
      attributes: ['centerName']
    })

    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found'
      })
    }

    const today = dayjs().startOf('day')
    const yesterday = dayjs().subtract(1, 'day').startOf('day')
    const sevenDaysAgo = dayjs().subtract(6, 'day').startOf('day')

    const todayISO = today.format('YYYY-MM-DD')
    const yesterdayISO = yesterday.format('YYYY-MM-DD')
    const sevenDaysAgoISO = sevenDaysAgo.format('YYYY-MM-DD')

    const todayStart = today.toDate()
    const todayEnd = dayjs(today).endOf('day').toDate()
    const yesterdayStart = yesterday.toDate()
    const yesterdayEnd = dayjs(yesterday).endOf('day').toDate()

    const packageFilter = { vendorId }

    const [requestsToday, requestsYesterday, bookingsToday, bookingsYesterday, totalBookings] = await Promise.all([
      Booking.count({
        where: {
          createdAt: {
            [Op.between]: [todayStart, todayEnd]
          }
        },
        include: [
          {
            model: Package,
            as: 'package',
            where: packageFilter,
            attributes: []
          }
        ]
      }),
      Booking.count({
        where: {
          createdAt: {
            [Op.between]: [yesterdayStart, yesterdayEnd]
          }
        },
        include: [
          {
            model: Package,
            as: 'package',
            where: packageFilter,
            attributes: []
          }
        ]
      }),
      Booking.count({
        where: {
          visitDate: todayISO
        },
        include: [
          {
            model: Package,
            as: 'package',
            where: packageFilter,
            attributes: []
          }
        ]
      }),
      Booking.count({
        where: {
          visitDate: yesterdayISO
        },
        include: [
          {
            model: Package,
            as: 'package',
            where: packageFilter,
            attributes: []
          }
        ]
      }),
      Booking.count({
        include: [
          {
            model: Package,
            as: 'package',
            where: packageFilter,
            attributes: []
          }
        ]
      })
    ])

    const [ticketRows, visitorRows, revenueToday, revenueYesterday] = await Promise.all([
      Booking.findAll({
        attributes: [
          [fn('COUNT', col('Booking.id')), 'count'],
          [col('package.packageType'), 'packageType']
        ],
        include: [
          {
            model: Package,
            as: 'package',
            where: packageFilter,
            attributes: []
          }
        ],
        group: ['package.packageType'],
        raw: true
      }),
      Booking.findAll({
        attributes: ['visitDate', [fn('COUNT', col('Booking.id')), 'count']],
        where: {
          visitDate: {
            [Op.between]: [sevenDaysAgoISO, todayISO]
          }
        },
        include: [
          {
            model: Package,
            as: 'package',
            where: packageFilter,
            attributes: []
          }
        ],
        group: ['visitDate'],
        order: [['visitDate', 'ASC']],
        raw: true
      }),
      Payment.findOne({
        attributes: [[fn('COALESCE', fn('SUM', col('Payment.amount')), 0), 'sum']],
        where: {
          status: 'success',
          createdAt: {
            [Op.between]: [todayStart, todayEnd]
          }
        },
        include: [
          {
            model: Booking,
            as: 'booking',
            required: true,
            attributes: [],
            include: [
              {
                model: Package,
                as: 'package',
                required: true,
                where: packageFilter,
                attributes: []
              }
            ]
          }
        ],
        raw: true
      }).then(r => parseInt(r.sum, 10) || 0),
      Payment.findOne({
        attributes: [[fn('COALESCE', fn('SUM', col('Payment.amount')), 0), 'sum']],
        where: {
          status: 'success',
          createdAt: {
            [Op.between]: [yesterdayStart, yesterdayEnd]
          }
        },
        include: [
          {
            model: Booking,
            as: 'booking',
            required: true,
            attributes: [],
            include: [
              {
                model: Package,
                as: 'package',
                required: true,
                where: packageFilter,
                attributes: []
              }
            ]
          }
        ],
        raw: true
      }).then(r => parseInt(r.sum, 10) || 0)
    ])

    const ticketTypes = buildTicketTypeStats(ticketRows)

    const visitorStats = []
    for (let i = 0; i < 7; i += 1) {
      const date = dayjs(sevenDaysAgo).add(i, 'day')
      const formattedDate = date.format('YYYY-MM-DD')
      const matched = visitorRows.find((row) => row.visitDate === formattedDate)
      visitorStats.push({
        date: formattedDate,
        visits: matched ? parseInt(matched.count, 10) : 0
      })
    }

    return res.status(200).json({
      message: 'Vendor dashboard stats retrieved successfully',
      data: {
        vendorName: vendor.centerName,
        requests: {
          today: requestsToday,
          yesterday: requestsYesterday
        },
        revenue: {
          today: revenueToday || 0,
          yesterday: revenueYesterday || 0
        },
        bookings: {
          today: bookingsToday,
          yesterday: bookingsYesterday,
          total: totalBookings
        },
        ticketTypes,
        visitorStats,
        ratings: {
          average: null,
          count: 0
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

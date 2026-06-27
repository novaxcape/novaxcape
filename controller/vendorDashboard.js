const { Vendor, Booking, Payment, Package, Tourist, favourite } = require('../models')
const { Op, fn, col } = require('sequelize')
const dayjs = require('dayjs')
const { confirmBooking } = require('../helper/emailTemplate')
const bcrypt = require('bcrypt')
const tourist = require('../models/tourist')

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
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'Unauthorized - Invalid token'
      })
    }

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



exports.updateVendorDashboard = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
          return res.status(401).json({
            success: false,
            message: 'Unauthorized - Invalid token'
          });
        }

        const id  = req.user.id;

        const {
            centerName,
            centerPhoneNumber,
            centerAddress
        } = req.body;
        console.log('id:', id)
        // Check if vendor exists
        const vendor = await Vendor.findOne({
          where: {id: id}
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }
        // Update vendor details
        const data ={
            centerName: centerName || vendor.centerName,
            address: centerAddress || vendor.centerAddress,
            phoneNumber: centerPhoneNumber || vendor.centerPhoneNumber
        };

        success: true
        await vendor.update()

        

        return res.status(200).json({
            message: 'Vendor dashboard updated successfully',
            data: {
                id: vendor.id,
                centerName: vendor.centerName,
                centerAddress: vendor.centerAddress,
                phoneNumber: vendor.phoneNumber,
                role: vendor.role,
                isVerified: vendor.isVerified
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updatePassword = async (req,res) =>{
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Invalid token'
      });
    }

    const id  = req.user.id;

        const {
            currentPassword,
            newPassword,
            confirmNewPassword
        } = req.body;

         const vendor = await Vendor.findOne({
          where: {id: id}
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }
        
        const correctPassword = await bcrypt.compare(currentPassword, vendor.dataValues.password)
        
            if (!correctPassword) {
              attemptsRemaining: 5 - vendor.dataValues.failedLoginAttempts
              return res.status(400).json({
                message: 'Invalid credential'
              })
            }
          
            if (newPassword !== confirmNewPassword) {
              return res.status(400).json({
                message: 'Password does not match'
              })
            }

            const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);

        const data = {
          newPassword: hashedPassword
        }

        await vendor.update()

        

        return res.status(200).json({
            message: 'Password updated successfully',
        });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}



exports.checkVendorStatus = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token"
      });
    }

    const centreCount = await Tourist.count({
      where: { vendorId: req.user.id }
    });

    const hasCentre = centreCount > 0;

    if (!hasCentre) {
      return res.status(400).json({
        message: 'Please create a centre',
        success: false,
        hasCentre: false
      })
    } else {
      return res.status(200).json({
        message: 'proceed to dashboard',
        success: true,
        hasCentre: true
      })
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createFavourite = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'Unauthorized - Invalid token'
      })
    }

    const clientId = req.user.id;

    const{centreId} = req.params;

    const selectCentreId = centreId;
    const centre = await Tourist.findOne({
      where: { id: selectCentreId},
      attributes: ['centreName']
    })
    if (!centre) {
      return res.status(404).json({
        message: 'Centre not found'
      })
    }
    const data = await favourite.create({
      clientId: clientId,
      centreId: selectCentreId,
      centreName: centre.centreName
    })

    res.status(200).json({
      message: 'Centre successfully added to favourite',
      data
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
};

exports.getFavourite = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'Unauthorized - Invalid token'
      })
    }

    const clientId = req.user.id;
    
    const data = await favourite.findAll({
      where: {clientId},
      attributes: ["id","centreId",'centreName']
    })

    res.status(200).json({
      message: 'Centre successfully retrieved from favourite',
      data
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PaymentPlan.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
      PaymentPlan.hasMany(models.Payment, { foreignKey: 'paymentPlanId', as: 'payments' });
    }
  }
  PaymentPlan.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    bookingId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Bookings',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    durationInMonths: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    frequency: {
      type: DataTypes.ENUM('weekly', 'monthly'),
      allowNull: false,
      defaultValue: 'monthly'
    },
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    installmentAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    numberOfInstallments: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    installmentsPaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    amountPaid: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'NGN'
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'cancelled', 'defaulted'),
      allowNull: false,
      defaultValue: 'active'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    nextPaymentDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'PaymentPlan',
    tableName: 'paymentPlans',
  });
  return PaymentPlan;
};

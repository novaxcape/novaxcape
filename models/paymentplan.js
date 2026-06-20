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
      PaymentPlan.belongsTo(models.Package, { foreignKey: 'touristId', as: 'tourist' });
    }
  }
  PaymentPlan.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    touristId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Tourists',
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
      type: DataTypes.ENUM('weekly', 'monthly','fullPayment'),
      allowNull: false,
      defaultValue: 'monthly'
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    installmentAmount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    numberOfInstallments: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    installmentsPaid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    amountPaid: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'NGN'
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'cancelled', 'defaulted'),
      allowNull: false,
      defaultValue: 'completed'
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

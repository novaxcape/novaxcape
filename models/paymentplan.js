'use strict';
const {
  Model
} = require('sequelize');
const booking = require('./booking');
module.exports = (sequelize, DataTypes) => {
  class paymentPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      paymentPlan.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
    }
  }
  paymentPlan.init({
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
        model: 'bookings',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'paymentPlan',
  });
  return paymentPlan;
};

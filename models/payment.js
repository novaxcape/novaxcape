'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.Client, { foreignKey: 'clientId', as: 'client' });
      Payment.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
    }
  }
  Payment.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    clientId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'clients',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    references: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('processing', 'success', 'failed', 'abandoned'),
      allowNull: false,
      defaultValue: 'processing'
    }
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};

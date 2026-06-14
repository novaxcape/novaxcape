'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        Booking.belongsTo(models.Client, { foreignKey: 'clientId', as: 'client'});
        Booking.belongsTo(models.Tourist, { foreignKey: 'touristId', as: 'tourist'});
        Booking.belongsTo(models.Package, { foreignKey: 'packageId', as: 'package'});
        Booking.hasMany(models.Payment, { foreignKey: 'bookingId', as: 'payments'});
    }
  }
  Booking.init({
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
    touristId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Tourists',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    packageId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Packages',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    bookingNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    visitDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
        type: DataTypes.ENUM('camcelled', 'inProgress', 'installment', 'delivered'),
        defaultValue: 'inProgress'
      },
      passcode: {
        type: DataTypes.STRING,
        allowNull: false
      },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};

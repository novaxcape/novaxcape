'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tourist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tourist.hasOne(models.Kyc, { foreignKey: 'touristId', as: 'kyc' });
      Tourist.hasMany(models.Booking, { foreignKey: 'touristId', as: 'bookings' });
    }
  }

    
  Tourist.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    centreName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    facilitiesAndAmenities: {
      type: DataTypes.ENUM('free wifi', 'parking', 'restaurant', 'photography allowed', 'nature trails', 'water activities', 'hiking', 'guided tours'),
      allowNull: false
    },
    dailySlotCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    adultTicket: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    childTicket: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    familyPack: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    installmentPayment: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    streetAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    openingHours: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "Tourist"
    },
  }, {
    sequelize,
    modelName: 'Tourists',
  });
  return Tourist;
};

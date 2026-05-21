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
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    description: DataTypes.STRING,
    city: DataTypes.STRING,
    dailySlotCapacity: DataTypes.INTEGER,
    pricingAndTickets: DataTypes.INTEGER,
    streetAddress: DataTypes.STRING,
    openingHours: DataTypes.STRING,
    images: DataTypes.JSON,
    facilitiesAndAmenities: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Tourists',
  });
  return Tourist;
};
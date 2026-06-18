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
      Tourist.hasOne(models.Wallet, { foreignKey: 'touristId', as: 'wallets' });
      Tourist.hasOne(models.Kyc, { foreignKey: 'touristId', as: 'kyc' });
      Tourist.hasMany(models.Booking, { foreignKey: 'touristId', as: 'bookings' });
      Tourist.hasMany(models.Package, { foreignKey: 'touristId', as: 'packages' });
      Tourist.belongsTo(models.Vendor, { foreignKey: 'vendorId', as: 'vendor' });
      Tourist.hasMany(models.Withdrawal, { foreignKey: 'touristId', as: 'withdrawals' });
    }
  }

    
  Tourist.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    vendorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Vendors',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
      type: DataTypes.TEXT,
      allowNull: false
    },
    dailySlotCapacity: {
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
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    openingHours: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    images: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const value = this.getDataValue('images');
        return value ? JSON.parse(value): [];
      },

      set(val) {
        this.setDataValue('images', JSON.stringify(val));
      }
    },
    imagesPublicUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const value = this.getDataValue('imagesPublicUrl');
        return value ? JSON.parse(value): [];
      },

      set(val) {
        this.setDataValue('imagesPublicUrl', JSON.stringify(val));
      }
    },
    termsAndCondition: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const value = this.getDataValue('termsAndCondition');
        return value ? JSON.parse(value): [];
      },

      set(val) {
        this.setDataValue('termsAndCondition', JSON.stringify(val));
      }
    },
    termsAndConditionPublicUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const value = this.getDataValue('termsAndConditionPublicUrl');
        return value ? JSON.parse(value): [];
      },

      set(val) {
        this.setDataValue('termsAndConditionPublicUrl', JSON.stringify(val));
      }
    },
    privacyPolicy: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const value = this.getDataValue('privacyPolicy');
        return value ? JSON.parse(value): [];
      },

      set(val) {
        this.setDataValue('privacyPolicy', JSON.stringify(val));
      }
    },
    privacyPolicyPublicUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const value = this.getDataValue('privacyPolicyPublicUrl');
        return value ? JSON.parse(value): [];
      },

      set(val) {
        this.setDataValue('privacyPolicyPublicUrl', JSON.stringify(val));
      }
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "Tourist"
    },
  }, {
    sequelize,
    modelName: 'Tourist',
  });
  return Tourist;
};

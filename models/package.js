'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Package.belongsTo(models.Tourist, { foreignKey: 'touristId' });
      Package.hasMany(models.PaymentPlan, { foreignKey: 'packageId', as: 'paymentPlans' });
    }
  }
  Package.init({
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
    packageName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    packageType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numberOfPeople: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Package',
    tableName: 'Packages',
  });
  return Package;
};

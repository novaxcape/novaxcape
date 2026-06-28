'use strict';
const {
  Model,
  STRING
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Withdrawal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Withdrawal.belongsTo(models.Tourist, { foreignKey: 'touristId', as: 'tourist' });
      Withdrawal.belongsTo(models.Wallet, { foreignKey: 'walletId', as: 'wallet' });
    }
  }
  Withdrawal.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },

      touristId: {
        allowNull:false,
        type: DataTypes.UUID,
        references: {
          model: 'Tourists',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      walletId: {
        allowNull: true,
        type: DataTypes.UUID,
        references: {
          model: 'Wallets',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
    amount: {
        type: DataTypes.INTEGER
        },
    reference: {
        type: DataTypes.STRING,
        unique: true
        },
    bankName: {
        type: DataTypes.STRING
        },
        bankCode: {
            type: DataTypes.STRING
        },
    providerReference: {
        type: DataTypes.STRING
       },

    accountNumber: {
        type: DataTypes.STRING
        },
    status: {
        type: DataTypes.ENUM("processing", "successful", "failed"),
        defaultValue: "processing"
        }

  }, {
    sequelize,
    modelName: 'Withdrawal',
  });
  return Withdrawal;
};

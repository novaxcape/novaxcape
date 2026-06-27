'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class favourite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      favourite.hasMany(models.Tourist, {
        foreignKey: 'centreId',
        as: 'tourist'
      });
      favourite.belongsTo(models.Client, {
        foreignKey: 'clientId',
        as: 'client'
      })
    }
  }
  favourite.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
    centreId: {
        type: DataTypes.UUID,
        references: {
          model: "Tourists",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
    clientId: {
        type: DataTypes.UUID,
        references: {
          model: "clients",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
    centreName: {
      type: DataTypes.STRING,
    allowNull: true}
  }, {
    sequelize,
    modelName: 'favourite',
  });

  return favourite;
};
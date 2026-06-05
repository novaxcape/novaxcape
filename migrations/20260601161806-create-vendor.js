'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vendors', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      touristId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Tourists',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
      centerName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'Vendor'
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      otp: {
      type: Sequelize.STRING,
      allowNull: true
      },
      otpExpire: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: () => new Date(Date.now() + 1000 * 60 * 5)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vendors');
  }
};

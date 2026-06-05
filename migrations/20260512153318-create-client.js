'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clients', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female'),
        allowNull: true
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: true
      },
      profilePicture: {
        type: Sequelize.TEXT,
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: "Client",
      },
      otpExpire: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: () => new Date(Date.now() + 1000 * 60 * 5)
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      failedLoginAttempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isLocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      userName: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('clients');
  }
};

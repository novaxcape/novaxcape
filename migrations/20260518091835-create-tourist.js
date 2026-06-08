'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tourists', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      vendorId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Vendors',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
      centreName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      facilitiesAndAmenities: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      dailySlotCapacity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      installmentPayment: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      streetAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      openingHours: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      imagesPublicUrl: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      images: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      termsAndCondition: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      termsAndConditionPublicUrl: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      privacyPolicy: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      privacyPolicyPublicUrl: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: "Tourist"
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
    await queryInterface.dropTable('Tourists');
  }
};

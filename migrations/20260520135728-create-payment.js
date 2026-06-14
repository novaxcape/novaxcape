'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      clientId: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: 'clients',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    bookingId: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: 'Bookings',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'success', 'failed', 'abandoned', 'processing'),
        allowNull: false,
        defaultValue: 'pending'
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
    await queryInterface.dropTable('Payments');
  }
};
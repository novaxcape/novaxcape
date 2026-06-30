'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Bookings', 'paymentMethod', {
      type: Sequelize.ENUM('full', 'installment'),
      allowNull: false,
      defaultValue: 'full'
    });

    await queryInterface.addColumn('Bookings', 'totalInstallments', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });

    await queryInterface.addColumn('Bookings', 'installmentsPaid', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('Bookings', 'totalAmount', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Bookings', 'paymentMethod');
    await queryInterface.removeColumn('Bookings', 'totalInstallments');
    await queryInterface.removeColumn('Bookings', 'installmentsPaid');
    await queryInterface.removeColumn('Bookings', 'totalAmount');
  }
};

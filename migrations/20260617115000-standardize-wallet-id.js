'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // MySQL maps Sequelize.UUID to CHAR(36) BINARY.  Keeping this identical to
    // Withdrawals.walletId is required before its foreign key can be created.
    await queryInterface.changeColumn('Wallets', 'id', {
      allowNull: false,
      type: Sequelize.UUID
    });
  },

  async down() {
    // The prior type is database-specific and cannot be safely inferred.
  }
};

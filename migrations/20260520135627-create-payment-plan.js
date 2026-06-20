'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('paymentPlans', {
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
      // Number of months the payment is spread across (e.g. 1, 2, 3)
      durationInMonths: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      // How often the installment is charged
      frequency: {
        type: Sequelize.ENUM('weekly', 'monthly'),
        allowNull: false,
        defaultValue: 'monthly'
      },
      // Total amount to be paid across the whole plan
      totalAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      // Amount charged per installment
      installmentAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      // Total number of installments expected
      numberOfInstallments: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      // How many installments have been successfully paid
      installmentsPaid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      // Running total of what has been paid so far
      amountPaid: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'NGN'
      },
      status: {
        type: Sequelize.ENUM('active', 'completed', 'cancelled', 'defaulted'),
        allowNull: false,
        defaultValue: 'active'
      },
      // When the first payment was made / due
      startDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      // When the next installment is due to be charged
      nextPaymentDate: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.dropTable('paymentPlans');
  }
};

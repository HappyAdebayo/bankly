'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
                allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
                allowNull: true,
      },
      reference: {
        type: Sequelize.STRING,
                unique: true,
                allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL,
                allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('transfer', 'deposit', 'withdrawal', 'savings_contribution'),
                allowNull: false,
                defaultValue: 'transfer',
      },
      status: {
        type: Sequelize.ENUM('pending', 'success', 'failed'),
                allowNull: false,
                defaultValue: 'pending',
      },
      description: {
        type: Sequelize.STRING,
                allowNull: true,
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
    await queryInterface.dropTable('transactions');
  }
};

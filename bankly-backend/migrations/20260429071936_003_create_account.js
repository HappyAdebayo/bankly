'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('account', {
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
      balance: {
        type: Sequelize.DECIMAL,
                allowNull: false,
      },
      account_number: {
        type: Sequelize.STRING,
                unique: true,
                allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('active', 'frozen'),
                allowNull: true,
                defaultValue: 'active',
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
    await queryInterface.dropTable('account');
  }
};

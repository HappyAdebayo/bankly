'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kyc', {
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
      full_name: {
        type: Sequelize.TEXT,
                allowNull: false,
      },
      id_document: {
        type: Sequelize.TEXT,
                allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'verified', 'rejected'),
                allowNull: false,
                defaultValue: 'pending',
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
    await queryInterface.dropTable('kyc');
  }
};

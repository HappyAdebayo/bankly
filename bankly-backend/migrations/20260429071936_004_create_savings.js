'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('savings', {
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
      savedAmount: {
        type: Sequelize.DECIMAL,
                allowNull: false,
      },
      goalName: {
        type: Sequelize.TEXT,
                allowNull: false,
      },
      targetAmount: {
        type: Sequelize.DECIMAL,
                allowNull: false,
      },
      deadline: {
        type: Sequelize.DATE,
                allowNull: false,
      },
      descripption: {
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
    await queryInterface.dropTable('savings');
  }
};

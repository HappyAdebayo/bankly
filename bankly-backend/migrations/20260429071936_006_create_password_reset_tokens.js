'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('password_reset_tokens', {
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
      code: {
        type: Sequelize.STRING,
                allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
                allowNull: false,
      },
      used : {
        type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false,
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
    await queryInterface.dropTable('password_reset_tokens');
  }
};

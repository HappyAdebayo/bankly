'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('kyc', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    });
    await queryInterface.addConstraint('kyc', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_kyc_user_id',
      references: {
        table: 'user',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addColumn('account', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false
    });
    await queryInterface.addConstraint('account', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_account_user_id',
      references: {
        table: 'user',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addColumn('savings', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false
    });
    await queryInterface.addConstraint('savings', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_savings_user_id',
      references: {
        table: 'user',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addColumn('savings', 'account_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false
    });
    await queryInterface.addConstraint('savings', {
      fields: ['account_id'],
      type: 'foreign key',
      name: 'fk_savings_account_id',
      references: {
        table: 'account',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addColumn('transactions', 'from_account_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: false
    });
    await queryInterface.addConstraint('transactions', {
      fields: ['from_account_id'],
      type: 'foreign key',
      name: 'fk_transactions_from_account_id',
      references: {
        table: 'account',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addColumn('transactions', 'to_account_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: false
    });
    await queryInterface.addConstraint('transactions', {
      fields: ['to_account_id'],
      type: 'foreign key',
      name: 'fk_transactions_to_account_id',
      references: {
        table: 'account',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addColumn('transactions', 'savings_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: false
    });
    await queryInterface.addConstraint('transactions', {
      fields: ['savings_id'],
      type: 'foreign key',
      name: 'fk_transactions_savings_id',
      references: {
        table: 'savings',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addColumn('password_reset_tokens', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    });
    await queryInterface.addConstraint('password_reset_tokens', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_password_reset_tokens_user_id',
      references: {
        table: 'user',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('kyc', 'fk_kyc_user_id');
    await queryInterface.removeColumn('kyc', 'user_id');
    await queryInterface.removeConstraint('account', 'fk_account_user_id');
    await queryInterface.removeColumn('account', 'user_id');
    await queryInterface.removeConstraint('savings', 'fk_savings_user_id');
    await queryInterface.removeColumn('savings', 'user_id');
    await queryInterface.removeConstraint('savings', 'fk_savings_account_id');
    await queryInterface.removeColumn('savings', 'account_id');
    await queryInterface.removeConstraint('transactions', 'fk_transactions_from_account_id');
    await queryInterface.removeColumn('transactions', 'from_account_id');
    await queryInterface.removeConstraint('transactions', 'fk_transactions_to_account_id');
    await queryInterface.removeColumn('transactions', 'to_account_id');
    await queryInterface.removeConstraint('transactions', 'fk_transactions_savings_id');
    await queryInterface.removeColumn('transactions', 'savings_id');
    await queryInterface.removeConstraint('password_reset_tokens', 'fk_password_reset_tokens_user_id');
    await queryInterface.removeColumn('password_reset_tokens', 'user_id');
  }
};

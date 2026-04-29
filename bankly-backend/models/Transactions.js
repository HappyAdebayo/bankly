module.exports = (sequelize, DataTypes) => {
  const Transactions = sequelize.define('Transactions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reference: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    from_account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    to_account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('transfer', 'deposit', 'withdrawal', 'savings_contribution'),
      allowNull: false,
      defaultValue: 'transfer',
    },
    status: {
      type: DataTypes.ENUM('pending', 'success', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    savings_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'transactions',
    timestamps: true,
    underscored: false
  });

  Transactions.associate = (models) => {
    Transactions.belongsTo(models.Account, { foreignKey: 'from_account_id', targetKey: 'id', onDelete: 'CASCADE' });
    Transactions.belongsTo(models.Account, { foreignKey: 'to_account_id', targetKey: 'id', onDelete: 'CASCADE' });
    Transactions.belongsTo(models.Savings, { foreignKey: 'savings_id', targetKey: 'id', onDelete: 'CASCADE' });
  };

  return Transactions;
};

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    account_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'frozen'),
      allowNull: true,
      defaultValue: 'active',
    }
  }, {
    tableName: 'account',
    timestamps: true,
    underscored: false
  });

  Account.associate = (models) => {
    Account.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE' });
    Account.hasMany(models.Transactions, { foreignKey: 'from_account_id', sourceKey: 'id', as: 'transactions', onDelete: 'CASCADE' });
    Account.hasMany(models.Savings, { foreignKey: 'account_id', sourceKey: 'id', as: 'savings', onDelete: 'CASCADE' });
  };

  return Account;
};

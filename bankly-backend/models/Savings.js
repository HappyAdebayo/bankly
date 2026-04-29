module.exports = (sequelize, DataTypes) => {
  const Savings = sequelize.define('Savings', {
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
    savedAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    goalName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    targetAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    descripption: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'savings',
    timestamps: true,
    underscored: false
  });

  Savings.associate = (models) => {
    Savings.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE' });
    Savings.belongsTo(models.Account, { foreignKey: 'account_id', targetKey: 'id', onDelete: 'CASCADE' });
    Savings.hasMany(models.Transactions, { foreignKey: 'savings_id', sourceKey: 'id', as: 'transactions', onDelete: 'CASCADE' });
  };

  return Savings;
};

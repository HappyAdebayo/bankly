module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    }
  }, {
    tableName: 'user',
    timestamps: true,
    underscored: false
  });

  User.associate = (models) => {
    User.hasOne(models.Kyc, { foreignKey: 'user_id', sourceKey: 'id', as: 'kyc', onDelete: 'CASCADE' });
    User.hasMany(models.Account, { foreignKey: 'user_id', sourceKey: 'id', as: 'account', onDelete: 'CASCADE' });
    User.hasMany(models.Savings, { foreignKey: 'user_id', sourceKey: 'id', as: 'savings', onDelete: 'CASCADE' });
    User.hasOne(models.PasswordResetTokens, { foreignKey: 'user_id', sourceKey: 'id', as: 'password_reset_tokens', onDelete: 'CASCADE' });
  };

  return User;
};

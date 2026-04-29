module.exports = (sequelize, DataTypes) => {
  const PasswordResetTokens = sequelize.define('PasswordResetTokens', {
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
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used : {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    }
  }, {
    tableName: 'password_reset_tokens',
    timestamps: true,
    underscored: false
  });

  PasswordResetTokens.associate = (models) => {
    PasswordResetTokens.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE' });
  };

  return PasswordResetTokens;
};

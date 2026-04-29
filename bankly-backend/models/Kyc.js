module.exports = (sequelize, DataTypes) => {
  const Kyc = sequelize.define('Kyc', {
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
      unique: true,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    id_document: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'verified', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    }
  }, {
    tableName: 'kyc',
    timestamps: true,
    underscored: false
  });

  Kyc.associate = (models) => {
    Kyc.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE' });
  };

  return Kyc;
};

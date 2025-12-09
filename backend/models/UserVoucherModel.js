const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const UserVoucher = sequelize.define('UserVoucher', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    voucher_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('unused', 'used', 'expired'),
      defaultValue: 'unused',
    },
    issued_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    used_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expiration_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'user_vouchers',
    timestamps: false,  // We're handling timestamps manually
  });

  UserVoucher.associate = (models) => {
    UserVoucher.belongsTo(models.User, { foreignKey: 'user_id' });
    UserVoucher.belongsTo(models.VoucherType, { foreignKey: 'voucher_type_id' });
  };

module.exports = UserVoucher;
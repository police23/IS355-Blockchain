const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const VoucherType = sequelize.define('VoucherType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    token_cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount_percent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100,
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'voucher_types',
    timestamps: false,  // We're handling timestamps manually
  });

module.exports = VoucherType
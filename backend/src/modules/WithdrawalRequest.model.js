const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WithdrawalRequest = sequelize.define('WithdrawalRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  walletId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  serviceFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  totalDeducted: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  bankAccountDetails: {
    type: DataTypes.JSON,
    allowNull: false, // Stores routing number, last 4 digits, bank name, etc.
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'PROCESSED', 'FAILED'),
    defaultValue: 'PENDING',
  },
}, {
  tableName: 'withdrawal_requests',
  timestamps: true,
});

module.exports = WithdrawalRequest;

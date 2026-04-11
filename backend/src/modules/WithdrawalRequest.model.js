import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

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
  stripePayoutId: {
    type: DataTypes.STRING(255),
    allowNull: true, // Stripe Payout ID e.g. 'po_1Oxxxxxxxxxxxx' — set once payout is initiated
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'LKR',
  },
}, {
  tableName: 'withdrawal_requests',
  timestamps: true,
});

export default WithdrawalRequest;

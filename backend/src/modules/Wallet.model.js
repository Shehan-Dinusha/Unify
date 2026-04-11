import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Wallet = sequelize.define('Wallet', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  pendingClearance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  lifetimeEarnings: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'LKR', // ISO 4217 code — allows multi-currency expansion
  },
  stripeCustomerId: {
    type: DataTypes.STRING(255),
    allowNull: true, // Stripe Customer ID e.g. 'cus_Pxxxxxxxxxxxxxxx' (for buyers)
  },
  stripeAccountId: {
    type: DataTypes.STRING(255),
    allowNull: true, // Stripe Connect Express Account ID e.g. 'acct_1Oxxxx' (for vendors/clubs)
  },
}, {
  tableName: 'wallets',
  timestamps: true,
});

export default Wallet;

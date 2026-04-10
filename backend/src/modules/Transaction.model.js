const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  walletId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('CREDIT', 'DEBIT', 'WITHDRAWAL', 'REFUND', 'PLATFORM_FEE'),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'General', // E.g., 'Club Tickets', 'Biz Boosts', 'Merchandise', 'Donation', 'Platform Fee'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'LKR', // ISO 4217 currency code
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00, // VAT or applicable tax amount
  },
  platformFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00, // Platform commission deducted before vendor credit
  },
  netAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true, // Amount after platformFee deduction — what vendor actually receives
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'PROCESSED', 'COMPLETED', 'FAILED', 'REFUNDED'),
    defaultValue: 'PENDING',
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stripePaymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true, // Stripe PaymentIntent ID e.g. 'pi_3OxxxxxxxxxxxxxxxxxxxY'
  },
  stripeChargeId: {
    type: DataTypes.STRING,
    allowNull: true, // Stripe Charge ID for refund reference e.g. 'ch_3Oxxxxxxxxxx'
  },
  stripeTransferId: {
    type: DataTypes.STRING,
    allowNull: true, // Stripe Transfer ID when crediting a connected vendor account
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true, // Arbitrary extra data: { orderId, postId, packageId, etc. }
  },
}, {
  tableName: 'transactions',
  timestamps: true,
});

module.exports = Transaction;

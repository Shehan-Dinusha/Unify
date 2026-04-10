const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VerificationRequest = sequelize.define('VerificationRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  requestedRole: {
    type: DataTypes.STRING,
    allowNull: false, // E.g., 'Batch Rep', 'Business', 'Club'
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  documentMetadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'DECLINED'),
    defaultValue: 'PENDING',
  },
  adminMessage: {
    type: DataTypes.TEXT,
    allowNull: true, // Used for decline reasoning, etc.
  },
}, {
  tableName: 'verification_requests',
  timestamps: true,
});

module.exports = VerificationRequest;

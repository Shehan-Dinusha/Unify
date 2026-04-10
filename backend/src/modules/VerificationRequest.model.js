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
    type: DataTypes.TEXT,
    allowNull: true, // S3 object key for primary document e.g. 'verifications/user-id/doc.pdf'
  },
  documentKeys: {
    type: DataTypes.JSON,
    allowNull: true, // Array of S3 keys if multiple documents are uploaded
  },
  documentMetadata: {
    type: DataTypes.JSON,
    allowNull: true, // Extra metadata (file type, size, original name, etc.)
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

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AdminLog = sequelize.define('AdminLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false, // E.g., 'package_added', 'package_deleted', 'package_updated', 'system'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  targetUserId: {
    type: DataTypes.INTEGER,
    allowNull: true, // If the action targets a specific user (e.g. suspension)
  },
  referenceId: {
    type: DataTypes.INTEGER,
    allowNull: true, // e.g. reportId, postId, packageId
  },
  severity: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
    allowNull: true, // Used for suspension/warning severity classification
  },
  caseRef: {
    type: DataTypes.STRING,
    allowNull: true, // Human-readable case reference e.g. '#CASE-2024-0042'
  },
}, {
  tableName: 'admin_logs',
  timestamps: true,
});

module.exports = AdminLog;

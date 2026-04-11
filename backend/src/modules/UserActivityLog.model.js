import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserActivityLog = sequelize.define('UserActivityLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING(255),
    allowNull: true, // E.g. '✏️', '💳'
  },
  iconColor: {
    type: DataTypes.STRING(255),
    allowNull: true, // E.g. 'bg-primary-blue/20'
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false, // E.g. 'Menu Updated'
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: true, // E.g. 'login', 'post', 'comment'
  },
  ip: {
    type: DataTypes.STRING(255),
    allowNull: true, // E.g. '192.168.1.1'
  },
  device: {
    type: DataTypes.STRING(255),
    allowNull: true, // E.g. 'MacBook Pro - Chrome'
  },
  detail: {
    type: DataTypes.STRING(255),
    allowNull: true, // E.g. 'Added seasonal organic smoothies.'
  },
}, {
  tableName: 'user_activity_logs',
  timestamps: true,
});

export default UserActivityLog;

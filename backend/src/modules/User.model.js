const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Student', 'Batch Rep', 'Admin', 'Club', 'Business'),
    allowNull: false,
    defaultValue: 'Student',
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true, // S3 object key e.g. 'avatars/user-123/profile.jpg'
  },
  status: {
    type: DataTypes.ENUM('Active', 'Suspended'),
    allowNull: false,
    defaultValue: 'Active',
  },
  isOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  resetToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetTokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;

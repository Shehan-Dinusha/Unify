const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClubProfile = sequelize.define('ClubProfile', {
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
  clubName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  establishedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'club_profiles',
  timestamps: true,
});

module.exports = ClubProfile;

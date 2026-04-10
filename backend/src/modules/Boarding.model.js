const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Boarding = sequelize.define('Boarding', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  hostId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  slots: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM('Male Only', 'Female Only', 'Any'),
    allowNull: true,
    defaultValue: 'Any',
  },
  roomType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amenities: {
    type: DataTypes.JSON, 
    allowNull: true,
  },
  images: {
    type: DataTypes.JSON, // Arrays of strings
    allowNull: true,
  },
}, {
  tableName: 'boardings',
  timestamps: true,
});

module.exports = Boarding;

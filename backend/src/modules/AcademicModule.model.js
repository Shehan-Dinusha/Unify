const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AcademicModule = sequelize.define('AcademicModule', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  semesterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  degrees: {
    type: DataTypes.JSON, 
    allowNull: true,
  },
}, {
  tableName: 'academic_modules',
  timestamps: true,
});

module.exports = AcademicModule;

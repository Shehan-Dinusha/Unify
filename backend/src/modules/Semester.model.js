const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Semester = sequelize.define('Semester', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING, // e.g. "Semester 1"
    allowNull: false,
  },
}, {
  tableName: 'semesters',
  timestamps: true,
});

module.exports = Semester;

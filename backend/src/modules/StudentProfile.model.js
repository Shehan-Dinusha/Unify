const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentProfile = sequelize.define('StudentProfile', {
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
  studentCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  faculty: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true, // E.g. 'Computer Science', 'Civil Engineering'
  },
  degree: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  year: {
    type: DataTypes.STRING,
    allowNull: true, // E.g. 'Year 2', '3rd Year'
  },
  gpa: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true, // E.g. 3.75
  },
  batch: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true, // Home or boarding address
  },
  joinDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  tier: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Standard',
  },
}, {
  tableName: 'student_profiles',
  timestamps: true,
});

module.exports = StudentProfile;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ModuleCategory = sequelize.define('ModuleCategory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  moduleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  iconName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'module_categories',
  timestamps: true,
});

module.exports = ModuleCategory;

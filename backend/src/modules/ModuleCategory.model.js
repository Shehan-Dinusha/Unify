import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

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
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  iconName: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  tableName: 'module_categories',
  timestamps: true,
});

export default ModuleCategory;

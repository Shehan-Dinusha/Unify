import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

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
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
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

export default AcademicModule;

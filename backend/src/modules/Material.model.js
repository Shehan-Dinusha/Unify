import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Material = sequelize.define('Material', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  moduleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  uploaderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  fileType: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  fileSize: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: true, // S3 object key e.g. 'materials/module-id/file.pdf'
  },
}, {
  tableName: 'materials',
  timestamps: true,
});

export default Material;

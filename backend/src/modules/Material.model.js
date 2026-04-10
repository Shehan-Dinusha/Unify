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
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fileSize: {
    type: DataTypes.STRING,
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

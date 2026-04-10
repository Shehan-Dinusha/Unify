import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  reporterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  offenderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  reviewId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  commentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false, // Core complaint text submitted by the student
  },
  evidence: {
    type: DataTypes.JSON,
    allowNull: true, // Array of file URLs (e.g., screenshots, PDFs) attached as proof
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Pending Review', 'In Review', 'In Progress', 'Resolved', 'Dismissed', 'Withdrawn', 'Disabled'),
    allowNull: false,
    defaultValue: 'Pending',
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    allowNull: false,
    defaultValue: 'Low',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'reports',
  timestamps: true,
});

export default Report;

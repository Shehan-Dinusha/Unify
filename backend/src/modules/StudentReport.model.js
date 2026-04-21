import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StudentReport = sequelize.define(
  'StudentReport',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reportId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    studentId: {
      type: DataTypes.INTEGER, // Matching the User id type (INTEGER) found in other models
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [5, 200],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [20, 5000],
      },
    },
    category: {
      type: DataTypes.ENUM('Facility', 'IT Support', 'Academic', 'Library', 'Other'),
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    reportedEntityName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    reportedEntityId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        'Pending Review',
        'In Progress',
        'Resolved',
        'Withdrawn',
        'Dismissed'
      ),
      defaultValue: 'Pending Review',
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
      defaultValue: 'Medium',
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    withdrawalReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    withdrawnAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'student_reports',
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['studentId'] },
      { fields: ['status'] },
      { fields: ['category'] },
      { fields: ['createdAt'] },
    ],
  }
);

export default StudentReport;

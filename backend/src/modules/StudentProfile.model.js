import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const StudentProfile = sequelize.define(
  "StudentProfile",
  {
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
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    faculty: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: true, // E.g. 'Computer Science', 'Civil Engineering'
    },
    degree: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    year: {
      type: DataTypes.STRING(255),
      allowNull: true, // E.g. 'Year 2', '3rd Year'
    },
    gpa: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true, // E.g. 3.75
    },
    batch: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true, // Home or boarding address
    },
    joinDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tier: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "Standard",
    },
  },
  {
    tableName: "student_profiles",
    timestamps: true,
  },
);

export default StudentProfile;

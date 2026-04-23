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

    registrationNumber: {
      type: DataTypes.STRING(50),
      allowNull: true, // handled in controller
    },

    universityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    facultyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    degreeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    batchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    firstName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: true,
    },

    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // 🔥 supports frontend multiple addresses
    addresses: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    isBatchRep: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    joinDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    tier: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Standard",
    },
  },
  {
    tableName: "student_profiles",
    timestamps: true,
  },
);

export default StudentProfile;

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

/**
 * StudentReport Model
 * Refactored to 100% parity with the Frontend UI scenarios.
 * Fixed: Moved unique constraint to indexes to avoid Sequelize ALTER TABLE syntax errors.
 */
const StudentReport = sequelize.define(
  "StudentReport",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reportId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      // Removed unique: true from here to fix PostgreSQL ALTER TABLE crash
      comment: "Human-readable ID like #RPT-20260421-XXXX",
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    reportType: {
      type: DataTypes.ENUM("post", "comment", "user"),
      allowNull: false,
      comment: "What is being reported (Post, Comment, or User Profile)",
    },
    category: {
      type: DataTypes.ENUM(
        "inappropriate",
        "spam",
        "harassment",
        "misinformation",
        "other",
      ),
      allowNull: false,
      comment: "Why it is being reported (matches UI reportReasons)",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Auto-generated title for listing: e.g., 'Report: Spam on Post'",
    },
    additionalDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Optional comments from Step 3 of the UI",
    },
    evidenceFile: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Path to uploaded screenshot/PDF",
    },
    evidenceUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Optional external link provided in Step 3",
    },
    reportedEntityId: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "Pending Review",
        "In Progress",
        "Resolved",
        "Withdrawn",
        "Dismissed",
      ),
      allowNull: false,
      defaultValue: "Pending Review",
    },
    priority: {
      type: DataTypes.ENUM("Low", "Medium", "High", "Critical"),
      allowNull: false,
      defaultValue: "Medium",
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    withdrawnAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    withdrawalReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "student_reports",
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ["reportId"],
      },
    ],
  },
);

export default StudentReport;

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

/**
 * BoostLog Model
 * Tracks configuration changes made by admins to boost packages.
 * 100% Compatible with Frontend BoostController "Recent Configuration Changes" list.
 */
const BoostLog = sequelize.define(
  "BoostLog",
  {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      comment: "Log ID: e.g., log-1712345678901",
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "Type of action: package_added, package_updated, package_deleted",
    },
    packageId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "FK to boost_packages.id — the package affected",
    },
    changedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "User ID of admin who made the change",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Short title of the change",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Detailed description of the change",
    },
    changes: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "JSON diff of what changed — { field: { old, new } }",
    },
  },
  {
    tableName: "boost_logs",
    timestamps: true,
  },
);

export default BoostLog;

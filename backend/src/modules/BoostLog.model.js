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
  },
  {
    tableName: "boost_logs",
    timestamps: true,
  },
);

export default BoostLog;

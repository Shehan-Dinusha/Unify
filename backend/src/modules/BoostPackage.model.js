import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

/**
 * BoostPackage Model
 * Defines advertising tiers that admin configures for businesses.
 * 100% Compatible with Frontend BoostController + BoostSelectPackage pages.
 */
const BoostPackage = sequelize.define(
  "BoostPackage",
  {
    id: {
      type: DataTypes.STRING(255), // e.g. #PKG-20260424-A3F2
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Package display name: e.g., Starter, Growth, Dominate",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Price in LKR",
    },
    durationValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Numeric duration value: e.g., 24, 3, 7",
    },
    durationUnit: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Duration unit: Hours, Days, or Weeks",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Package description shown on selection cards",
    },
    badge: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Badge label: No Badge, Most Popular, Premium, Best Value",
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Array of feature strings displayed on the package card",
    },
    status: {
      type: DataTypes.ENUM("live", "archived"),
      allowNull: false,
      defaultValue: "live",
    },
  },
  {
    tableName: "boost_packages",
    timestamps: true,
  },
);

export default BoostPackage;

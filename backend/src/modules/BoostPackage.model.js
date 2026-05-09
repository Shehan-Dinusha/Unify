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
    /**
     * boostConfig — The 5 engine parameters that ACTUALLY control boost behavior.
     *
     * {
     *   feedPriority:         Number (1-10) — Lower = higher position in feed. 1 = always first.
     *   visibilityMultiplier: Number (1-5)  — How many extra times the post can appear across feed loads.
     *   highlightStyle:       String ("none"|"subtle"|"blue"|"gold") — Visual card style in feed.
     *   crossCategoryReach:   Boolean — If true, post appears in ALL category feeds, not just its own.
     *   analyticsLevel:       String ("none"|"basic"|"detailed") — What stats the business user can see.
     * }
     */
    boostConfig: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        feedPriority: 10,
        visibilityMultiplier: 1,
        highlightStyle: "none",
        crossCategoryReach: false,
        analyticsLevel: "none",
      },
      comment: "Engine parameters that control actual boost behavior in the feed",
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

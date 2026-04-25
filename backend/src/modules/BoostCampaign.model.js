import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

/**
 * BoostCampaign Model
 * Represents an active or completed boosting campaign created by a business user.
 * 100% Compatible with Frontend BoostConfirmOrder, BoostPostSuccess, BoostAnalytics pages.
 */
const BoostCampaign = sequelize.define(
  "BoostCampaign",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    campaignId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "Human-readable ID like #Campaign-8392-X",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "The business user who created this campaign",
      references: {
        model: "users",
        key: "id",
      },
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "The post being boosted",
    },
    packageId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "The boost package selected",
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Campaign name: e.g., Summer Sale Campaign",
    },
    postTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Title of the boosted post for display",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Campaign description",
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Post image path/URL for display",
    },
    status: {
      type: DataTypes.ENUM("Pending", "Active", "Paused", "Completed", "Cancelled"),
      allowNull: false,
      defaultValue: "Pending",
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Total budget = package price (equals total after tax)",
    },
    dailyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Computed daily rate = price / durationDays",
    },
    durationDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Total campaign duration in days",
    },
    estReach: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Estimated reach label: e.g., ~5k Views",
    },
    placement: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Ad placement: Feed, Homepage, etc.",
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Package price before tax",
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      comment: "Tax amount (0.8% of subtotal)",
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Final total = subtotal + tax",
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Campaign start date (set on activation)",
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Campaign end date (computed from startDate + durationDays)",
    },
    impressions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    clicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    organicReach: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    salesAttributed: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
      allowNull: false,
      defaultValue: "pending",
    },
    stripeSessionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Stripe Checkout session ID — for future Stripe integration",
    },
  },
  {
    tableName: "boost_campaigns",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["campaignId"],
      },
    ],
  },
);

export default BoostCampaign;

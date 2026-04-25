import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

/**
 * BoostInteraction Model
 * Tracks individual user interactions on boosted campaigns.
 * 100% Compatible with Frontend BoostAnalytics Top Interactions table.
 */
const BoostInteraction = sequelize.define(
  "BoostInteraction",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    campaignId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "The campaign this interaction belongs to",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "The user who performed the interaction",
    },
    action: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Interaction type: Comment, Like, Share, Click, Purchase",
    },
    content: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Interaction content: e.g., comment text, 'Liked the post'",
    },
    impact: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Impact level: High, Medium, Low, Conversion",
    },
    date: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Formatted display date: e.g., Oct 14, 2:30 PM",
    },
  },
  {
    tableName: "boost_interactions",
    timestamps: true,
  },
);

export default BoostInteraction;

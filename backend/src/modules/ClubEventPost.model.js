import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ClubEventPost = sequelize.define(
  "ClubEventPost",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    coverImage: {
      type: DataTypes.JSON, // Can store url and metadata
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY, // Just the date part
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING(50), // Standard time string e.g. "14:30"
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
    },
    tiers: {
      type: DataTypes.JSON,
      allowNull: true, // Array of tier objects e.g. [{ id: 1, label: "VIP", enabled: true, price: "50.00", isFree: false }]
    },
    isPromoted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "club_event_posts",
    timestamps: true,
  }
);

export default ClubEventPost;

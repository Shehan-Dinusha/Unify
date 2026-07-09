import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, // The user receiving the notification
    },
    actorId: {
      type: DataTypes.INTEGER,
      allowNull: true, // The user who triggered the notification (liker, commenter, etc.)
    },
    type: {
      type: DataTypes.ENUM("Reply", "Like", "Match", "Verification", "General"),
      allowNull: false,
      defaultValue: "General",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isUnread: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    referenceId: {
      type: DataTypes.INTEGER,
      allowNull: true, // ID of the triggering item (Post, Comment, LostAndFound)
    },
    referenceType: {
      type: DataTypes.STRING(100),
      allowNull: true, // 'Post', 'Comment', 'Match', etc.
    },
    dedupeKey: {
      type: DataTypes.STRING(255),
      allowNull: true, // Unique key to prevent duplicate notifications for the same action
      unique: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true, // Optional thumbnail image (e.g., matched item photo)
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
  },
);

export default Notification;

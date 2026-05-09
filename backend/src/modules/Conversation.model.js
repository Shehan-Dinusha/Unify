import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Conversation = sequelize.define(
  "Conversation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    participantOneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    participantTwoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    lastMessageText: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("seen", "delivered"),
      defaultValue: "delivered",
    },
    deletedByParticipantOne: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deletedByParticipantTwo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    participantOneClearedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    participantTwoClearedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "conversations",
    timestamps: true,
    indexes: [
      { fields: ["participantOneId"] },
      { fields: ["participantTwoId"] },
      { unique: true, fields: ["participantOneId", "participantTwoId"] },
      { fields: ["lastMessageAt"] },
    ],
  },
);

export default Conversation;

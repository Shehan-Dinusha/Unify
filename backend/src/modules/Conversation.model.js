import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { encryptText, decryptText } from "../utils/encryption.util.js";

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
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("lastMessageText");
        return rawValue ? decryptText(rawValue) : null;
      },
      set(value) {
        this.setDataValue("lastMessageText", value ? encryptText(value) : null);
      },
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

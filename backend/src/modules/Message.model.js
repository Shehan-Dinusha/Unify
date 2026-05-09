import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { encryptText, decryptText } from "../utils/encryption.util.js";

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true, // Null if the message is attachments only
      get() {
        const rawValue = this.getDataValue("text");
        return rawValue ? decryptText(rawValue) : null;
      },
      set(value) {
        this.setDataValue("text", value ? encryptText(value) : null);
      },
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true, // Array of { key, name, type, size }
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "messages",
    timestamps: true,
    indexes: [
      { fields: ["conversationId", "createdAt"] },
      { fields: ["senderId"] },
      { fields: ["conversationId", "isRead"] },
    ],
  },
);

export default Message;

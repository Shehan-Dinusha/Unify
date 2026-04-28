import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const OTP = sequelize.define(
  "OTP",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    isUsed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    type: {
      type: DataTypes.ENUM("REGISTRATION", "PASSWORD_RESET"),
      allowNull: false,
      defaultValue: "REGISTRATION",
    },
  },
  {
    tableName: "otps",
    timestamps: true,
    indexes: [
      { fields: ["email"] },
      { fields: ["expiresAt"] },           // speeds up cron expiry cleanup
      { fields: ["isUsed"] },              // speeds up cron used-OTP cleanup
      { fields: ["expiresAt", "isUsed"] }, // composite for combined WHERE clause
    ],
  },

);

export default OTP;

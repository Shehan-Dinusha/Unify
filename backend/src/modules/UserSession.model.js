import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

/**
 * UserSession model — one row per active login session.
 *
 * The refresh token is never stored in plaintext; only its SHA-256 hash
 * is kept here. On each successful token rotation the same row is updated
 * (tokenHash + expiresAt), keeping the session count stable regardless of
 * how many times the access token is refreshed.
 */
const UserSession = sequelize.define(
  "UserSession",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // SHA-256 hash of the raw refresh token — never the plaintext token.
    tokenHash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    // Null means the session is active; a timestamp means it was revoked.
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "user_sessions",
    timestamps: true,
  },
);

export default UserSession;

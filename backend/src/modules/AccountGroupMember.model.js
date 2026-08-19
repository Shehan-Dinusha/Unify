import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

/**
 * AccountGroupMember model — maps a user to an AccountGroup.
 * Each user can belong to AT MOST ONE group (enforced by unique userId).
 */
const AccountGroupMember = sequelize.define(
  "AccountGroupMember",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "account_group_members",
    timestamps: true,
  }
);

export default AccountGroupMember;

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

/**
 * AccountGroup model — represents a cluster of associated accounts.
 */
const AccountGroup = sequelize.define(
  "AccountGroup",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    tableName: "account_groups",
    timestamps: true,
  }
);

export default AccountGroup;

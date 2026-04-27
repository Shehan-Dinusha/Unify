import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserSuspensionHistory = sequelize.define(
  "UserSuspensionHistory",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    suspensionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    performedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    }
  },
  {
    tableName: "user_suspension_histories",
    timestamps: false,
  }
);

export default UserSuspensionHistory;

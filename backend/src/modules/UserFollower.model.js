import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserFollower = sequelize.define(
  "UserFollower",
  {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "user_followers",
    timestamps: true,
  },
);

export default UserFollower;

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const BoostImpressionLog = sequelize.define(
  "BoostImpressionLog",
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
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    dayBucket: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "boost_impression_logs",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "postId", "dayBucket"],
      },
    ],
  }
);

export default BoostImpressionLog;

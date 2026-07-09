import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PostLike = sequelize.define(
  "PostLike",
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
      type: DataTypes.ENUM("normal", "club-product", "club-event", "boarding", "food-cafe", "service"),
      allowNull: false,
    },
  },
  {
    tableName: "post_likes",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "postId", "postType"],
      },
    ],
  }
);

export default PostLike;

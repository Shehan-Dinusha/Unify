import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const NormalPost = sequelize.define(
  "NormalPost",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON, // Array of image URLs or objects
      allowNull: true,
    },
    isPromoted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.ENUM("CLUB", "FOOD", "SELF_EMPLOYED"),
      allowNull: false,
      defaultValue: "CLUB",
    },

  },
  {
    tableName: "normal_posts",
    timestamps: true,
  }
);

export default NormalPost;

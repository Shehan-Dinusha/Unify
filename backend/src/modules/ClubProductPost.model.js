import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ClubProductPost = sequelize.define(
  "ClubProductPost",
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true, // Array of image objects or URLs
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    enableSizes: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sizes: {
      type: DataTypes.JSON,
      allowNull: true, // Array of strings like ["XS", "S", "M", "L"]
    },
    colors: {
      type: DataTypes.JSON,
      allowNull: true, // Array of color objects e.g. [{ id: 1, hex: "#000", name: "Black" }]
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    pickupNote: {
      type: DataTypes.STRING(255),
      allowNull: true, // e.g. "Free pickup from CS Lab on Fridays"
    },
    isPromoted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "club_product_posts",
    timestamps: true,
  }
);

export default ClubProductPost;

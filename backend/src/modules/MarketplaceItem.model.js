import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MarketplaceItem = sequelize.define(
  "MarketplaceItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true, // Array of S3 object keys e.g. ['marketplace/item-id/img1.jpg']
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "marketplace_items",
    timestamps: true,
  },
);

export default MarketplaceItem;

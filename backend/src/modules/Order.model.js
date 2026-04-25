import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Optional if order represents something custom not strictly in items
    },
    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "IN PROGRESS",
        "COMPLETED",
        "CANCELLED",
        "Order Placed",
        "Seller Confirmed",
        "Ready for Pickup",
        "Order Completed",
      ),
      defaultValue: "PENDING",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    qty: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    platformFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    taxes: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    pickupLocation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    pickupRoom: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    pickupTime: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    colorHex: {
      type: DataTypes.STRING(255),
      allowNull: true, // Stores the explicit CSS hex code like '#2B8CEE'
    },
    size: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    timeline: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  },
);

export default Order;

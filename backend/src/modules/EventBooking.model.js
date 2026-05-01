import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const EventBooking = sequelize.define(
  "EventBooking",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tierId: {
      type: DataTypes.STRING(100), // ID or label of the tier selected
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "CONFIRMED", "ATTENDED", "CANCELLED"),
      defaultValue: "PENDING",
    },
    paymentStatus: {
      type: DataTypes.ENUM("PAID", "UNPAID"),
      defaultValue: "UNPAID",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    qty: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    qrCode: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    timeline: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "event_bookings",
    timestamps: true,
  },
);

export default EventBooking;

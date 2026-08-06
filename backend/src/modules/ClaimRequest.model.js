import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ClaimRequest = sequelize.define(
  "ClaimRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    claimantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Accepted", "Rejected"),
      allowNull: false,
      defaultValue: "Pending",
    },
  },
  {
    tableName: "claim_requests",
    timestamps: true,
  },
);

export default ClaimRequest;

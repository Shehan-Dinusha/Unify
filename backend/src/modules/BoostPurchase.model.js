import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

//Records every boost purchase made by a business user.
const BoostPurchase = sequelize.define(
  "BoostPurchase",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "The user who purchased the boost",
      references: {
        model: "users",
        key: "id",
      },
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "The business profile id (if applicable)",
    },
    packageId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "FK to boost_packages.id",
      references: {
        model: "boost_packages",
        key: "id",
      },
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "The post being boosted",
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "UTC timestamp of purchase",
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "UTC timestamp when boost expires (purchaseDate + duration)",
    },
    status: {
      type: DataTypes.ENUM("active", "expired", "used"),
      allowNull: false,
      defaultValue: "active",
    },
    transactionId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Unique transaction reference e.g. TXN-1712345678901-ABCD",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Total amount paid in LKR",
    },
  },
  {
    tableName: "boost_purchases",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["transactionId"],
      },
    ],
  },
);

export default BoostPurchase;

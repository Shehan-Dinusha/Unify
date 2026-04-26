import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const BusinessProfile = sequelize.define(
  "BusinessProfile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    displayName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    businessName: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    category: {
      type: DataTypes.ENUM("BOARDING", "FOOD", "SELF_EMPLOYED"),
      allowNull: false,
    },

    about: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    serviceType: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    addresses: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    // 🔥 Owner details (frontend sends these)
    ownerFirstName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    ownerLastName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    nic: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: true,
    },

    // 🔥 contact fields (frontend expects these)
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    logo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    verificationDocument: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    averageRating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "business_profiles",
    timestamps: true,
  },
);

export default BusinessProfile;

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ClubProfile = sequelize.define(
  "ClubProfile",
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

    clubName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    about: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    logo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    coverImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "club_profiles",
    timestamps: true,
  },
);

export default ClubProfile;

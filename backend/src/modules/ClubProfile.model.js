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
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    logo: {
      type: DataTypes.TEXT,
      allowNull: true, // S3 object key e.g. 'clubs/club-id/logo.png'
    },
    coverImage: {
      type: DataTypes.TEXT,
      allowNull: true, // S3 object key e.g. 'clubs/club-id/cover.jpg'
    },
    establishedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "club_profiles",
    timestamps: true,
  },
);

export default ClubProfile;

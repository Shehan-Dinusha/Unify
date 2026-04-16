import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Student", "Batch Rep", "Admin", "Club", "Business"),
      allowNull: false,
      defaultValue: "Student",
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true, // S3 object key e.g. 'avatars/user-123/profile.jpg'
    },
    status: {
      type: DataTypes.ENUM("Active", "Suspended"),
      allowNull: false,
      defaultValue: "Active",
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resetToken: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);

export default User;

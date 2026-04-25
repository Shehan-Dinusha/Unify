import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const University = sequelize.define(
  "University",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  },
  { tableName: "universities", timestamps: true },
);

export default University;

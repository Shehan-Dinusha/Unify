import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Batch = sequelize.define(
  "Batch",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(50), allowNull: false }, // e.g. "21", "22"
  },
  { tableName: "batches", timestamps: true },
);

export default Batch;

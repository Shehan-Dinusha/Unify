import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Department = sequelize.define(
  "Department",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    facultyId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(255), allowNull: false },
  },
  { tableName: "departments", timestamps: true },
);

export default Department;

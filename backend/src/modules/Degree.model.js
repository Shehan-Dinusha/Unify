import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Degree = sequelize.define(
  "Degree",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    facultyId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(255), allowNull: false },
  },
  { tableName: "degrees", timestamps: true },
);

export default Degree;

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Faculty = sequelize.define(
  "Faculty",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    universityId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(255), allowNull: false },
  },
  { tableName: "faculties", timestamps: true },
);

export default Faculty;

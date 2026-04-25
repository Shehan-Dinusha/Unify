import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const SemesterVisibility = sequelize.define(
  "SemesterVisibility",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    degreeId: { type: DataTypes.INTEGER, allowNull: false },
    semesterId: { type: DataTypes.INTEGER, allowNull: false },
    batchId: { type: DataTypes.INTEGER, allowNull: false },
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "semester_visibilities",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["degreeId", "semesterId", "batchId"],
      },
    ],
  },
);

export default SemesterVisibility;

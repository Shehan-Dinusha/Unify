import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Semester = sequelize.define('Semester', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING, // e.g. "Semester 1"
    allowNull: false,
  },
}, {
  tableName: 'semesters',
  timestamps: true,
});

export default Semester;

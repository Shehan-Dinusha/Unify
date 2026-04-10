import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const LostAndFound = sequelize.define('LostAndFound', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Lost', 'Found'),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.STRING, // e.g. Mar 10, 2026 OR actual Date type
    allowNull: true,
  },
  timeOfDay: {
    type: DataTypes.STRING, // e.g. 11:45 AM
    allowNull: true,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true, // S3 object key e.g. 'lost-found/item-id/photo.jpg'
  },
  status: {
    type: DataTypes.ENUM('Active', 'Resolved'),
    allowNull: false,
    defaultValue: 'Active',
  },
}, {
  tableName: 'lost_and_founds',
  timestamps: true,
});

export default LostAndFound;

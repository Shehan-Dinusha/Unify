import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BoostPackage = sequelize.define('BoostPackage', {
  id: {
    type: DataTypes.STRING, // e.g. pkg-001
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  durationValue: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  durationUnit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  badge: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'boost_packages',
  timestamps: true,
});

export default BoostPackage;

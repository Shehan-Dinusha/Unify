import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BusinessProfile = sequelize.define('BusinessProfile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  logo: {
    type: DataTypes.TEXT,
    allowNull: true, // S3 object key e.g. 'businesses/biz-id/logo.png'
  },
  coverImage: {
    type: DataTypes.TEXT,
    allowNull: true, // S3 object key e.g. 'businesses/biz-id/cover.jpg'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  registrationDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  businessRegistrationNumber: {
    type: DataTypes.STRING,
    allowNull: true, // e.g., '#BIZ-8821'
  },
}, {
  tableName: 'business_profiles',
  timestamps: true,
});

export default BusinessProfile;

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
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(20),
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
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  registrationDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  businessRegistrationNumber: {
    type: DataTypes.STRING(255),
    allowNull: true, // e.g., '#BIZ-8821'
  },
}, {
  tableName: 'business_profiles',
  timestamps: true,
});

export default BusinessProfile;

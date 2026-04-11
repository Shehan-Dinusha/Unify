import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BoostCampaign = sequelize.define('BoostCampaign', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  packageId: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Completed'),
    defaultValue: 'Active',
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  estReach: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  placement: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  impressions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  organicReach: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  salesAttributed: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
}, {
  tableName: 'boost_campaigns',
  timestamps: true,
});

export default BoostCampaign;

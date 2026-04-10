import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BoostInteraction = sequelize.define('BoostInteraction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  campaignId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false, // E.g., 'Comment', 'Share', 'Click'
  },
  content: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  impact: {
    type: DataTypes.STRING,
    allowNull: true, // E.g., 'High', 'Medium', 'Conversion'
  },
}, {
  tableName: 'boost_interactions',
  timestamps: true,
});

export default BoostInteraction;

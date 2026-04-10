import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  reviewerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  targetId: {
    type: DataTypes.INTEGER,
    allowNull: false, // E.g., user who provided a service or business
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  helpfulCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  notHelpfulCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isLikedByOwner: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  ownerReply: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'reviews',
  timestamps: true,
});

export default Review;

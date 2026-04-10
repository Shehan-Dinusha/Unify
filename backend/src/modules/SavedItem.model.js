import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SavedItem = sequelize.define('SavedItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  marketplaceItemId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  boardingId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  materialId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'saved_items',
  timestamps: true,
});

export default SavedItem;

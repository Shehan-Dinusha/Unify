import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false, // The user receiving the notification
  },
  type: {
    type: DataTypes.ENUM('Reply', 'Like', 'Match', 'General'),
    allowNull: false,
    defaultValue: 'General',
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isUnread: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  referenceId: {
    type: DataTypes.INTEGER,
    allowNull: true, // ID of the triggering item (Post, Comment, LostAndFound)
  },
  referenceType: {
    type: DataTypes.STRING(100),
    allowNull: true, // 'Post', 'Comment', 'Match', etc.
  },
}, {
  tableName: 'notifications',
  timestamps: true,
});

export default Notification;

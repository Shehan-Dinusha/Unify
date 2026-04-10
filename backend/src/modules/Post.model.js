const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('General', 'Club', 'Advertisement', 'Marketplace', 'LostFound', 'Event', 'Business', 'Service'),
    allowNull: false,
    defaultValue: 'General',
  },
  eventDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true, // Used for Event ticketing tiers, metadata, etc.
  },
  isPromoted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'posts',
  timestamps: true,
});

module.exports = Post;

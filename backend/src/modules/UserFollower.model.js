const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserFollower = sequelize.define('UserFollower', {
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
}, {
  tableName: 'user_followers',
  timestamps: true,
});

module.exports = UserFollower;

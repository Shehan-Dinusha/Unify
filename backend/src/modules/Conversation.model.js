const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  participantOneId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  participantTwoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('seen', 'delivered'),
    defaultValue: 'delivered',
  },
}, {
  tableName: 'conversations',
  timestamps: true,
});

module.exports = Conversation;

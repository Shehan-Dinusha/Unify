'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('boost_impression_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      postType: {
        type: Sequelize.STRING(50)
      },
      dayBucket: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('boost_impression_logs', {
      fields: ['userId', 'postId', 'dayBucket'],
      type: 'unique',
      name: 'unique_user_post_day_impression'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('boost_impression_logs');
  }
};
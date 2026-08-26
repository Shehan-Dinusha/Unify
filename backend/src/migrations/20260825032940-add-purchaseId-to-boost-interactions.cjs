'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Add purchaseId column
    await queryInterface.addColumn('boost_interactions', 'purchaseId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "The boost purchase this interaction belongs to",
    });

    // 2. Modify campaignId to be nullable
    await queryInterface.changeColumn('boost_interactions', 'campaignId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "The campaign this interaction belongs to",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Revert campaignId to allowNull: false
    // Note: this might fail if there are rows with NULL campaignId, but it's standard for down migrations
    await queryInterface.changeColumn('boost_interactions', 'campaignId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // 2. Remove purchaseId
    await queryInterface.removeColumn('boost_interactions', 'purchaseId');
  }
};

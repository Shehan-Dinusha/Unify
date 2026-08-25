"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("boost_purchases", "impressions", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: "Total views tracked by IntersectionObserver",
    });
    await queryInterface.addColumn("boost_purchases", "clicks", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: "Total clicks on the boosted post",
    });
    await queryInterface.addColumn("boost_purchases", "salesAttributed", {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0,
      comment: "Total order value generated while active",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("boost_purchases", "impressions");
    await queryInterface.removeColumn("boost_purchases", "clicks");
    await queryInterface.removeColumn("boost_purchases", "salesAttributed");
  },
};

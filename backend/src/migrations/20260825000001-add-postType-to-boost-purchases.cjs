"use strict";

/** Migration: Add postType column to boost_purchases
 *
 * WHY: postType (normal, club-product, club-event, boarding) was passed
 * at purchase time but never stored. Storing it lets the analytics page
 * know which sub-table the post lives in, enabling correct Edit Post navigation.
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("boost_purchases", "postType", {
      type: Sequelize.STRING(50),
      allowNull: true,
      defaultValue: null,
      comment: "Post type: normal | club-product | club-event | boarding",
      after: "postId", // MySQL only; Postgres ignores this, adds at end
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("boost_purchases", "postType");
  },
};

"use strict";

/**
 * Migration: Drop the foreign key constraint on boost_purchases.postId
 *
 * WHY: The boost_purchases.postId column was incorrectly constrained to
 * reference the `posts` table only. However, business users can boost posts
 * that live in type-specific tables (normal_posts, club_product_posts,
 * club_event_posts, boardings, etc.) — none of which have rows in `posts`.
 * This caused a FK violation error whenever a business tried to purchase
 * a boost package for any of those post types.
 *
 * FIX: Remove the FK constraint. The postId column remains nullable and is
 * validated at the application level (boost.service.js → purchaseBoost).
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    // PostgreSQL names the FK automatically as "boost_purchases_postId_fkey"
    // (Sequelize / pg uses the column name with camelCase preserved)
    try {
      await queryInterface.removeConstraint(
        "boost_purchases",
        "boost_purchases_postId_fkey"
      );
    } catch (err) {
      // If the constraint name differs between environments, try the snake_case variant
      try {
        await queryInterface.removeConstraint(
          "boost_purchases",
          "boost_purchases_post_id_fkey"
        );
      } catch (err2) {
        // Constraint may not exist (already removed or never created) — safe to ignore
        console.warn(
          "boost_purchases postId FK constraint not found, skipping removal:",
          err2.message
        );
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // Re-add the FK if rolling back (only works if the posts table has matching rows)
    await queryInterface.addConstraint("boost_purchases", {
      fields: ["postId"],
      type: "foreign key",
      name: "boost_purchases_postId_fkey",
      references: {
        table: "posts",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
};

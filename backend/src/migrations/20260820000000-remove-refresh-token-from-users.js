/**
 * Migration: remove refreshToken column from users table
 *
 * Removes the legacy refreshToken column from the users table.
 * All active refresh tokens are managed securely via the user_sessions table.
 */
export default {
  up: async (queryInterface) => {
    await queryInterface.removeColumn("users", "refreshToken");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "refreshToken", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
};

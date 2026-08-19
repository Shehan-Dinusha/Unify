/**
 * Migration: create user_sessions table
 *
 * Adds a new user_sessions table for per-session refresh token storage.
 * This migration is purely additive and does NOT modify the existing users table.
 * The legacy users.refreshToken column is intentionally left in place so no
 * existing user data is lost.
 */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_sessions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      tokenHash: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      userAgent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ipAddress: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      revokedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex("user_sessions", ["userId"], {
      name: "user_sessions_userId_idx",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("user_sessions");
  },
};

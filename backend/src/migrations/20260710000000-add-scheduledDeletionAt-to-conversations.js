import { Op } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("conversations", "scheduledDeletionAt", {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });

    // Index for the cleanup cron job query
    await queryInterface.addIndex("conversations", ["scheduledDeletionAt"], {
      name: "conversations_scheduled_deletion_at",
      where: { scheduledDeletionAt: { [Op.ne]: null } },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      "conversations",
      "conversations_scheduled_deletion_at"
    );
    await queryInterface.removeColumn("conversations", "scheduledDeletionAt");
  },
};


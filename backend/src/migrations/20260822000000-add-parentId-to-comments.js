export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("comments", "parentId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: "comments",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("comments", "parentId");
  },
};

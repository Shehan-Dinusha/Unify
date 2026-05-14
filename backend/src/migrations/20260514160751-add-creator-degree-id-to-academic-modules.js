export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("academic_modules", "creatorDegreeId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "degrees", // this is the table name for Degree
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("academic_modules", "creatorDegreeId");
  },
};

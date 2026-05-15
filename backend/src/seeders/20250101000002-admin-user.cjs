"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash("Admin@123", 10);
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Super Admin",
          email: "admin@unify.lk",
          phone: "+94 76 378 5300",
          passwordHash,
          role: "Admin",
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", { email: "admin@unify.lk" });
  },
};

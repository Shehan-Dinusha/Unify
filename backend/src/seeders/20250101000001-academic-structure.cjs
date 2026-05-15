"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. University
    await queryInterface.bulkInsert(
      "universities",
      [
        {
          name: "University of Moratuwa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // 2. Semesters
    const semesters = [
      "Semester 01",
      "Semester 02",
      "Semester 03",
      "Semester 04",
      "Semester 05",
      "Semester 06",
      "Semester 07",
      "Semester 08",
    ];
    await Promise.all(
      semesters.map((name) =>
        queryInterface.bulkInsert(
          "semesters",
          [{ name, createdAt: new Date(), updatedAt: new Date() }],
          { ignoreDuplicates: true },
        ),
      ),
    );

    // 3. Batches
    const batches = ["Batch 21", "Batch 22", "Batch 23", "Batch 24", "Batch 25"];
    await Promise.all(
      batches.map((name) =>
        queryInterface.bulkInsert(
          "batches",
          [{ name, createdAt: new Date(), updatedAt: new Date() }],
          { ignoreDuplicates: true },
        ),
      ),
    );

    // 4. Faculties and Degrees
    const faculties = [
      {
        name: "Architecture",
        degrees: [
          "BArch (Hons)",
          "BLA (Hons)",
          "BDes (Hons)",
          "BSc (Hons) in Quantity Surveying",
          "BSc (Hons) in Facilities Management",
          "BSc (Hons) in Town & Country Planning",
        ],
      },
      {
        name: "Engineering",
        degrees: [
          "BDes in Fashion Design & Product Development",
          "BSc Eng (Hons) in Chemical & Process Engineering",
          "BSc Eng (Hons) in Civil Engineering",
          "BSc Eng (Hons) in Computer Science & Engineering",
          "BSc Eng (Hons) in Earth Resource Engineering",
          "BSc Eng (Hons) in Electrical Engineering",
          "BSc Eng (Hons) in Electronic & Telecommunication Engineering",
          "BSc Eng (Hons) in Materials Science & Engineering",
          "BSc Eng (Hons) in Mechanical Engineering",
          "BSc Eng (Hons) in Textile & Apparel Engineering",
          "BSc Eng (Hons) in Transport Management & Logistic Engineering",
        ],
      },
      {
        name: "Information Technology",
        degrees: [
          "BSc (Hons) in Information Technology",
          "BSc (Hons) in Information Technology & Management",
          "BSc (Hons) in Artificial Intelligence",
        ],
      },
      {
        name: "Business",
        degrees: ["BBSc (Hons)"],
      },
      {
        name: "Medicine",
        degrees: ["BSc (Hons) in Medicine"],
      },
    ];

    const uniRows = await queryInterface.sequelize.query(
      `SELECT id FROM "universities" WHERE name = 'University of Moratuwa' LIMIT 1`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );
    const universityId = uniRows[0]?.id;
    if (!universityId) return;

    for (const fac of faculties) {
      await queryInterface.bulkInsert(
        "faculties",
        [
          {
            name: fac.name,
            universityId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { ignoreDuplicates: true },
      );

      const facRows = await queryInterface.sequelize.query(
        `SELECT id FROM "faculties" WHERE name = :name AND "universityId" = :uniId LIMIT 1`,
        {
          replacements: { name: fac.name, uniId: universityId },
          type: queryInterface.sequelize.QueryTypes.SELECT,
        },
      );
      const facultyId = facRows[0]?.id;
      if (!facultyId) continue;

      const degreeRows = fac.degrees.map((name) => ({
        name,
        facultyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await queryInterface.bulkInsert("degrees", degreeRows, {
        ignoreDuplicates: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("degrees", null, {});
    await queryInterface.bulkDelete("faculties", null, {});
    await queryInterface.bulkDelete("batches", null, {});
    await queryInterface.bulkDelete("semesters", null, {});
    await queryInterface.bulkDelete("universities", null, {});
  },
};

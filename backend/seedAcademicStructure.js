import {
  sequelize,
  University,
  Faculty,
  Degree,
  Batch,
} from "./src/modules/index.js";

const data = {
  university: "University of Moratuwa",
  batches: ["21", "22", "23", "24", "25"],
  faculties: [
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
  ],
};

const seedAcademicStructure = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected. Starting seed...");

    // 1. Seed Batches
    for (const batchName of data.batches) {
      await Batch.findOrCreate({ where: { name: batchName } });
    }
    console.log("✅ Batches seeded");

    // 2. Seed University
    const [university] = await University.findOrCreate({
      where: { name: data.university },
    });
    console.log(`✅ University seeded: ${university.name}`);

    // 3. Seed Faculties and Degrees
    for (const facData of data.faculties) {
      const [faculty] = await Faculty.findOrCreate({
        where: { name: facData.name, universityId: university.id },
      });

      for (const degreeName of facData.degrees) {
        await Degree.findOrCreate({
          where: { name: degreeName, facultyId: faculty.id },
        });
      }
      console.log(`✅ Seeded Faculty and Degrees for: ${faculty.name}`);
    }

    console.log("🎉 Academic structure seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding academic structure:", error);
    process.exit(1);
  }
};

seedAcademicStructure();

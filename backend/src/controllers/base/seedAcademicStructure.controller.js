import {
  sequelize,
  University,
  Faculty,
  Degree,
  Batch,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

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

export const seedAcademicStructure = async (req, res, next) => {
  try {
    await sequelize.authenticate();
    logger.info("Database connected. Starting seed...");

    // 1. Seed Batches
    for (const batchName of data.batches) {
      await Batch.findOrCreate({ where: { name: batchName } });
    }
    logger.info("✅ Batches seeded");

    // 2. Seed University
    const [university] = await University.findOrCreate({
      where: { name: data.university },
    });
    logger.info(`✅ University seeded: ${university.name}`);

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
      logger.info(`✅ Seeded Faculty and Degrees for: ${faculty.name}`);
    }

    logger.info("🎉 Academic structure seed completed successfully!");
    return sendResponse(
      res,
      200,
      true,
      "Academic structure seed completed successfully!",
    );
  } catch (error) {
    logger.error("❌ Error seeding academic structure:", error);
    return sendResponse(
      res,
      500,
      false,
      "Failed to seed academic structure",
      error.message,
    );
  }
};

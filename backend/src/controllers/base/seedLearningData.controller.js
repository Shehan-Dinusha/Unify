import bcrypt from "bcryptjs";
import {
  sequelize,
  User,
  StudentProfile,
  Degree,
  Batch,
  Semester,
  Faculty,
  AcademicModule,
  ModuleCategory,
  SemesterVisibility,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

export const seedLearningData = async (req, res, next) => {
  logger.info("Starting learning data seed...");

  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const passwordHash = await bcrypt.hash("password123", 10);

    // ── 1. Fetch required academic data (must exist from seedAcademicStructure) ──
    const itFaculty = await Faculty.findOne({
      where: { name: "Information Technology" },
    });
    if (!itFaculty) {
      return sendResponse(res, 400, false, "Run seedAcademicStructure first — IT Faculty not found");
    }

    const itDegree = await Degree.findOne({
      where: { name: "BSc (Hons) in Information Technology" },
    });
    if (!itDegree) {
      return sendResponse(res, 400, false, "Run seedAcademicStructure first — IT Degree not found");
    }

    const batch21 = await Batch.findOne({ where: { name: "Batch 21" } });
    const batch22 = await Batch.findOne({ where: { name: "Batch 22" } });
    if (!batch21 || !batch22) {
      return sendResponse(res, 400, false, "Run seedAcademicStructure first — Batches not found");
    }

    const semesters = await Semester.findAll({
      where: { name: ["Semester 01", "Semester 02", "Semester 03"] },
      order: [["name", "ASC"]],
    });
    if (semesters.length < 3) {
      return sendResponse(res, 400, false, "Run seedAcademicStructure first — Semesters not found");
    }

    const [sem1, sem2, sem3] = semesters;

    // ── 2. Create Student User (Batch 22) ──
    const [studentUser] = await User.findOrCreate({
      where: { email: "student.test@unify.com" },
      defaults: {
        name: "Test Student",
        email: "student.test@unify.com",
        passwordHash,
        role: "Student",
        phone: "+94771000001",
        status: "Active",
      },
    });

    await StudentProfile.findOrCreate({
      where: { userId: studentUser.id },
      defaults: {
        userId: studentUser.id,
        registrationNumber: "IT-22-001",
        facultyId: itFaculty.id,
        degreeId: itDegree.id,
        batchId: batch22.id,
        tier: "Standard",
        isBatchRep: false,
      },
    });

    // ── 3. Create Batch Rep User (Batch 21) ──
    const [repUser] = await User.findOrCreate({
      where: { email: "rep.test@unify.com" },
      defaults: {
        name: "Test Batch Rep",
        email: "rep.test@unify.com",
        passwordHash,
        role: "Student",
        phone: "+94771000002",
        status: "Active",
      },
    });

    await StudentProfile.findOrCreate({
      where: { userId: repUser.id },
      defaults: {
        userId: repUser.id,
        registrationNumber: "IT-21-001",
        facultyId: itFaculty.id,
        degreeId: itDegree.id,
        batchId: batch21.id,
        tier: "Premium",
        isBatchRep: true,
      },
    });

    // ── 4. Create Academic Modules ──
    const modulesData = [
      { code: "IT1011", name: "Introduction to Computing", semester: sem1 },
      { code: "IT1022", name: "Programming Fundamentals", semester: sem1 },
      { code: "IT1033", name: "Mathematics for Computing", semester: sem1 },
      { code: "IT2011", name: "Data Structures & Algorithms", semester: sem2 },
      { code: "IT2022", name: "Database Management Systems", semester: sem2 },
      { code: "IT2033", name: "Web Technologies", semester: sem2 },
      { code: "IT3011", name: "Software Engineering", semester: sem3 },
      { code: "IT3022", name: "Computer Networks", semester: sem3 },
    ];

    const createdModules = [];
    for (const mod of modulesData) {
      const [module] = await AcademicModule.findOrCreate({
        where: { code: mod.code },
        defaults: {
          code: mod.code,
          name: mod.name,
          semesterId: mod.semester.id,
        },
      });
      createdModules.push(module);

      // Link module to degree via M2M table
      await module.addDegree(itDegree);
    }

    // ── 5. Create Module Categories ──
    const categoriesTemplate = [
      { title: "Notes", iconName: "FileText" },
      { title: "Videos", iconName: "Video" },
      { title: "Lab Reports", iconName: "FlaskConical" },
      { title: "Past Papers", iconName: "ScrollText" },
      { title: "Additional", iconName: "FolderPlus" },
    ];

    for (const mod of createdModules) {
      for (const cat of categoriesTemplate) {
        await ModuleCategory.findOrCreate({
          where: { moduleId: mod.id, title: cat.title },
          defaults: {
            moduleId: mod.id,
            title: cat.title,
            iconName: cat.iconName,
          },
        });
      }
    }

    // ── 6. Create SemesterVisibility records ──
    // Batch 21 → Semesters 01, 02, 03
    for (const sem of semesters) {
      await SemesterVisibility.findOrCreate({
        where: {
          degreeId: itDegree.id,
          semesterId: sem.id,
          batchId: batch21.id,
        },
        defaults: {
          degreeId: itDegree.id,
          semesterId: sem.id,
          batchId: batch21.id,
          isVisible: true,
        },
      });
    }

    // Batch 22 → Semesters 01, 02 only (not Sem 03)
    for (const sem of [sem1, sem2]) {
      await SemesterVisibility.findOrCreate({
        where: {
          degreeId: itDegree.id,
          semesterId: sem.id,
          batchId: batch22.id,
        },
        defaults: {
          degreeId: itDegree.id,
          semesterId: sem.id,
          batchId: batch22.id,
          isVisible: true,
        },
      });
    }

    // ── Summary ──
    const result = {
      studentUser: { id: studentUser.id, email: studentUser.email, batch: "22", role: "Student" },
      batchRepUser: { id: repUser.id, email: repUser.email, batch: "21", role: "Batch Rep" },
      modules: createdModules.map((m) => ({ id: m.id, code: m.code, name: m.name })),
    };

    logger.info("🎉 Learning data seed completed!");
    return sendResponse(res, 200, true, "Learning data seeded successfully!", result);
  } catch (error) {
    logger.error("❌ Error seeding learning data:", error);
    return sendResponse(res, 500, false, "Failed to seed learning data", error.message);
  }
};

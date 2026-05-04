import {
  StudentProfile,
  Faculty,
  Degree,
  Semester,
  AcademicModule,
  SemesterVisibility,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

export const getStudentCourseStructure = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return sendResponse(res, 400, false, "userId is required");
    }

    const studentProfile = await StudentProfile.findOne({
      where: { userId: parseInt(userId, 10) },
      attributes: ["degreeId", "batchId", "facultyId"],
    });

    if (!studentProfile || !studentProfile.degreeId || !studentProfile.batchId) {
      return sendResponse(res, 404, false, "Student profile not complete");
    }

    const { degreeId, batchId, facultyId } = studentProfile;

    const faculty = await Faculty.findByPk(facultyId, {
      attributes: ["name"],
    });

    const degree = await Degree.findByPk(degreeId, {
      attributes: ["name"],
    });

    if (!degree) {
      return sendResponse(res, 404, false, "Degree not found");
    }

    const visibleSemesters = await SemesterVisibility.findAll({
      where: {
        degreeId,
        batchId,
        isVisible: true,
      },
      attributes: ["semesterId"],
    });

    if (visibleSemesters.length === 0) {
      return sendResponse(res, 200, true, "No semesters visible for this batch", {
        facultyName: faculty?.name || null,
        degreeName: degree.name,
        semesters: [],
      });
    }

    const semesterIds = visibleSemesters.map((v) => v.semesterId);

    const semesters = await Semester.findAll({
      where: { id: semesterIds },
      attributes: ["id", "name"],
      order: [["id", "ASC"]],
      include: [
        {
          model: AcademicModule,
          as: "modules",
          attributes: ["id", "code", "name"],
          include: [
            {
              model: Degree,
              as: "degrees",
              attributes: [],
              through: { attributes: [] },
              where: { id: degreeId },
              required: true,
            },
          ],
        },
      ],
    });

    const formattedSemesters = semesters.map((sem) => ({
      id: sem.id,
      name: sem.name,
      modules: sem.modules.map((mod) => ({
        id: mod.id,
        code: mod.code,
        name: mod.name,
      })),
    }));

    return sendResponse(res, 200, true, "Course structure retrieved successfully", {
      facultyName: faculty?.name || null,
      degreeName: degree.name,
      semesters: formattedSemesters,
    });
  } catch (error) {
    logger.error(`Error in getStudentCourseStructure: ${error.message}`);
    next(error);
  }
};

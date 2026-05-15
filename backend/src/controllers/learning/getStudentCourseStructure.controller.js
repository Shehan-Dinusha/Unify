import {
  StudentProfile,
  Faculty,
  Degree,
  Batch,
  Semester,
  AcademicModule,
  SemesterVisibility,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

export const getStudentCourseStructure = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const studentProfile = await StudentProfile.findOne({
      where: { userId },
      attributes: ["degreeId", "batchId", "facultyId"],
    });

    if (
      !studentProfile ||
      !studentProfile.degreeId ||
      !studentProfile.batchId
    ) {
      return sendResponse(res, 404, false, "Student profile not complete");
    }

    const { degreeId, batchId, facultyId } = studentProfile;

    const [faculty, degree, batch] = await Promise.all([
      Faculty.findByPk(facultyId, { attributes: ["name"] }),
      Degree.findByPk(degreeId, { attributes: ["name"] }),
      Batch.findByPk(batchId, { attributes: ["name"] }),
    ]);

    if (!degree) {
      return sendResponse(res, 404, false, "Degree not found");
    }

    // Get ALL semesters connected to this degree's modules
    const allSemesters = await Semester.findAll({
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

    // Filter to only include explicitly assigned semesters
    const formattedSemesters = [];
    for (const sem of allSemesters) {
      const explicitVisibleCount = await SemesterVisibility.count({
        where: {
          semesterId: sem.id,
          degreeId: degreeId,
          batchId: batchId,
          isVisible: true,
        },
      });

      if (explicitVisibleCount > 0) {
        formattedSemesters.push({
          id: sem.id,
          name: sem.name,
          modules: sem.modules.map((mod) => ({
            id: mod.id,
            code: mod.code,
            name: mod.name,
          })),
        });
      }
    }

    return sendResponse(
      res,
      200,
      true,
      "Course structure retrieved successfully",
      {
        facultyName: faculty?.name || null,
        degreeName: degree.name,
        batchName: batch?.name || null,
        semesters: formattedSemesters,
      },
    );
  } catch (error) {
    logger.error(`Error in getStudentCourseStructure: ${error.message}`);
    next(error);
  }
};

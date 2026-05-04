import { Semester, AcademicModule, Degree } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

export const getBatchRepCourseStructure = async (req, res, next) => {
  try {
    const { degreeId } = req.query;

    const degree = await Degree.findByPk(parseInt(degreeId, 10), {
      attributes: ["id", "name", "facultyId"],
    });

    if (!degree) {
      return sendResponse(res, 404, false, "Degree not found");
    }

    // Fetch ALL semesters with their modules, filtered by degree via M2M
    const semesters = await Semester.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
      include: [
        {
          model: AcademicModule,
          as: "modules",
          attributes: ["id", "code", "name"],
          include: [
            {
              model: Degree,
              as: "degrees",
              attributes: ["id", "name"],
              through: { attributes: [] },
              where: { id: parseInt(degreeId, 10) },
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

    return sendResponse(
      res,
      200,
      true,
      "Course structure retrieved successfully",
      {
        degreeName: degree.name,
        semesters: formattedSemesters,
      },
    );
  } catch (error) {
    logger.error(`Error in getBatchRepCourseStructure: ${error.message}`);
    next(error);
  }
};

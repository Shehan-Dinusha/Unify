import { AcademicModule, Semester, Degree } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

export const getModuleDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { degreeId } = req.query;

    let facultyId = null;
    if (degreeId) {
      const currentDegree = await Degree.findByPk(degreeId, { attributes: ["facultyId"] });
      if (currentDegree) {
        facultyId = currentDegree.facultyId;
      }
    }

    const degreeWhereClause = facultyId ? { facultyId } : {};

    const [moduleDetails, allDegrees] = await Promise.all([
      AcademicModule.findByPk(id, {
        attributes: ["id", "name", "code"],
        include: [
          {
            model: Degree,
            as: "degrees",
            attributes: ["id", "name", "facultyId"],
            through: {
              attributes: [],
            },
          },
          {
            model: Semester,
            as: "semester",
            attributes: ["id", "name"],
          },
        ],
      }),
      Degree.findAll({
        attributes: ["id", "name"],
        where: degreeWhereClause,
        order: [["name", "ASC"]],
      })
    ]);

    if (!moduleDetails) {
      return sendResponse(res, 404, false, "Module not found.");
    }

    logger.info(`Fetched details for module ID: ${id}`);
    return sendResponse(
      res,
      200,
      true,
      "Module details fetched successfully.",
      {
        module: moduleDetails,
        availableDegrees: allDegrees
      }
    );
  } catch (error) {
    logger.error(`Get Module Details Error: ${error.message}`);
    next(error);
  }
};

import { AcademicModule, Semester, Degree } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

export const getModuleDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const moduleDetails = await AcademicModule.findByPk(id, {
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
    });

    if (!moduleDetails) {
      return sendResponse(res, 404, false, "Module not found.");
    }

    logger.info(`Fetched details for module ID: ${id}`);
    return sendResponse(
      res,
      200,
      true,
      "Module details fetched successfully.",
      moduleDetails,
    );
  } catch (error) {
    logger.error(`Get Module Details Error: ${error.message}`);
    next(error);
  }
};

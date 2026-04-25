import { AcademicModule, Semester, Degree } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";

export const editModuleDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, code, semester, visibility } = req.body;

    const existingModule = await AcademicModule.findByPk(id);

    if (!existingModule) {
      return sendResponse(res, 404, false, "Module not found.");
    }

    // 1. Update Code properties and check for uniqueness
    if (code && code !== existingModule.code) {
      const codeExists = await AcademicModule.findOne({
        where: { code, id: { [Op.ne]: id } },
      });

      if (codeExists) {
        return sendResponse(
          res,
          409,
          false,
          `A module with code '${code}' already exists.`,
        );
      }
      existingModule.code = code;
    }

    // 2. Update Title
    if (title) {
      existingModule.name = title;
    }

    // 3. Update Semester
    if (semester) {
      const foundSemester = await Semester.findByPk(semester);

      if (!foundSemester) {
        return sendResponse(
          res,
          404,
          false,
          `Semester with ID '${semester}' could not be found in the database.`,
        );
      }
      existingModule.semesterId = foundSemester.id;
    }

    // 4. Update Degree Visibility
    let newDegrees = null;
    if (visibility) {
      newDegrees = await Degree.findAll({
        where: { id: visibility },
      });

      if (newDegrees.length !== new Set(visibility).size) {
        return sendResponse(
          res,
          404,
          false,
          "One or more degrees in the visibility list could not be found.",
        );
      }

      const facultyIds = new Set(newDegrees.map((d) => d.facultyId));
      if (facultyIds.size > 1) {
        return sendResponse(
          res,
          400,
          false,
          "All degrees in the visibility list must belong to the same faculty.",
        );
      }
    }

    // Save the flat properties
    await existingModule.save();

    // 5. Update degree mappings using Sequelize auto-generated methods
    if (newDegrees) {
      await existingModule.setDegrees(newDegrees);
    }

    // 6. Fetch the updated module to return
    const updatedModule = await AcademicModule.findByPk(id, {
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

    logger.info(`Module ID ${id} updated successfully`);
    return sendResponse(
      res,
      200,
      true,
      "Module updated successfully.",
      updatedModule,
    );
  } catch (error) {
    logger.error(`Edit Module Details Error: ${error.message}`);
    next(error);
  }
};

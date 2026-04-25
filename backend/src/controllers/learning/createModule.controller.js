import { AcademicModule, Semester, Degree } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

export const createModule = async (req, res, next) => {
  try {
    const { title, code, semester, visibility } = req.body;

    // 2. Validate Degrees and Faculty
    const degrees = await Degree.findAll({
      where: { id: visibility },
    });

    if (degrees.length !== new Set(visibility).size) {
      return sendResponse(
        res,
        404,
        false,
        "One or more degrees in the visibility list could not be found.",
      );
    }

    const facultyIds = new Set(degrees.map((d) => d.facultyId));
    if (facultyIds.size > 1) {
      return sendResponse(
        res,
        400,
        false,
        "All degrees in the visibility list must belong to the same faculty.",
      );
    }

    // 3. Validate Semester ID
    const foundSemester = await Semester.findByPk(semester);

    if (!foundSemester) {
      return sendResponse(
        res,
        404,
        false,
        `Semester with ID '${semester}' could not be found in the database.`,
      );
    }

    // 4. Ensure module code is unique, assuming module codes shouldn't be duplicated usually
    const existingModule = await AcademicModule.findOne({
      where: { code },
    });

    if (existingModule) {
      return sendResponse(
        res,
        409,
        false,
        `A module with code '${code}' already exists.`,
      );
    }

    // 5. Create new module
    const newModule = await AcademicModule.create({
      name: title,
      code,
      semesterId: foundSemester.id,
    });

    // 6. Handle Degree Visibility (many-to-many relationship)
    // Associate this module with the found degrees
    await newModule.addDegrees(degrees);

    // Since we attached degrees, let's fetch the module back with its associations
    const moduleWithDegrees = await AcademicModule.findByPk(newModule.id, {
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

    logger.info(`Module ${code} - ${title} created successfully`);
    return sendResponse(
      res,
      201,
      true,
      "Module created successfully.",
      moduleWithDegrees,
    );
  } catch (error) {
    logger.error(`Create Module Error: ${error.message}`);
    next(error);
  }
};

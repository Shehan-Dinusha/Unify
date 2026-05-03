import { SemesterVisibility, Batch, Degree, Semester } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

export const getSemesterVisibility = async (req, res, next) => {
  try {
    const { degreeId, semesterId } = req.query;

    const degree = await Degree.findByPk(parseInt(degreeId, 10));
    if (!degree) {
      return sendResponse(res, 404, false, "Degree not found");
    }

    const semester = await Semester.findByPk(parseInt(semesterId, 10));
    if (!semester) {
      return sendResponse(res, 404, false, "Semester not found");
    }

    const batches = await Batch.findAll({
      attributes: ["id", "name"],
    });

    // Format for frontend
    const availableBatches = batches.map((b) => ({
      id: b.id,
      name: `Batch ${b.name}`,
      short: `'${b.name}`,
      // Assigning default colors for frontend rendering
      colorBg: "bg-blue-900/30",
      colorText: "text-blue-400",
    }));

    // 2. Fetch current visibility config
    const visibilities = await SemesterVisibility.findAll({
      where: {
        degreeId: parseInt(degreeId, 10),
        semesterId: parseInt(semesterId, 10),
        isVisible: true,
      },
      attributes: ["batchId"],
    });

    const currentVisibility = visibilities.map((v) => v.batchId);

    return sendResponse(
      res,
      200,
      true,
      "Semester visibilities retrieved successfully",
      {
        availableBatches,
        currentVisibility,
      },
    );
  } catch (error) {
    logger.error(`Error in getSemesterVisibility: ${error.message}`);
    next(error);
  }
};

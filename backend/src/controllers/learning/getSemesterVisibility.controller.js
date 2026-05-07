import {
  SemesterVisibility,
  Batch,
  Degree,
  Semester,
} from "../../modules/index.js";
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
    const availableBatches = batches.map((b) => {
      const batchNameRaw = b.name || "";
      const isAlreadyBatch = batchNameRaw.toLowerCase().includes("batch");
      const name = isAlreadyBatch ? batchNameRaw : `Batch ${batchNameRaw}`;
      const shortCode = batchNameRaw.replace(/batch/i, "").trim();

      return {
        id: b.id,
        name,
        short: `'${shortCode}`,
        colorBg: "bg-indigo-900/30",
        colorText: "text-indigo-400",
      };
    });

    // 2. Fetch current visibility config
    const visibilities = await SemesterVisibility.findAll({
      where: {
        degreeId: parseInt(degreeId, 10),
        semesterId: parseInt(semesterId, 10),
        isVisible: true,
      },
      attributes: ["batchId"],
    });

    let currentVisibility = visibilities.map((v) => v.batchId);

    // If no visibility rules exist yet, default to making it visible to everyone (Public)
    if (currentVisibility.length === 0) {
      const visibilityCount = await SemesterVisibility.count({
        where: {
          degreeId: parseInt(degreeId, 10),
          semesterId: parseInt(semesterId, 10),
        },
      });
      // ONLY default to all if it has literally never been configured.
      // If count is 0, it means no records exist.
      if (visibilityCount === 0) {
        currentVisibility = availableBatches.map((b) => b.id);
      }
    }

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

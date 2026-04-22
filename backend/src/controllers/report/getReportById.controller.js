import StudentReport from "../../modules/StudentReport.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Retrieves a single report detail by ID.
 * Ensures the student is authorized to view it.
 */
export const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studentId = req.user?.id || 1;

    const report = await StudentReport.findOne({
      where: { id, studentId },
    });

    if (!report) {
      return sendResponse(res, 404, false, 'Report not found or unauthorized');
    }

    return sendResponse(res, 200, true, 'Report details retrieved', report);
  } catch (error) {
    logger.error(`Error in getReportById controller: ${error.message}`);
    next(error);
  }
};

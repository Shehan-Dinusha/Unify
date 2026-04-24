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
    logger.error(`Error in getReportById controller:`, {
      message: error.message,
      stack: error.stack,
      code: error.code,
      timestamp: new Date().toISOString(),
    });
    
    // Handle specific database errors
    if (error.name === 'SequelizeValidationError') {
      return sendResponse(res, 400, false, 'Validation error: ' + error.errors.map(e => e.message).join(', '));
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return sendResponse(res, 409, false, 'This report already exists.');
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return sendResponse(res, 400, false, 'Referenced record not found.');
    }
    if (error.name === 'SequelizeDatabaseError') {
      return sendResponse(res, 500, false, 'Database error occurred.');
    }
    
    next(error);
  }
};

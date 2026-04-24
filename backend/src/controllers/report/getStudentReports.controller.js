import { Op } from 'sequelize';
import StudentReport from "../../modules/StudentReport.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Retrieves reports for a specific student with filters and pagination.
 * 100% Compatible with StudentSubmittedReports.jsx search and filter requirements.
 */
export const getStudentReports = async (req, res, next) => {
  try {
    const studentId = req.user?.id || 1;

    let { status, category, reportType, search, page = 1, limit = 10 } = req.query;

    // Validate and sanitize pagination parameters
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    if (page < 1) {
      return sendResponse(res, 400, false, 'Page number must be at least 1.');
    }

    if (limit < 1 || limit > 100) {
      return sendResponse(res, 400, false, 'Limit must be between 1 and 100.');
    }

    // Sanitize search query length
    if (search && search.length > 200) {
      return sendResponse(res, 400, false, 'Search query cannot exceed 200 characters.');
    }

    const offset = (page - 1) * limit;

    const where = { studentId };

    // Support for UI filters (status, category, type)
    if (status && status !== 'all') where.status = status;
    if (category && category !== 'all') where.category = category;
    if (reportType && reportType !== 'all') where.reportType = reportType;

    // Support for UI search (Title or ID)
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { reportId: { [Op.iLike]: `%${search}%` } },
        { additionalDetails: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await StudentReport.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    const pagination = {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
    };

    return sendResponse(res, 200, true, 'Reports retrieved successfully', {
      reports: rows,
      pagination,
    });
  } catch (error) {
    logger.error(`Error in getStudentReports controller:`, {
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

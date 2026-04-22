import { Op } from 'sequelize';
import StudentReport from "../../modules/StudentReport.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Handle admin retrieval of the overall report queue with advanced filters.
 * 100% Compatible with ReportModeration.jsx requirement for seeing all reports.
 */
export const getReportQueue = async (req, res, next) => {
  try {
    // TODO: Add admin authorization check once RBAC middleware is available
    
    const { status, category, reportType, priority, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    if (status && status !== 'all') where.status = status;
    if (category && category !== 'all') where.category = category;
    if (reportType && reportType !== 'all') where.reportType = reportType;
    if (priority && priority !== 'all') where.priority = priority;
    
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
      order: [
        ['createdAt', 'DESC'],
      ],
    });

    const pagination = {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
    };

    return sendResponse(res, 200, true, 'Admin report queue retrieved successfully', {
      reports: rows,
      pagination,
    });
  } catch (error) {
    logger.error(`Error in getReportQueue controller: ${error.message}`);
    next(error);
  }
};

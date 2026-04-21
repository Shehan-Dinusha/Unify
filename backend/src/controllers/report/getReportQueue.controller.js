import { Op } from 'sequelize';
import StudentReport from "../../modules/StudentReport.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Handle admin retrieval of the overall report queue with advanced filters.
 */
export const getReportQueue = async (req, res, next) => {
  try {
    // TODO: Add admin authorization check here
    
    const { status, category, priority, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    if (status) where.status = status;
    if (category) where.category = category;
    if (priority) where.priority = priority;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { reportId: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await StudentReport.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ['priority', 'DESC'], // Note: ENUM ordering in SQL might follow definition order (Low, Medium, High, Critical)
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

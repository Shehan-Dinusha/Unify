import { Op } from 'sequelize';
import StudentReport from "../../modules/StudentReport.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Retrieves reports for a specific student with filters and pagination.
 */
export const getStudentReports = async (req, res, next) => {
  try {
    const studentId = req.user?.id || 1;

    const { status, category, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = { studentId };

    if (status) where.status = status;
    if (category) where.category = category;
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
    logger.error(`Error in getStudentReports controller: ${error.message}`);
    next(error);
  }
};

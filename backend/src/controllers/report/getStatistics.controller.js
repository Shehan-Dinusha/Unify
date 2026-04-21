import { sequelize } from "../../modules/index.js";
import StudentReport from "../../modules/StudentReport.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Handle admin retrieval of summary statistics for reports.
 */
export const getStatistics = async (req, res, next) => {
  try {
    // TODO: Add admin authorization check here
    
    const total = await StudentReport.count();
    const pending = await StudentReport.count({ where: { status: 'Pending Review' } });
    const inProgress = await StudentReport.count({ where: { status: 'In Progress' } });
    const resolved = await StudentReport.count({ where: { status: 'Resolved' } });

    const byCategory = await StudentReport.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('category')), 'count'],
      ],
      group: ['category'],
      raw: true,
    });

    const stats = {
      total,
      pending,
      inProgress,
      resolved,
      byCategory,
    };

    return sendResponse(res, 200, true, 'Statistics retrieved successfully', stats);
  } catch (error) {
    logger.error(`Error in getStatistics controller: ${error.message}`);
    next(error);
  }
};

import { sequelize } from "../../modules/index.js";
import StudentReport from "../../modules/StudentReport.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";

/**
 * Handle admin retrieval of summary statistics for reports.
 * Provides breakdown by status, category (reason), and report type.
 */
export const getStatistics = async (req, res, next) => {
  try {
    // TODO: Add admin authorization check once RBAC middleware is available
    
    const total = await StudentReport.count();
    const pending = await StudentReport.count({ where: { status: 'Pending Review' } });
    const inProgress = await StudentReport.count({ where: { status: 'In Progress' } });
    const resolved = await StudentReport.count({ where: { status: 'Resolved' } });

    // Breakdown by Category (Reason: Spam, Harassment, etc.)
    const byCategory = await StudentReport.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('category')), 'count'],
      ],
      group: ['category'],
      raw: true,
    });

    // Breakdown by Type (Post, Comment, Profile)
    const byType = await StudentReport.findAll({
      attributes: [
        'reportType',
        [sequelize.fn('COUNT', sequelize.col('reportType')), 'count'],
      ],
      group: ['reportType'],
      raw: true,
    });

    // Calculate dashboard tile stats
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const resolvedToday = await StudentReport.count({ 
      where: { 
        status: 'Resolved',
        updatedAt: { [Op.gte]: startOfToday }
      } 
    });

    const criticalFlags = await StudentReport.count({
      where: {
        [Op.or]: [
          { priority: 'Critical' },
          { category: 'harassment' },
          { category: 'inappropriate' }
        ],
        status: { [Op.ne]: 'Resolved' }
      }
    });

    const stats = {
      summary: {
        total,
        pending,
        totalPending: pending, // For Dashboard Tile
        criticalFlags, // For Dashboard Tile
        resolvedToday, // For Dashboard Tile
        inProgress,
        resolved,
      },
      byCategory,
      byType,
    };

    return sendResponse(res, 200, true, 'Statistics retrieved successfully', stats);
  } catch (error) {
    logger.error(`Error in getStatistics controller: ${error.message}`);
    next(error);
  }
};

import { Report, StudentReport } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";

/**
 * GET /api/v1/reports/social/stats
 * Dashboard statistics for the Social Report Moderation page.
 * Returns: totalPending, criticalFlags, resolvedToday
 * Mirrors the StudentManagement getStudentStats pattern.
 */
export const getSocialReportStats = async (req, res, next) => {
  try {
    // 1. Total Pending — reports waiting for admin review across BOTH systems
    const pendingSocial = await Report.count({
      where: { status: { [Op.in]: ['Pending', 'In Review'] } },
    });
    const pendingStudent = await StudentReport.count({
      where: { status: { [Op.in]: ['Pending Review', 'In Progress'] } },
    });
    const totalPending = pendingSocial + pendingStudent;

    // 2. Critical Flags — Safety-First Logic
    // Includes High/Critical priority OR specific sensitive categories
    const criticalSocial = await Report.count({
      where: {
        [Op.or]: [
          { priority: { [Op.in]: ['High', 'Critical'] } },
          { type: { [Op.in]: ['Hate Speech', 'Harassment', 'Misinformation'] } }
        ],
        status: { [Op.notIn]: ['Resolved', 'Dismissed'] },
      },
    });

    const criticalStudent = await StudentReport.count({
      where: {
        [Op.or]: [
          { priority: { [Op.in]: ['High', 'Critical'] } },
          { category: { [Op.in]: ['harassment', 'misinformation'] } }
        ],
        status: { [Op.notIn]: ['Resolved', 'Dismissed', 'Withdrawn'] },
      },
    });

    const criticalFlags = criticalSocial + criticalStudent;

    // 3. Resolved Today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const resolvedSocial = await Report.count({
      where: { status: 'Resolved', updatedAt: { [Op.gte]: startOfToday } },
    });
    const resolvedStudent = await StudentReport.count({
      where: { status: 'Resolved', updatedAt: { [Op.gte]: startOfToday } },
    });
    const resolvedToday = resolvedSocial + resolvedStudent;

    return sendResponse(res, 200, true, 'Unified report stats retrieved', {
      totalPending,
      criticalFlags,
      resolvedToday,
    });
  } catch (error) {
    logger.error(`Error in getSocialReportStats controller: ${error.message}`);
    next(error);
  }
};

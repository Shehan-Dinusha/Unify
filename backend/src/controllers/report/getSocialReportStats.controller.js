import { StudentReport } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";

//Returns report statistics for the social report moderation page.
export const getSocialReportStats = async (req, res, next) => {
  try {
    // 1. Total Pending — reports waiting for admin review
    const totalPending = await StudentReport.count({
      where: { status: { [Op.in]: ["Pending Review", "In Progress"] } },
    });

    // 2. Critical Flags — Safety-First Logic
    // High/Critical priority OR sensitive categories, excluding resolved/dismissed/withdrawn
    const criticalFlags = await StudentReport.count({
      where: {
        [Op.or]: [
          { priority: { [Op.in]: ["High", "Critical"] } },
          { category: { [Op.in]: ["harassment", "misinformation"] } },
        ],
        status: { [Op.notIn]: ["Resolved", "Dismissed", "Withdrawn"] },
      },
    });

    // 3. Resolved Today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const resolvedToday = await StudentReport.count({
      where: { status: "Resolved", updatedAt: { [Op.gte]: startOfToday } },
    });

    return sendResponse(res, 200, true, "Report stats retrieved", {
      totalPending,
      criticalFlags,
      resolvedToday,
    });
  } catch (error) {
    logger.error(`Error in getSocialReportStats controller: ${error.message}`);
    next(error);
  }
};

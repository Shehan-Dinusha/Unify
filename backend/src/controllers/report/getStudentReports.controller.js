import { Op } from 'sequelize';
import StudentReport from "../../modules/StudentReport.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import moment from "moment";

/**
 * Retrieves reports for a specific student with filters and pagination.
 * 100% Compatible with StudentSubmittedReports.jsx search and filter requirements.
 */
export const getStudentReports = async (req, res, next) => {
  try {
    const studentId = req.user?.id || 1;

    const { status, category, reportType, search, page = 1, limit = 10 } = req.query;
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

    const formattedReports = rows.map(r => ({
      id: r.reportId,
      reportId: r.reportId,
      title: r.title,
      category: r.category,
      categoryIcon: "🔧", // generic fallback
      dateSubmitted: moment(r.createdAt).format("MMM DD, YYYY"),
      dateSubmittedFull: moment(r.createdAt).format("MMM DD, YYYY • hh:mm A"),
      status: r.status,
      reportType: r.reportType,
      reason: r.category,
      reportedEntity: {
        name: r.reportType === 'user' ? "Reported User" : "Reported Content",
        faculty: "N/A",
        entityId: r.reportedEntityId,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.reportedEntityId}`,
        categoryBadge: r.category
      },
      description: r.additionalDetails || "No additional description provided.",
      statusLabel: r.status
    }));

    return sendResponse(res, 200, true, 'Reports retrieved successfully', {
      reports: formattedReports,
      pagination,
    });
  } catch (error) {
    logger.error(`Error in getStudentReports controller: ${error.message}`);
    next(error);
  }
};

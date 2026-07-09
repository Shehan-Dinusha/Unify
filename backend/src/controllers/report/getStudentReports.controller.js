import { Op } from 'sequelize';
import StudentReport from "../../modules/StudentReport.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import moment from "moment";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";

//Retrieves reports for a specific student with filters and pagination.
export const getStudentReports = async (req, res, next) => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      return sendResponse(res, 401, false, 'Student authentication required');
    }

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

    const categoryIconMap = {
      inappropriate: '⚠️',
      spam: '📩',
      harassment: '🚫',
      misinformation: '📰',
      other: '🔧',
    };
    const categoryDisplayMap = {
      inappropriate: 'Inappropriate Content',
      spam: 'Spam',
      harassment: 'Harassment',
      misinformation: 'Misinformation',
      other: 'Other',
    };

    const formattedReports = await Promise.all(rows.map(async r => {
      const entityName = r.reportType === 'user' ? "Reported User" : "Reported Content";
      return {
        id: r.id, // Integer PK for URL routing
        reportId: r.reportId, // Display string like #RPT-20260421-XXXX
        title: r.title,
        category: categoryDisplayMap[r.category] || r.category,
        categoryIcon: categoryIconMap[r.category] || '🔧',
        dateSubmitted: moment(r.createdAt).format("MMM DD, YYYY"),
        dateSubmittedFull: moment(r.createdAt).format("MMM DD, YYYY • hh:mm A"),
        status: r.status,
        reportType: r.reportType,
        reason: r.category,
        reportedEntity: {
          name: entityName,
          faculty: "N/A",
          entityId: r.reportedEntityId,
          avatar: await resolveAvatarUrl(null, entityName), // No avatar key available in r directly here, but using fallback
          categoryBadge: categoryDisplayMap[r.category] || r.category
        },
        description: r.additionalDetails || "No additional description provided.",
        statusLabel: r.status
      };
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

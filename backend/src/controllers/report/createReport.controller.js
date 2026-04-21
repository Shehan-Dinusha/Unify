import { Op } from 'sequelize';
import StudentReport from "../../modules/StudentReport.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Generates a unique report ID in format #RPT-YYYYMMDD-XXXX
 */
const generateReportId = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `#RPT-${date}-${random}`;
};

/**
 * Handle student submission of a new report.
 * Performs manual validation matching the Verification module pattern.
 */
export const createReport = async (req, res, next) => {
  try {
    const studentId = req.user?.id || 1;
    if (!studentId && !req.user) {
      // Temporary: we allow proceeding if we have the fallback
      logger.info('Using fallback studentId 1 for testing');
    }

    const { title, description, category } = req.body;

    // 1. Manual Validation
    if (!title || title.length < 5 || title.length > 200) {
      return sendResponse(res, 400, false, 'Title is required and must be between 5 and 200 characters.');
    }

    if (!description || description.length < 20 || description.length > 5000) {
      return sendResponse(res, 400, false, 'Description is required and must be between 20 and 5000 characters.');
    }

    const validCategories = ['Facility', 'IT Support', 'Academic', 'Library', 'Other'];
    if (!category || !validCategories.includes(category)) {
      return sendResponse(res, 400, false, 'Valid category is required.');
    }

    // 2. Duplicate Check
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const duplicate = await StudentReport.findOne({
      where: {
        studentId,
        status: { [Op.in]: ['Pending Review', 'In Progress'] },
        createdAt: { [Op.gte]: sevenDaysAgo },
        [Op.or]: [
          { title: { [Op.iLike]: title } },
          { description: { [Op.iLike]: description } },
        ],
      },
    });

    if (duplicate) {
      const diffTime = Math.abs(new Date() - duplicate.createdAt);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sendResponse(
        res,
        409,
        false,
        `Duplicate report found. You already submitted a similar report ${diffDays} day(s) ago.`
      );
    }

    // 3. Create Report
    const reportId = generateReportId();
    const report = await StudentReport.create({
      ...req.body,
      reportId,
      studentId,
      status: 'Pending Review',
      priority: 'Medium',
    });

    logger.info(`Report created: ${reportId} by student ${studentId}`);

    return sendResponse(res, 201, true, 'Report submitted successfully', {
      reportId: report.reportId,
      status: report.status,
    });
  } catch (error) {
    logger.error(`Error in createReport controller: ${error.message}`);
    next(error);
  }
};

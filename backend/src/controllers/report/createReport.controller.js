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
 * 100% Compatible with the Frontend UI scenarios.
 * Performs manual validation matching the Verification module pattern.
 */
export const createReport = async (req, res, next) => {
  try {
    const studentId = req.user?.id || 4; // Default to seeded student ID for testing
    
    const { 
      reportType, 
      category, 
      additionalDetails, 
      evidenceUrl, 
      reportedEntityId 
    } = req.body;

    // 1. Manual Validation
    
    // Step 1: What are you reporting? (Required)
    const validTypes = ['post', 'comment', 'user'];
    if (!reportType || !validTypes.includes(reportType)) {
      return sendResponse(res, 400, false, 'A valid report type (post, comment, user) is required.');
    }

    // Step 2: Why are you reporting? (Required)
    const validCategories = ['inappropriate', 'spam', 'harassment', 'misinformation', 'other'];
    if (!category || !validCategories.includes(category)) {
      return sendResponse(res, 400, false, 'A valid reason for reporting is required.');
    }

    // Step 3: Entity ID (Required to link the report)
    if (!reportedEntityId) {
      return sendResponse(res, 400, false, 'The ID of the reported item/user is required.');
    }

    // Step 3: Additional Comments (Optional, but limited length if provided)
    if (additionalDetails && additionalDetails.length > 5000) {
      return sendResponse(res, 400, false, 'Additional comments cannot exceed 5000 characters.');
    }

    // 2. Duplicate Check (Same student, same entity, same reason, within 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const duplicate = await StudentReport.findOne({
      where: {
        studentId,
        reportedEntityId,
        category,
        reportType,
        status: { [Op.notIn]: ['Withdrawn', 'Dismissed'] },
        createdAt: { [Op.gte]: sevenDaysAgo },
      },
    });

    if (duplicate) {
      return sendResponse(
        res,
        409,
        false,
        `You have already reported this ${reportType} for ${category} recently. Our team is reviewing it.`
      );
    }

    // 3. Auto-generate Title for the Table View
    const formattedType = reportType.charAt(0).toUpperCase() + reportType.slice(1);
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    const title = `Report: ${formattedCategory} in ${formattedType}`;

    // 4. Handle File Uploads (Optional)
    let evidenceFiles = [];
    if (req.files && req.files.length > 0) {
      evidenceFiles = req.files.map(f => `/uploads/reports/${f.filename}`);
    }

    // 5. Create Report
    const reportId = generateReportId();
    const report = await StudentReport.create({
      reportId,
      studentId,
      reportType,
      category,
      title,
      additionalDetails,
      evidenceFiles,
      evidenceUrl,
      reportedEntityId,
      status: 'Pending Review',
      priority: 'Medium',
    });

    logger.info(`Report ${reportId} created by student ${studentId} for ${reportType} ${reportedEntityId}`);

    return sendResponse(res, 201, true, 'Report submitted successfully', {
      id: report.id,
      reportId: report.reportId,
      status: report.status,
    });
  } catch (error) {
    logger.error(`Error in createReport controller: ${error.message}`);
    next(error);
  }
};

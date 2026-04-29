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
 * Refactored to use the Modern S3 Pattern (Memory-based).
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

    // 1. Duplicate Check (Same student, same entity, same reason, within 7 days)
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

    // 2. Auto-generate Title for the Table View
    const formattedType = reportType.charAt(0).toUpperCase() + reportType.slice(1);
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    const title = `Report: ${formattedCategory} in ${formattedType}`;

    // 3. Handle S3 File Uploads (Modern Pattern: Memory-based S3 keys)
    let evidenceFiles = [];
    if (req.files && Array.isArray(req.files)) {
      evidenceFiles = req.files.map(file => file.location); // 'location' contains the S3 key
    }

    // 4. Create Report
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

    logger.info(`Report ${reportId} created by student ${studentId} using modern S3 middleware`);

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

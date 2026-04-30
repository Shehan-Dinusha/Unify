import StudentReport from "../../modules/StudentReport.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Handle student withdrawing their own report.
 * Performs manual validation matching the Verification module pattern.
 */
export const withdrawReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { withdrawalReason } = req.body;
    const studentId = req.user?.id || 4; // Default to seeded student ID for testing

    if (!studentId) {
      return sendResponse(res, 401, false, 'Student authentication required');
    }

    // 1. Manual Validation
    if (withdrawalReason && (withdrawalReason.length < 5 || withdrawalReason.length > 500)) {
      return sendResponse(res, 400, false, 'Withdrawal reason must be between 5 and 500 characters.');
    }

    // 2. Fetch and Withdraw — support both integer id and string reportId
    let whereClause = { studentId };
    if (!isNaN(parseInt(id)) && !id.startsWith('#')) {
      whereClause.id = parseInt(id);
    } else {
      whereClause.reportId = id.toUpperCase();
    }

    const report = await StudentReport.findOne({
      where: whereClause,
    });

    if (!report) {
      return sendResponse(res, 404, false, 'Report not found or unauthorized');
    }

    if (['Withdrawn', 'Resolved'].includes(report.status)) {
      return sendResponse(res, 400, false, `Cannot withdraw a report that is already ${report.status}`);
    }

    report.status = 'Withdrawn';
    report.withdrawalReason = withdrawalReason;
    report.withdrawnAt = new Date();

    await report.save();
    
    logger.info(`Report ${report.reportId} withdrawn by student ${studentId}`);

    return sendResponse(res, 200, true, 'Report withdrawn successfully', {
      id: report.id,
      reportId: report.reportId,
      status: report.status,
      withdrawnAt: report.withdrawnAt,
    });
  } catch (error) {
    logger.error(`Error in withdrawReport controller: ${error.message}`);
    next(error);
  }
};

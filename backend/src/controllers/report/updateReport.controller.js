import StudentReport from "../../modules/StudentReport.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Handle admin updates to a report's status, priority, and notes.
 * Performs manual validation matching the Verification module pattern.
 */
export const updateReport = async (req, res, next) => {
  try {
    // TODO: Add admin authorization check here
    
    const { id } = req.params;
    const { status, adminNotes, priority } = req.body;

    // 1. Manual Validation
    const validStatuses = ['Pending Review', 'In Progress', 'Resolved', 'Withdrawn', 'Dismissed'];
    if (status && !validStatuses.includes(status)) {
      return sendResponse(res, 400, false, 'Invalid status value.');
    }

    const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
    if (priority && !validPriorities.includes(priority)) {
      return sendResponse(res, 400, false, 'Invalid priority value.');
    }

    if (adminNotes && adminNotes.length > 2000) {
      return sendResponse(res, 400, false, 'Admin notes cannot exceed 2000 characters.');
    }

    // 2. Fetch and Update
    const report = await StudentReport.findByPk(id);

    if (!report) {
      return sendResponse(res, 404, false, 'Report not found');
    }

    if (report.status === 'Withdrawn') {
      return sendResponse(res, 400, false, 'Cannot update a withdrawn report');
    }

    if (status) report.status = status;
    if (adminNotes) report.adminNotes = adminNotes;
    if (priority) report.priority = priority;

    if (status === 'Resolved') {
      report.resolvedAt = new Date();
    }

    await report.save();
    
    logger.info(`Report ${id} updated by admin. New status: ${report.status}`);
    
    return sendResponse(res, 200, true, 'Report updated successfully', report);
  } catch (error) {
    logger.error(`Error in updateReport controller: ${error.message}`);
    next(error);
  }
};

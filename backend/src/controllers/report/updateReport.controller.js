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

    // ID is required
    if (!id) {
      return sendResponse(res, 400, false, 'Report ID is required.');
    }

    // At least one field must be provided for update
    const hasUpdateFields = status || adminNotes !== undefined || priority;
    if (!hasUpdateFields) {
      return sendResponse(res, 400, false, 'At least one field (status, adminNotes, priority) must be provided to update.');
    }

    // 1. Manual Validation
    const validStatuses = ['Pending Review', 'In Progress', 'Resolved', 'Withdrawn', 'Dismissed'];
    if (status && !validStatuses.includes(status)) {
      return sendResponse(res, 400, false, 'Invalid status value. Must be one of: ' + validStatuses.join(', '));
    }

    const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
    if (priority && !validPriorities.includes(priority)) {
      return sendResponse(res, 400, false, 'Invalid priority value. Must be one of: ' + validPriorities.join(', '));
    }

    if (adminNotes !== undefined) {
      if (adminNotes && adminNotes.length < 5) {
        return sendResponse(res, 400, false, 'Admin notes must be at least 5 characters if provided.');
      }
      if (adminNotes && adminNotes.length > 2000) {
        return sendResponse(res, 400, false, 'Admin notes cannot exceed 2000 characters.');
      }
    }

    // 2. Fetch and Update
    const report = await StudentReport.findByPk(id);

    if (!report) {
      return sendResponse(res, 404, false, 'Report not found');
    }

    // Check if anything will actually change
    const willChange =
      (status && report.status !== status) ||
      (adminNotes !== undefined && report.adminNotes !== adminNotes) ||
      (priority && report.priority !== priority);

    if (!willChange) {
      return sendResponse(res, 400, false, 'No changes detected. At least one field must have a different value.');
    }

    if (report.status === 'Withdrawn') {
      return sendResponse(res, 400, false, 'Cannot update a withdrawn report');
    }

    // Only update fields that are actually provided
    if (status) {
      // If changing FROM Resolved to another status, clear resolvedAt
      if (report.status === 'Resolved' && status !== 'Resolved') {
        report.resolvedAt = null;
      }
      // If changing TO Resolved, set resolvedAt
      if (status === 'Resolved') {
        report.resolvedAt = new Date();
      }
      report.status = status;
    }

    if (adminNotes !== undefined) {
      report.adminNotes = adminNotes || null;
    }

    if (priority) {
      report.priority = priority;
    }

    await report.save();
    
    logger.info(`Report ${id} updated by admin. New status: ${report.status}`);
    
    return sendResponse(res, 200, true, 'Report updated successfully', report);
  } catch (error) {
    logger.error(`Error in updateReport controller:`, {
      message: error.message,
      stack: error.stack,
      code: error.code,
      timestamp: new Date().toISOString(),
    });
    
    // Handle specific database errors
    if (error.name === 'SequelizeValidationError') {
      return sendResponse(res, 400, false, 'Validation error: ' + error.errors.map(e => e.message).join(', '));
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return sendResponse(res, 409, false, 'This report already exists.');
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return sendResponse(res, 400, false, 'Referenced record not found.');
    }
    if (error.name === 'SequelizeDatabaseError') {
      return sendResponse(res, 500, false, 'Database error occurred.');
    }
    
    next(error);
  }
};

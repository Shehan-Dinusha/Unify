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
    const { status, adminNotes, priority, action, notes, reason } = req.body;

    // 2. Fetch and Update
    let whereClause = {};
    if (!isNaN(parseInt(id)) && !id.startsWith('#')) {
      whereClause.id = parseInt(id);
    } else {
      whereClause.reportId = id.toUpperCase();
    }

    const report = await StudentReport.findOne({ where: whereClause });

    if (!report) {
      return sendResponse(res, 404, false, 'Report not found');
    }

    if (report.status === 'Withdrawn') {
      return sendResponse(res, 400, false, 'Cannot update a withdrawn report');
    }

    if (report.status === 'Resolved' || report.status === 'Dismissed') {
      return sendResponse(res, 400, false, 'Report is already finalized and cannot be modified.');
    }

    // Handle Admin UI Action Payload (action, notes, reason)
    if (action) {
      switch (action) {
        case 'dismiss':
          report.status = 'Dismissed';
          report.adminNotes = (report.adminNotes ? report.adminNotes + "\n" : "") + `Dismiss Reason: ${reason}. Notes: ${notes}`;
          break;
        case 'resolve':
          report.status = 'Resolved';
          report.adminNotes = (report.adminNotes ? report.adminNotes + "\n" : "") + `Resolution: ${notes}`;
          report.resolvedAt = new Date();
          break;
        case 'delete_post':
          // Attempt to delete post if reportedEntityId is a post ID
          if (report.reportType === 'post') {
            const Post = (await import("../../modules/Post.model.js")).default;
            await Post.destroy({ where: { id: report.reportedEntityId } }).catch(err => logger.warn('Failed to delete post: ' + err));
          }
          report.status = 'Resolved';
          report.adminNotes = (report.adminNotes ? report.adminNotes + "\n" : "") + `Action: Deleted Post. Notes: ${notes}`;
          report.resolvedAt = new Date();
          break;
        case 'suspend_user':
          // Attempt to suspend user if reportedEntityId is a user ID
          if (report.reportType === 'user') {
            const User = (await import("../../modules/User.model.js")).default;
            await User.update({ status: 'Suspended' }, { where: { id: report.reportedEntityId } }).catch(err => logger.warn('Failed to suspend user: ' + err));
          }
          report.status = 'Resolved';
          report.adminNotes = (report.adminNotes ? report.adminNotes + "\n" : "") + `Action: Suspended User. Reason: ${reason}. Notes: ${notes}`;
          report.resolvedAt = new Date();
          break;
        case 'add_note':
          report.adminNotes = (report.adminNotes ? report.adminNotes + "\n" : "") + `Admin Note: ${notes}`;
          if (report.status === 'Pending Review') report.status = 'In Progress';
          break;
        default:
          return sendResponse(res, 400, false, 'Invalid action');
      }
    } else {
      // Legacy status/adminNotes update
      if (status) report.status = status;
      if (adminNotes) {
        report.adminNotes = adminNotes;
        if (report.status === 'Pending Review') {
          report.status = 'In Progress';
        }
      }
      if (priority) report.priority = priority;

      if (status === 'Resolved') {
        report.resolvedAt = new Date();
      }
    }

    await report.save();
    
    logger.info(`Report ${id} updated by admin. New status: ${report.status}`);
    
    return sendResponse(res, 200, true, 'Report updated successfully', report);
  } catch (error) {
    logger.error(`Error in updateReport controller: ${error.message}`);
    next(error);
  }
};

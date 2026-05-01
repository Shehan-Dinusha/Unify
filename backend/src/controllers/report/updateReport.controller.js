import StudentReport from "../../modules/StudentReport.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { updateStudentReputation } from "../../services/reputation.service.js";
import UserSuspensionService from "../../services/userSuspension.service.js";

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
      const appendNote = (line) => {
        report.adminNotes = report.adminNotes ? report.adminNotes + '\n' + line : line;
      };

      switch (action) {
        case 'dismiss':
          if (!reason) return sendResponse(res, 400, false, 'Dismiss reason is required');
          report.status = 'Dismissed';
          appendNote(`Dismiss Reason: ${reason}. Notes: ${notes || ''}`);
          if (reason && (reason.toLowerCase().includes('fake') || reason.toLowerCase().includes('spam') || reason.toLowerCase().includes('false'))) {
            await updateStudentReputation(report.studentId, 'FAKE_REPORT_SPAM');
          }
          break;

        case 'resolve':
          report.status = 'Resolved';
          appendNote(`Resolution: ${notes || 'Marked as resolved by admin'}`);
          report.resolvedAt = new Date();
          await updateStudentReputation(report.studentId, 'REPORT_RESOLVED');
          break;

        case 'delete_post':
          // ✅ Delete post content — does NOT finalize the report
          if (report.reportType === 'post') {
            const Post = (await import("../../modules/Post.model.js")).default;
            const post = await Post.findByPk(report.reportedEntityId);
            if (post) {
               await updateStudentReputation(post.authorId, 'VIOLATION_DELETED');
               await post.destroy().catch(err => logger.warn('Failed to delete post: ' + err));
            }
          }
          // Keep status as In Progress — admin can still resolve/dismiss
          if (report.status === 'Pending Review') report.status = 'In Progress';
          appendNote(`Action Taken: Deleted Post. Notes: ${notes || ''}`);
          break;

        case 'suspend_user':
          // ✅ Use UserSuspensionService to ensure records are created in the suspension table
          if (report.reportedEntityId) {
            const adminId = req.user?.id || 1;
            await UserSuspensionService.createSuspension({
              userId: report.reportedEntityId,
              reason: reason || 'Violation of platform guidelines',
              reasonTag: 'Violation of Terms',
              severity: 'High',
              effectiveDate: new Date(),
              adminNotes: `Suspended via Student Report Management for report ID ${id}. ${notes || ''}`
            }, adminId);
          }
          // Keep status as In Progress — admin can still resolve/dismiss
          if (report.status === 'Pending Review') report.status = 'In Progress';
          appendNote(`Action Taken: Suspended User. Reason: ${reason || 'Violation of guidelines'}. Notes: ${notes || ''}`);
          break;

        case 'add_note':
          if (!notes || !notes.trim()) return sendResponse(res, 400, false, 'Note content is required');
          appendNote(`Admin Note: ${notes.trim()}`);
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

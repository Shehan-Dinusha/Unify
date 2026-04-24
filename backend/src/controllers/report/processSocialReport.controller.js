import { Report, Post, User, AdminLog } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Handles all actions from the Admin Moderation Dashboard (ReportDetail.jsx).
 * Actions: dismiss, resolve, delete_post, suspend_user, add_note
 */
export const processSocialReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const internalId = parseInt(id.replace('R-', '')) - 4000;
    const { action, notes, reason } = req.body;

    const report = await Report.findByPk(isNaN(internalId) ? id : internalId, {
      include: [
        { model: Post, as: 'post' },
        { model: User, as: 'offender' },
      ]
    });

    if (!report) {
      return sendResponse(res, 404, false, 'Report not found');
    }

    if (report.status === 'Resolved' || report.status === 'Dismissed') {
      return sendResponse(res, 400, false, 'Report is already finalized and cannot be modified.');
    }

    const adminId = req.user?.id || 1;

    switch (action) {
      case 'dismiss':
        report.status = 'Dismissed';
        if (notes) report.notes = (report.notes ? report.notes + "\n" : "") + `Dismiss Reason: ${reason}. Notes: ${notes}`;
        await report.save();
        await AdminLog.create({ adminId, type: 'report_dismissed', title: 'Report Dismissed', description: `Dismissed report ${report.id} with reason: ${reason}`, referenceId: report.id });
        break;

      case 'resolve':
        report.status = 'Resolved';
        if (notes) report.notes = (report.notes ? report.notes + "\n" : "") + `Resolution: ${notes}`;
        await report.save();
        await AdminLog.create({ adminId, type: 'report_resolved', title: 'Report Resolved', description: `Resolved report ${report.id}. Notes: ${notes}`, referenceId: report.id });
        break;

      case 'delete_post':
        if (report.post) {
          // Soft delete the post or completely remove it
          await report.post.destroy(); 
        }
        report.status = 'Resolved';
        if (notes) report.notes = (report.notes ? report.notes + "\n" : "") + `Action: Deleted Post. Notes: ${notes}`;
        await report.save();
        await AdminLog.create({ adminId, type: 'post_deleted', title: 'Post Deleted', description: `Deleted post via report ${report.id}`, referenceId: report.postId });
        break;

      case 'suspend_user':
        if (report.offender) {
          report.offender.status = 'Suspended';
          await report.offender.save();
        }
        report.status = 'Resolved';
        if (notes) report.notes = (report.notes ? report.notes + "\n" : "") + `Action: Suspended User. Reason: ${reason}. Notes: ${notes}`;
        await report.save();
        await AdminLog.create({ adminId, type: 'user_suspended', title: 'User Suspended', description: `Suspended user via report ${report.id}. Reason: ${reason}`, targetUserId: report.offenderId, referenceId: report.id, severity: 'Critical' });
        break;

      case 'add_note':
        if (notes) report.notes = (report.notes ? report.notes + "\n" : "") + `Admin Note: ${notes}`;
        await report.save();
        break;

      default:
        return sendResponse(res, 400, false, 'Invalid action');
    }

    logger.info(`Social report ${report.id} processed with action: ${action}`);
    
    return sendResponse(res, 200, true, `Report processed successfully: ${action}`, { status: report.status });
  } catch (error) {
    logger.error(`Error in processSocialReport controller: ${error.message}`);
    next(error);
  }
};

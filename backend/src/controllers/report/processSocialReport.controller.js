import { Report, Post, User, AdminLog, StudentReport, Comment, MarketplaceItem, Boarding } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import UserSuspensionService from "../../services/userSuspension.service.js";

//Handles all admin actions from ReportDetail.jsx.
export const processSocialReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, notes, reason, reasonTag, severity } = req.body;
    const adminId = req.user?.id;

    if (!adminId) {
      return sendResponse(res, 401, false, 'Admin authentication required');
    }

    if (!action) {
      return sendResponse(res, 400, false, 'Action is required');
    }

    let report;
    const isStudentReport = id.startsWith('SR-');

    // ── Load the report ───────────────────────────────────────────────
    if (isStudentReport) {
      const internalId = parseInt(id.replace('SR-', ''));
      if (isNaN(internalId)) return sendResponse(res, 400, false, 'Invalid student report ID');
      report = await StudentReport.findByPk(internalId);
    } else {
      const rawId = id.startsWith('R-') ? parseInt(id.replace('R-', '')) - 4000 : parseInt(id);
      if (isNaN(rawId)) return sendResponse(res, 400, false, 'Invalid report ID');
      report = await Report.findByPk(rawId, {
        include: [
          { model: Post, as: 'post' },
          { model: User, as: 'offender' },
        ]
      });
    }

    if (!report) {
      return sendResponse(res, 404, false, 'Report not found');
    }

    // ── Guard: reject all actions on finalized reports ────────────────
    const currentStatus = report.status;
    const finalStatuses = ['Resolved', 'Dismissed'];
    if (finalStatuses.includes(currentStatus)) {
      return sendResponse(res, 400, false, `Report is already ${currentStatus}. No further actions can be taken.`);
    }

    // ── Helper: get/set notes field ────────────────────────────────────
    const getNotes = () => isStudentReport ? report.adminNotes : report.notes;
    const setNotes = (val) => {
      if (isStudentReport) report.adminNotes = val;
      else report.notes = val;
    };
    const appendNote = (line) => {
      const existing = getNotes();
      setNotes(existing ? existing + '\n' + line : line);
    };

    // Helper for numeric ID check
    const isNumericId = (val) => !isNaN(parseInt(val)) && /^\d+$/.test(String(val));

    // ── Process actions ───────────────────────────────────────────────
    switch (action) {

      case 'dismiss':
        if (!reason) return sendResponse(res, 400, false, 'Dismiss reason is required');
        report.status = 'Dismissed';
        appendNote(`Dismiss Reason: ${reason}${notes ? '. Notes: ' + notes : ''}`);
        await report.save();
        break;

      case 'resolve':
        report.status = 'Resolved';
        if (isStudentReport) report.resolvedAt = new Date();
        appendNote(`Resolution: ${notes || 'Marked as resolved by admin'}`);
        await report.save();
        break;

      case 'delete_post': {
        if (isStudentReport) {
          const entityId = parseInt(report.reportedEntityId);
          if (!isNumericId(report.reportedEntityId)) {
            return sendResponse(res, 400, false, 'Cannot delete content with non-numeric ID.');
          }

          if (report.reportType === 'post') {
            // Try Post table first
            let post = await Post.findByPk(entityId);
            if (post) {
              await post.destroy();
            } else {
              // Try MarketplaceItem table next
              const item = await MarketplaceItem.findByPk(entityId);
              if (item) await item.destroy();
            }
          } else if (report.reportType === 'comment') {
            const comment = await Comment.findByPk(entityId);
            if (comment) await comment.destroy();
          }
        } else if (report.post) {
          await report.post.destroy();
        }
        
        const entityLabel = report.reportType === 'comment' ? 'Comment' : 'Content';
        appendNote(`Action Taken: Deleted ${entityLabel}.${notes ? ' Notes: ' + notes : ''}`);
        await report.save();
        break;
      }

      case 'suspend_user': {
        let targetUserId = null;
        
        if (isStudentReport) {
          const entityId = parseInt(report.reportedEntityId);
          if (!isNumericId(report.reportedEntityId)) {
            return sendResponse(res, 400, false, 'Cannot suspend user with non-numeric ID.');
          }

          if (report.reportType === 'user') {
            targetUserId = entityId;
          } else if (report.reportType === 'post') {
            const post = await Post.findByPk(entityId);
            if (post) {
              targetUserId = post.authorId;
            } else {
              const item = await MarketplaceItem.findByPk(entityId);
              if (item) targetUserId = item.sellerId;
            }
          } else if (report.reportType === 'comment') {
            const comment = await Comment.findByPk(entityId);
            if (comment) targetUserId = comment.userId;
          }
        } else if (report.offenderId) {
          targetUserId = report.offenderId;
        }

        if (!targetUserId) {
          return sendResponse(res, 400, false, 'Could not identify target user for suspension.');
        }

        const userToSuspend = await User.findByPk(targetUserId);
        if (!userToSuspend) {
          return sendResponse(res, 404, false, 'Target user not found.');
        }

        await UserSuspensionService.createSuspension({
          userId: targetUserId,
          reason: reason || 'Violation of platform guidelines',
          reasonTag: reasonTag || 'Violation of Terms',
          severity: severity || 'High',
          effectiveDate: new Date(),
          adminNotes: `Suspended via Report Moderation for report ID ${id}. ${notes || ''}`
        }, adminId);

        appendNote(`Action Taken: Suspended User (${userToSuspend.name}). Reason: ${reason || 'Violation of guidelines'}.${notes ? ' Notes: ' + notes : ''}`);
        await report.save();
        break;
      }

      case 'add_note':
        if (!notes || !notes.trim()) return sendResponse(res, 400, false, 'Note content is required');
        appendNote(`Admin Note: ${notes.trim()}`);
        if (isStudentReport && report.status === 'Pending Review') report.status = 'In Progress';
        await report.save();
        break;

      default:
        return sendResponse(res, 400, false, `Invalid action: ${action}`);
    }

    // Log the action
    await AdminLog.create({
      adminId,
      type: `report_${action}`,
      title: `Moderation Action: ${action}`,
      description: `Processed ${action} on report ${id}`,
      referenceId: id
    }).catch(e => logger.warn('AdminLog creation failed: ' + e.message));

    // UI Status Mapping
    const uiStatusMap = {
      'Pending Review': 'Pending',
      'In Progress':    'In Review',
      'Resolved':       'Resolved',
      'Dismissed':      'Dismissed',
    };

    return sendResponse(res, 200, true, `Report processed successfully: ${action}`, {
      status: isStudentReport ? (uiStatusMap[report.status] || report.status) : report.status,
      dbStatus: report.status,
      action
    });
  } catch (error) {
    logger.error(`Error in processSocialReport controller: ${error.message}`);
    next(error);
  }
};


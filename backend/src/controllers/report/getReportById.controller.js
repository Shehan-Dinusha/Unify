import { Op } from 'sequelize';
import { StudentReport, User, Post, Comment, MarketplaceItem, Boarding } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import moment from "moment";

const generateTimeline = (report) => {
  const s = report.status;
  const isFinalized = s === 'Resolved' || s === 'Dismissed' || s === 'Withdrawn';

  const timeline = [
    {
      label: "Report Submitted",
      date: moment(report.createdAt).format("MMM DD, YYYY • hh:mm A"),
      status: "completed",
    },
    {
      label: "Received by Admin",
      date: s === 'Pending Review'
        ? "Pending"
        : moment(report.updatedAt).subtract(2, 'hours').format("MMM DD, YYYY • hh:mm A"),
      status: s === 'Pending Review' ? "pending" : "completed",
    },
    {
      label: "Under Investigation",
      date: s === 'In Review' || s === 'In Progress'
        ? "In Progress"
        : isFinalized
        ? moment(report.updatedAt).subtract(1, 'hours').format("MMM DD, YYYY • hh:mm A")
        : "Pending",
      description:
        s === 'In Review' || s === 'In Progress'
          ? "Disciplinary committee is reviewing evidence."
          : null,
      status:
        s === 'In Review' || s === 'In Progress'
          ? "active"
          : isFinalized
          ? "completed"
          : "pending",
    },
    {
      label: "Resolution",
      date: isFinalized
        ? moment(report.updatedAt).format("MMM DD, YYYY • hh:mm A")
        : "Pending",
      description:
        s === 'Resolved'
          ? "Action has been taken."
          : s === 'Dismissed'
          ? "Report was dismissed after review."
          : s === 'Withdrawn'
          ? "Report was withdrawn by student."
          : null,
      status: isFinalized ? "completed" : "pending",
    },
  ];
  return timeline;
};

const mapEvidence = (filesData, externalUrl) => {
  const evidence = [];
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  let files = [];

  if (filesData) {
    if (Array.isArray(filesData)) {
      files = filesData;
    } else if (typeof filesData === 'string') {
      try {
        files = JSON.parse(filesData);
        if (!Array.isArray(files)) files = [files];
      } catch (e) {
        files = filesData.includes(',') ? filesData.split(',').map(f => f.trim()) : [filesData];
      }
    }
  }

  if (Array.isArray(files)) {
    files.filter(f => f && typeof f === 'string').forEach(file => {
      const ext = file.split('.').pop().toLowerCase();
      const type = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) ? 'image' : 'pdf';
      const name = file.split('/').pop() || 'Evidence';
      evidence.push({
        name,
        type,
        url: file.startsWith('http') ? file : `${baseUrl}${file}`
      });
    });
  }

  if (externalUrl) {
    evidence.push({
      name: 'External Link',
      type: 'link',
      url: externalUrl
    });
  }

  return evidence;
};

/**
 * GET /api/v1/reports/:id
 * Retrieves a single student report for the STUDENT's own view.
 */
export const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studentId = req.user?.id || 4; 

    let report = null;

    if (!isNaN(parseInt(id))) {
      report = await StudentReport.findOne({ where: { id: parseInt(id), studentId } });
    }

    if (!report) {
      report = await StudentReport.findOne({
        where: {
          [Op.or]: [
            { reportId: id },
            { reportId: id.startsWith('#') ? id : `#${id}` }
          ],
          studentId
        }
      });
    }

    if (!report) {
      return sendResponse(res, 404, false, 'Report not found or unauthorized');
    }

    // --- Fetch entity details (including deleted items) ---
    let entityName = report.reportType === 'user' ? "Reported User" : "Reported Content";
    let entityFaculty = "N/A";
    let entityAvatar = null;
    let entityDescription = "No additional details found.";

    const entityId = parseInt(report.reportedEntityId);
    const isNumericId = !isNaN(entityId) && /^\d+$/.test(String(report.reportedEntityId));

    if (isNumericId) {
      if (report.reportType === 'user') {
        const user = await User.findByPk(entityId, { paranoid: false });
        if (user) {
          entityName = user.name + (user.deletedAt ? ' [DELETED]' : '');
          entityAvatar = user.avatar;
          entityFaculty = user.role || 'Member';
        }
      } else if (report.reportType === 'post') {
        let post = await Post.findByPk(entityId, { include: [{ model: User, as: 'author' }], paranoid: false });
        if (post) {
          entityName = (post.author?.name || 'Post Author') + (post.deletedAt ? ' [DELETED]' : '');
          entityDescription = post.description || post.title || 'Reported Post Content';
          entityAvatar = post.author?.avatar;
          entityFaculty = 'Post Content';
        } else {
          const item = await MarketplaceItem.findByPk(entityId, { include: [{ model: User, as: 'seller' }], paranoid: false });
          if (item) {
            entityName = (item.seller?.name || 'Business Owner') + (item.deletedAt ? ' [DELETED]' : '');
            entityDescription = `${item.title}: ${item.description}`;
            entityAvatar = item.seller?.avatar;
            entityFaculty = 'Business Content';
          }
        }
      } else if (report.reportType === 'comment') {
        const comment = await Comment.findByPk(entityId, { include: [{ model: User, as: 'user' }], paranoid: false });
        if (comment) {
          entityName = (comment.user?.name || 'Comment Author') + (comment.deletedAt ? ' [DELETED]' : '');
          entityDescription = comment.content;
          entityAvatar = comment.user?.avatar;
          entityFaculty = 'Comment Content';
        }
      }
    }

    const categoryIconMap = { inappropriate: '⚠️', spam: '📩', harassment: '🚫', misinformation: '📰', other: '🔧' };
    const categoryDisplayMap = { inappropriate: 'Inappropriate Content', spam: 'Spam', harassment: 'Harassment', misinformation: 'Misinformation', other: 'Other' };

    const buildActivityLog = (r) => {
      const log = [{ time: moment(r.createdAt).fromNow(), title: 'Report Submitted', description: 'Your report has been successfully submitted and is awaiting review.' }];
      if (r.adminNotes) {
        const lines = r.adminNotes.split('\n').filter(l => l.trim());
        lines.forEach((line, idx) => {
          let title = 'Status Update';
          let desc = line.trim();
          if (line.includes('Dismiss Reason:')) { title = 'Report Dismissed'; desc = line.replace('Dismiss Reason:', '').trim(); }
          else if (line.includes('Resolution:')) { title = 'Report Resolved'; desc = line.replace('Resolution:', '').trim(); }
          else if (line.includes('Action Taken:')) { title = 'Moderation Action'; desc = line.replace(/Action(?: Taken)?:/, '').trim(); }
          else if (line.includes('Admin viewed report')) { title = 'Investigation Started'; desc = 'An administrator has opened your report and the investigation has begun.'; }
          log.push({ time: moment(r.updatedAt).subtract(lines.length - idx - 1, 'minutes').format('MMM DD [at] h:mm A'), title, description: desc });
        });
      }
      return log;
    };

    const buildAdminNote = (r) => {
      if (!r.adminNotes) return null;
      const lines = r.adminNotes.split('\n').filter(l => l.trim());
      const adminLines = lines.filter(l => l.includes('Admin Note:') || l.includes('Resolution:') || l.includes('Dismiss Reason:'));
      if (adminLines.length === 0) return null;
      const lastNote = adminLines[adminLines.length - 1];
      let msg = lastNote.replace('Admin Note:', '').replace('Resolution:', '').replace('Dismiss Reason:', '').trim();
      return { author: "Admin", avatar: "A", date: moment(r.updatedAt).format("MMM DD, YYYY [at] h:mm A"), message: msg || "Your report has been processed." };
    };

    const formattedData = {
      id: report.id,
      internalId: report.id,
      reportId: report.reportId,
      title: report.title,
      category: categoryDisplayMap[report.category] || report.category,
      categoryIcon: categoryIconMap[report.category] || '🔧',
      dateSubmitted: moment(report.createdAt).format("MMM DD, YYYY"),
      dateSubmittedFull: moment(report.createdAt).format("MMM DD, YYYY • hh:mm A"),
      status: report.status,
      reportType: report.reportType,
      reason: categoryDisplayMap[report.category] || report.category,
      reportedEntity: {
        name: entityName,
        faculty: entityFaculty,
        entityId: report.reportedEntityId,
        avatar: entityAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${report.reportedEntityId}`,
        categoryBadge: categoryDisplayMap[report.category] || report.category
      },
      description: entityDescription !== "No additional details found." ? entityDescription : (report.additionalDetails || "No additional description provided."),
      evidence: mapEvidence(report.evidenceFiles, report.evidenceUrl),
      timeline: generateTimeline(report),
      activityLog: buildActivityLog(report),
      adminNote: buildAdminNote(report),
      statusLabel: report.status
    };

    return sendResponse(res, 200, true, 'Report details retrieved', formattedData);
  } catch (error) {
    logger.error(`Error in getReportById controller: ${error.message}`);
    next(error);
  }
};

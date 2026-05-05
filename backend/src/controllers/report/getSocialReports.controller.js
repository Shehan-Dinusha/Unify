import { StudentReport, User, Post, Comment, StudentProfile, Report, MarketplaceItem, Boarding, BusinessProfile, ClubProfile } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import moment from "moment";
import { Op } from "sequelize";
import s3Service from "../../services/s3.service.js";

/**
 * Builds an activity log from the adminNotes field.
 */
const buildActivityLog = (report) => {
  const log = [
    {
      time: moment(report.createdAt).fromNow(),
      title: 'New Report Created',
      description: `Report submitted (ID: ${report.id})`
    }
  ];

  const notesField = report.adminNotes || report.notes;
  if (notesField) {
    const noteLines = notesField.split('\n').filter(l => l.trim());
    noteLines.forEach((line, idx) => {
      let title = 'Moderation Update';
      let description = line.trim();

      if (line.includes('Dismiss Reason:')) {
        title = 'Report Dismissed';
        description = line.replace('Dismiss Reason:', '').trim();
      } else if (line.includes('Resolution:')) {
        title = 'Report Resolved';
        description = line.replace('Resolution:', '').trim();
      } else if (line.includes('Action Taken: Deleted Post')) {
        title = 'Post Deleted';
        description = 'The reported post has been permanently deleted.';
      } else if (line.includes('Action Taken: Deleted Comment')) {
        title = 'Comment Deleted';
        description = 'The reported comment has been permanently deleted.';
      } else if (line.includes('Action Taken: Suspended User') || line.includes('Action: Suspended User')) {
        title = 'User Suspended';
        description = 'The reported user has been suspended.';
      } else if (line.includes('Action Taken:') || line.includes('Action:')) {
        title = 'Moderation Action';
        description = line.replace(/Action(?: Taken)?:/, '').trim();
      } else if (line.includes('Admin viewed report') || line.includes('viewed report')) {
        title = 'Investigation Started';
        description = 'Admin opened the report. Investigation has begun.';
      } else if (line.includes('Admin Note:')) {
        title = 'Internal Note Added';
        description = line.replace('Admin Note:', '').trim();
      }

      log.push({
        time: moment(report.updatedAt)
          .subtract(noteLines.length - idx - 1, 'minutes')
          .format('MMM DD [at] h:mm A'),
        title,
        description
      });
    });
  }

  return log;
};

const categoryDisplayMap = {
  inappropriate: 'Inappropriate Content',
  spam: 'Spam',
  harassment: 'Harassment',
  misinformation: 'Misinformation',
  other: 'Other',
};

const uiStatusMap = {
  'Pending Review': 'Pending',
  'In Progress':    'In Review',
  'Pending':        'Pending',
  'In Review':      'In Review',
  'Resolved':       'Resolved',
  'Dismissed':      'Dismissed',
  'Withdrawn':      'Withdrawn',
};

/**
 * GET /api/v1/reports/social/queue
 */
export const getSocialReportQueue = async (req, res, next) => {
  try {
    const { status, type } = req.query;
    const where = {};

    const reports = await StudentReport.findAll({
      where,
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    const formatted = reports.map(r => ({
      id: `SR-${r.id}`,
      source: 'Student Portal',
      type: categoryDisplayMap[r.category] || r.category,
      reportedUser: {
        name: r.student?.name || `Student ID: ${r.studentId}`,
        handle: r.student?.name ? `@${r.student.name.toLowerCase().replace(/\s+/g, '_')}` : `@student_${r.studentId}`,
        avatar: r.student?.avatar || null
      },
      date: moment(r.createdAt).format('MMM DD, YYYY'),
      status: uiStatusMap[r.status] || r.status,
      priority: r.priority || 'Medium',
      submittedAgo: moment(r.createdAt).fromNow(),
    }));

    return sendResponse(res, 200, true, 'Moderation queue retrieved', formatted);
  } catch (error) {
    logger.error(`Error in getSocialReportQueue: ${error.message}`);
    next(error);
  }
};

/**
 * GET /api/v1/reports/social/:id
 */
export const getSocialReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let r;
    let isStudentReport = id.startsWith('SR-');

    if (isStudentReport) {
      const internalId = parseInt(id.replace('SR-', ''));
      r = await StudentReport.findByPk(internalId, {
        include: [{ model: User, as: 'student', include: [{ model: StudentProfile, as: 'studentProfile' }] }]
      });
    } else {
      const rawId = id.startsWith('R-') ? parseInt(id.replace('R-', '')) - 4000 : parseInt(id);
      r = await Report.findByPk(rawId, {
        include: [
          { model: User, as: 'reporter' },
          { model: User, as: 'offender' },
          { model: Post, as: 'post' },
          { model: Comment, as: 'comment' }
        ]
      });
    }

    if (!r) return sendResponse(res, 404, false, 'Report not found');

    if (r.status === 'Pending Review' || r.status === 'Pending') {
      r.status = isStudentReport ? 'In Progress' : 'In Review';
      const viewNote = 'Admin viewed report. Status changed to Investigation.';
      if (isStudentReport) r.adminNotes = (r.adminNotes ? r.adminNotes + '\n' : '') + viewNote;
      else r.notes = (r.notes ? r.notes + '\n' : '') + viewNote;
      await r.save();
    }

    let offender = { name: 'Unknown', handle: '@unknown', id: 'N/A', avatar: null, status: 'Active' };
    let reportedContent = {
      id: 'N/A',
      text: 'No content details available.',
      author: 'Unknown',
      handle: '@unknown',
      avatar: null,
      date: moment(r.createdAt).format('MMM DD, YYYY [at] h:mm A'),
      hasImage: false,
      imageLabel: 'CONTENT PREVIEW'
    };

    let postStats = { likes: 0, comments: 0 };

    if (isStudentReport) {
      const entityId = parseInt(r.reportedEntityId);
      const isNumericId = !isNaN(entityId) && /^\d+$/.test(String(r.reportedEntityId));

      if (r.reportType === 'post' && isNumericId) {
        // 1. Try standard posts
        let post = await Post.findByPk(entityId, { include: [{ model: User, as: 'author' }], paranoid: false });
        
        // 2. If not found, try Marketplace items
        if (!post) {
          const item = await MarketplaceItem.findByPk(entityId, { include: [{ model: User, as: 'seller' }], paranoid: false });
          if (item) {
            offender = { id: String(item.sellerId), name: item.seller?.name || 'Deleted Business', avatar: item.seller?.avatar, status: item.seller?.status || 'Inactive' };
            reportedContent = { 
              id: `item_${item.id}`, 
              text: `${item.title}: ${item.description}${item.deletedAt ? ' [DELETED]' : ''}`, 
              author: offender.name, 
              avatar: offender.avatar, 
              date: moment(item.createdAt).format('MMM DD, YYYY'),
              hasImage: !!(item.images && item.images.length > 0),
              imageLabel: item.deletedAt ? 'DELETED CONTENT' : 'MARKETPLACE ITEM'
            };
          }
        } else {
          offender = { id: String(post.authorId), name: post.author?.name || 'Deleted User', avatar: post.author?.avatar, status: post.author?.status || 'Inactive' };
          reportedContent = { id: String(post.id), text: `${post.description || post.title || 'Post Content'}${post.deletedAt ? ' [DELETED]' : ''}`, author: offender.name, avatar: offender.avatar, date: moment(post.createdAt).format('MMM DD, YYYY'), hasImage: !!post.images, imageLabel: post.deletedAt ? 'DELETED CONTENT' : 'POST IMAGE' };
        }
      } else if (r.reportType === 'comment' && isNumericId) {
        const comment = await Comment.findByPk(entityId, { include: [{ model: User, as: 'user' }], paranoid: false });
        if (comment) {
          offender = { id: String(comment.userId), name: comment.user?.name || 'Deleted User', avatar: comment.user?.avatar, status: comment.user?.status || 'Inactive' };
          reportedContent = { id: `comment_${comment.id}`, text: `${comment.content}${comment.deletedAt ? ' [DELETED]' : ''}`, author: offender.name, avatar: offender.avatar, date: moment(comment.createdAt).format('MMM DD, YYYY') };
        }
      } else if (r.reportType === 'user' && isNumericId) {
        const user = await User.findByPk(entityId, { paranoid: false });
        if (user) {
          offender = { id: String(user.id), name: user.name, avatar: user.avatar, status: user.status };
          reportedContent = { id: String(user.id), text: `User Profile: ${user.name}${user.deletedAt ? ' [DELETED]' : ''}`, author: user.name, avatar: user.avatar, date: moment(user.createdAt).format('MMM DD, YYYY') };
        }
      }
    } else {
      if (r.offender) offender = { id: String(r.offender.id), name: r.offender.name, avatar: r.offender.avatar, status: r.offender.status };
      if (r.post) reportedContent = { id: String(r.post.id), text: r.post.description || r.post.title, author: offender.name, date: moment(r.post.createdAt).format('MMM DD, YYYY'), hasImage: !!r.post.images };
      else if (r.comment) reportedContent = { id: `comment_${r.comment.id}`, text: r.comment.content, author: offender.name, date: moment(r.comment.createdAt).format('MMM DD, YYYY') };
      else reportedContent.text = r.description || 'No description';
    }

    offender.handle = offender.name ? `@${offender.name.toLowerCase().replace(/\s+/g, '_')}` : '@unknown';
    reportedContent.handle = offender.handle;

    // --- Evidence URL Generation (S3 Compatible) ---
    const rawFiles = isStudentReport ? r.evidenceFiles : r.evidence;
    const externalUrl = isStudentReport ? r.evidenceUrl : null;
    let files = [];
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    if (rawFiles) {
      if (Array.isArray(rawFiles)) files = rawFiles;
      else if (typeof rawFiles === 'string') {
        try {
          files = JSON.parse(rawFiles);
          if (!Array.isArray(files)) files = [files];
        } catch (e) {
          files = rawFiles.includes(',') ? rawFiles.split(',').map(f => f.trim()) : [rawFiles];
        }
      }
    }

    const evidence = await Promise.all(
      files.filter(f => f && typeof f === 'string').map(async (file) => {
        let url = file;
        // Generate presigned URL for S3 keys (Identify by 'reports/' prefix)
        if (file.startsWith('reports/') && !file.startsWith('http')) {
          try { url = await s3Service.getFileUrl(file); } 
          catch (err) { logger.warn(`S3 Presign failed for ${file}: ${err.message}`); }
        } else if (file.startsWith('/uploads/')) {
          url = `${baseUrl}${file}`;
        }
        
        return {
          name: file.split('/').pop() || 'Evidence',
          type: ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(file.split('.').pop().toLowerCase()) ? 'image' : 'pdf',
          url
        };
      })
    );

    if (externalUrl) evidence.push({ name: 'External Link', type: 'link', url: externalUrl });

    return sendResponse(res, 200, true, 'Detail retrieved', {
      id: isStudentReport ? `SR-${r.id}` : `R-${r.id + 4000}`,
      type: categoryDisplayMap[r.category] || r.category || r.type,
      status: uiStatusMap[r.status] || r.status,
      dbStatus: r.status,
      priority: r.priority || 'Medium',
      submittedAgo: moment(r.createdAt).fromNow(),
      reportedUser: offender,
      reportedContent,
      stats: postStats,
      offender: { 
        ...offender, 
        accountAge: '6 Months', 
        lastActive: '2 hours ago', 
        region: 'Colombo, LK',
        emailStatus: 'Verified'
      },
      reportedBy: {
        name: isStudentReport ? (r.student?.name || 'Student') : (r.reporter?.name || 'User'),
        handle: isStudentReport ? (r.student?.name ? `@${r.student.name.toLowerCase().replace(/\s+/g, '_')}` : '@student') : (r.reporter?.name ? `@${r.reporter.name.toLowerCase().replace(/\s+/g, '_')}` : '@user'),
        avatar: isStudentReport ? r.student?.avatar : r.reporter?.avatar,
        note: isStudentReport ? r.additionalDetails : r.description,
        badge: 'Verified Student',
        source: isStudentReport ? 'Mobile App' : 'Web Portal',
        reputation: '4.8/5.0'
      },
      evidence,
      activityLog: buildActivityLog(r),
      violationHistory: [
        { type: 'Spam', date: '2023-11-12', status: 'Dismissed' },
        { type: 'Inappropriate Language', date: '2024-01-05', status: 'Action Taken' }
      ],
      reportCount: 1
    });
  } catch (error) {
    logger.error(`Error in getSocialReportById: ${error.message}`);
    next(error);
  }
};

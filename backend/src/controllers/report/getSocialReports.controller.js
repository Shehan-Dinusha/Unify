import { Report, User, Post, Comment } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import moment from "moment";
import { Op } from "sequelize";

/**
 * Retrieves social reports for the Admin Moderation Queue.
 * Maps data exactly to the frontend `mockReports` structure.
 */
export const getSocialReportQueue = async (req, res, next) => {
  try {
    const { status, type } = req.query;
    
    let whereClause = {};
    if (status && status !== 'all' && status !== '') {
      whereClause.status = { [Op.iLike]: status };
    }
    if (type && type !== 'all' && type !== '') {
      whereClause.type = { [Op.iLike]: type };
    }

    // In a real production app, we would query the database with includes.
    // For 100% frontend UI compatibility without fully populated tables,
    // we'll fetch existing reports and mock the missing relationships precisely.
    const rawReports = await Report.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'name', 'handle'] },
        { model: User, as: 'offender', attributes: ['id', 'name', 'handle'] },
        { model: Post, as: 'post', attributes: ['id', 'content', 'createdAt'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    const formattedReports = rawReports.map(r => {
      const isPost = !!r.postId;
      
      // Determine type colors
      let typeColor = 'text-text-secondary';
      if (r.type === 'Hate Speech' || r.type === 'Harassment') typeColor = 'text-state-error';
      else if (r.type === 'Nudity') typeColor = 'text-primary-accent';
      else if (r.type === 'Spam') typeColor = 'text-state-warning';

      return {
        id: `R-${r.id + 4000}`, // Format like 'R-4085'
        type: r.type || 'Inappropriate',
        typeColor,
        reportedUser: {
          name: r.offender?.name || 'Unknown User',
          handle: r.offender?.handle || '@unknown',
          avatar: r.offender?.name ? r.offender.name.substring(0,2).toUpperCase() : 'UU'
        },
        date: moment(r.createdAt).format('MMM DD, YYYY'),
        status: r.status,
        priority: r.priority || 'Medium',
        submittedAgo: moment(r.createdAt).fromNow(),
        reportedContent: {
          id: isPost ? `post_${r.postId}` : `comment_${r.commentId || 999}`,
          author: r.offender?.name || 'Unknown User',
          handle: r.offender?.handle || '@unknown',
          date: r.post ? moment(r.post.createdAt).format('MMM DD, YYYY [at] h:mm A') : moment(r.createdAt).subtract(1, 'days').format('MMM DD, YYYY [at] h:mm A'),
          text: r.post?.content || r.description || "Reported content text unavailable.",
          hasImage: r.evidence ? true : false,
          imageLabel: 'Sensitive Content'
        },
        offender: {
          name: r.offender?.name || 'Unknown User',
          handle: r.offender?.handle || '@unknown',
          id: r.offenderId || '8839201',
          avatar: null,
          accountAge: '1 Year',
          lastActive: '10 mins ago',
          emailStatus: 'Verified',
          region: 'Local'
        },
        violationHistory: [], // Mocked for now
        reportedBy: {
          name: r.reporter?.name || 'Concerned User',
          handle: r.reporter?.handle || '@user',
          badge: 'Member',
          reputation: 'Medium',
          source: 'Web',
          note: r.notes || "No additional notes provided."
        },
        reportCount: 1,
        stats: { likes: 10, comments: 2 },
        activityLog: [
          { time: moment(r.createdAt).fromNow(), title: 'New Report Created', description: `Report created by ${r.reporter?.handle || '@user'}` }
        ]
      };
    });

    return sendResponse(res, 200, true, 'Social reports retrieved successfully', formattedReports);
  } catch (error) {
    logger.error(`Error in getSocialReportQueue controller: ${error.message}`);
    next(error);
  }
};

/**
 * Retrieves a single social report detail by ID.
 */
export const getSocialReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const internalId = parseInt(id.replace('R-', '')) - 4000;
    
    // We can just call getSocialReportQueue with id filter, but for brevity, we do the same mapping:
    const r = await Report.findOne({
      where: { id: isNaN(internalId) ? id : internalId },
      include: [
        { model: User, as: 'reporter' },
        { model: User, as: 'offender' },
        { model: Post, as: 'post' },
      ]
    });

    if (!r) return sendResponse(res, 404, false, 'Report not found');

    // Fetch Violation History for this offender
    let pastViolations = [];
    if (r.offenderId) {
      pastViolations = await Report.findAll({
        where: { 
          offenderId: r.offenderId,
          id: { [Op.ne]: r.id } // Exclude current report
        },
        order: [['createdAt', 'DESC']],
        limit: 5
      });
    }

    const typeColor = (r.type === 'Hate Speech' || r.type === 'Harassment') ? 'text-state-error' : (r.type === 'Spam' ? 'text-state-warning' : 'text-primary-accent');

    const formattedReport = {
        id: `R-${r.id + 4000}`,
        type: r.type || 'Inappropriate',
        typeColor,
        reportedUser: {
          name: r.offender?.name || 'Unknown User',
          handle: r.offender?.handle || '@unknown',
          avatar: r.offender?.name ? r.offender.name.substring(0,2).toUpperCase() : 'UU'
        },
        date: moment(r.createdAt).format('MMM DD, YYYY'),
        status: r.status,
        priority: r.priority || 'Medium',
        submittedAgo: moment(r.createdAt).fromNow(),
        reportedContent: {
          id: `post_${r.postId || 999}`,
          author: r.offender?.name || 'Unknown User',
          handle: r.offender?.handle || '@unknown',
          date: r.post ? moment(r.post.createdAt).format('MMM DD, YYYY [at] h:mm A') : moment(r.createdAt).format('MMM DD, YYYY [at] h:mm A'),
          text: r.post?.content || r.description || "Reported content text unavailable.",
          hasImage: r.evidence ? true : false,
          imageLabel: 'Sensitive Content'
        },
        offender: {
          name: r.offender?.name || 'Unknown User',
          handle: r.offender?.handle || '@unknown',
          id: r.offenderId || '8839201',
          avatar: null,
          accountAge: '1 Year',
          lastActive: '10 mins ago',
          emailStatus: 'Verified',
          region: 'Local'
        },
        violationHistory: pastViolations.map(v => ({
          type: v.type,
          date: moment(v.createdAt).format('MMM DD, YYYY'),
          status: v.status === 'Resolved' ? 'Action Taken' : (v.status === 'Dismissed' ? 'Dismissed' : 'Warning Sent')
        })),
        reportedBy: {
          name: r.reporter?.name || 'Concerned User',
          handle: r.reporter?.handle || '@user',
          badge: 'Member',
          reputation: 'Medium',
          source: 'Web',
          note: r.notes || "No additional notes provided."
        },
        reportCount: pastViolations.length + 1,
        stats: { likes: 10, comments: 2 },
        activityLog: [
          { time: moment(r.createdAt).fromNow(), title: 'New Report Created', description: `Report created by ${r.reporter?.handle || '@user'}` }
        ]
    };

    return sendResponse(res, 200, true, 'Social report retrieved successfully', formattedReport);
  } catch (error) {
    logger.error(`Error in getSocialReportById controller: ${error.message}`);
    next(error);
  }
};

import { Op } from 'sequelize';
import { 
  User, 
  StudentProfile, 
  Faculty, 
  UserActivityLog, 
  StudentReport, 
  Post, 
  Comment, 
  AdminLog 
} from '../../modules/index.js';
import { sendResponse } from '../../utils/response.js';
import logger from '../../utils/logger.js';
import moment from 'moment';

/**
 * GET /api/v1/admin/students
 * Retrieves the student directory with filtering and search.
 */
export const getStudentDirectory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, facultyId, status } = req.query;
    const offset = (page - 1) * limit;

    let userWhere = { role: 'Student' };
    let profileWhere = {};

    if (search) {
      userWhere[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
      // Profile search could be added for registrationNumber if needed
    }

    if (status && status !== 'all') {
      userWhere.status = status;
    }

    if (facultyId) {
      profileWhere.facultyId = facultyId;
    }

    const { count, rows: students } = await User.findAndCountAll({
      where: userWhere,
      include: [{
        model: StudentProfile,
        as: 'studentProfile',
        where: profileWhere,
        include: [{ model: Faculty, as: 'faculty', attributes: ['name'] }]
      }],
      attributes: ['id', 'name', 'email', 'avatar', 'status', 'lastActive'],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['lastActive', 'DESC']]
    });

    const formattedStudents = students.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      avatar: s.avatar || s.name.substring(0, 2).toUpperCase(),
      faculty: s.studentProfile?.faculty?.name || 'Unknown',
      status: s.status,
      lastActive: s.lastActive ? moment(s.lastActive).fromNow() : 'Never'
    }));

    return sendResponse(res, 200, true, 'Student directory retrieved', {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      students: formattedStudents
    });
  } catch (error) {
    logger.error(`Error in getStudentDirectory: ${error.message}`);
    next(error);
  }
};

/**
 * GET /api/v1/admin/students/stats
 * Dashboard statistics for Student Management.
 */
export const getStudentStats = async (req, res, next) => {
  try {
    const totalStudents = await User.count({ where: { role: 'Student' } });
    const verifiedIdentities = await User.count({ where: { role: 'Student', status: 'Active' } }); // Mock logic for "Verified"
    const flaggedSessions = await StudentReport.count({ where: { status: { [Op.ne]: 'Resolved' } } });

    // Activity Rate calculation (active in last 30 days / total)
    const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
    const activeRecently = await User.count({ 
      where: { 
        role: 'Student', 
        lastActive: { [Op.gte]: thirtyDaysAgo } 
      } 
    });
    
    const activityRate = totalStudents > 0 ? Math.round((activeRecently / totalStudents) * 100) : 0;

    return sendResponse(res, 200, true, 'Student stats retrieved', {
      activityRate: `${activityRate}%`,
      verifiedIdentities: verifiedIdentities > 1000 ? `${(verifiedIdentities / 1000).toFixed(1)}k` : verifiedIdentities,
      flaggedSessions
    });
  } catch (error) {
    logger.error(`Error in getStudentStats: ${error.message}`);
    next(error);
  }
};

/**
 * GET /api/v1/admin/students/:id
 * Detailed student profile for Admin view.
 */
export const getStudentProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { id, role: 'Student' },
      include: [{
        model: StudentProfile,
        as: 'studentProfile',
        include: [{ model: Faculty, as: 'faculty' }]
      }]
    });

    if (!user) {
      return sendResponse(res, 404, false, 'Student not found');
    }

    // Aggregates
    const [totalPosts, totalComments, reputation, reportsCount] = await Promise.all([
      Post.count({ where: { authorId: id } }),
      Comment.count({ where: { userId: id } }),
      Promise.resolve(4890), // Mock reputation for now as requested by "exactly same spitting image"
      StudentReport.count({ where: { studentId: id, status: 'Pending Review' } })
    ]);

    // Activity Logs
    const logs = await UserActivityLog.findAll({
      where: { userId: id },
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    const formattedProfile = {
      header: {
        id: `#${String(user.id).padStart(6, '0')}`,
        name: user.name,
        email: user.email,
        handle: `@${user.name.toLowerCase().replace(/ /g, '')}`,
        status: user.status,
        isPremium: user.studentProfile?.tier === 'Premium',
        joinedDate: moment(user.createdAt).format('MMM DD, YYYY')
      },
      stats: {
        totalPosts,
        totalComments,
        reputation,
        reportsCount: reportsCount > 0 ? `${reportsCount} Needs Review` : '0'
      },
      activityLog: logs.map(l => ({
        type: l.type || 'Action',
        actionDetail: l.detail || l.title,
        ip: l.ip || '0.0.0.0',
        device: l.device || 'Unknown Device',
        date: moment(l.createdAt).fromNow(),
        icon: l.icon || '📝',
        iconColor: l.iconColor || 'text-primary-blue'
      })),
      internalNotes: user.studentProfile?.adminNotes || []
    };

    return sendResponse(res, 200, true, 'Student profile retrieved', formattedProfile);
  } catch (error) {
    logger.error(`Error in getStudentProfile: ${error.message}`);
    next(error);
  }
};

/**
 * PUT /api/v1/admin/students/:id/status
 * Updates student status (Suspend/Active).
 */
export const updateStudentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason, suspensionCategory, sendEmail } = req.body;
    const adminId = req.user?.id || 1;

    const user = await User.findByPk(id);
    if (!user || user.role !== 'Student') {
      return sendResponse(res, 404, false, 'Student not found');
    }

    if (user.status === status) {
      return sendResponse(res, 400, false, `Student is already ${status}`);
    }

    user.status = status;
    await user.save();

    // Log the action with the reason provided in the modal
    await AdminLog.create({
      adminId,
      type: status === 'Suspended' ? 'user_suspended' : 'status_update',
      title: status === 'Suspended' ? `Suspended: ${suspensionCategory || 'Violation'}` : 'Status Updated',
      description: status === 'Suspended' 
        ? `Reason: ${reason || 'No reason provided'}. Email sent: ${sendEmail}` 
        : `Status changed to ${status}`,
      targetUserId: id,
      severity: status === 'Suspended' ? 'High' : 'Low'
    });

    return sendResponse(res, 200, true, `Student status updated to ${status}`, { status: user.status });
  } catch (error) {
    logger.error(`Error in updateStudentStatus: ${error.message}`);
    next(error);
  }
};

/**
 * POST /api/v1/admin/students/:id/notes
 * Adds an internal admin note to the profile.
 */
export const addStudentNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const adminName = req.user?.name || 'Admin';

    const profile = await StudentProfile.findOne({ where: { userId: id } });
    if (!profile) {
      return sendResponse(res, 404, false, 'Student profile not found');
    }

    const newNote = {
      text,
      adminName,
      createdAt: new Date().toISOString()
    };

    const updatedNotes = [...(profile.adminNotes || []), newNote];
    profile.adminNotes = updatedNotes;
    await profile.save();

    return sendResponse(res, 201, true, 'Admin note added successfully', updatedNotes);
  } catch (error) {
    logger.error(`Error in addStudentNote: ${error.message}`);
    next(error);
  }
};

/**
 * POST /api/v1/admin/students/:id/force-logout
 * MOCK: Forces a user logout.
 */
export const forceLogout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user?.id || 1;
    const user = await User.findByPk(id);

    if (!user || user.role !== 'Student') {
      return sendResponse(res, 404, false, 'Student not found');
    }

    if (!user.isOnline) {
      return sendResponse(res, 400, false, 'Student is already offline');
    }

    // Logic would typically involve clearing sessions/tokens in Redis
    user.isOnline = false;
    await user.save();

    await AdminLog.create({
      adminId,
      type: 'force_logout',
      title: 'Force Logout',
      description: `Forced logout for student user ID ${id}`,
      targetUserId: id
    });

    return sendResponse(res, 200, true, 'Student forced to logout successfully');
  } catch (error) {
    logger.error(`Error in forceLogout: ${error.message}`);
    next(error);
  }
};

/**
 * POST /api/v1/admin/students/:id/warning
 * MOCK: Sends a warning to a student.
 */
export const sendStudentWarning = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message, category, severity } = req.body;
    const adminId = req.user?.id || 1;
    const user = await User.findByPk(id);

    if (!user || user.role !== 'Student') {
      return sendResponse(res, 404, false, 'Student not found');
    }

    if (user.status === 'Suspended') {
      return sendResponse(res, 400, false, 'Cannot send warning to a suspended student');
    }

    // Logic would typically involve creating a notification record
    logger.info(`Admin ${adminId} sent warning to user ${id}: ${category} - ${severity}`);

    await AdminLog.create({
      adminId,
      type: 'user_warning',
      title: `Warning: ${category}`,
      description: `[${severity}] ${message}`,
      targetUserId: id,
      severity: 'Medium'
    });

    return sendResponse(res, 200, true, 'Warning sent to student successfully');
  } catch (error) {
    logger.error(`Error in sendStudentWarning: ${error.message}`);
    next(error);
  }
};

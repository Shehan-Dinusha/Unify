import { Op } from "sequelize";
import {
  User,
  StudentProfile,
  Faculty,
  UserActivityLog,
  StudentReport,
  Post,
  Comment,
  AdminLog,
  UserSession,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import moment from "moment";
import UserSuspensionService from "../../services/userSuspension.service.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";
import { notifyUser } from "../../services/notification.service.js";
import { updateStudentReputation } from "../../services/reputation.service.js";

//Retrieves the student directory with filtering and search.
export const getStudentDirectory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, faculty, status } = req.query;
    const offset = (page - 1) * limit;

    let userWhere = { role: "Student" };
    let profileWhere = {};

    if (search) {
      userWhere[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        {
          "$studentProfile.registrationNumber$": { [Op.iLike]: `%${search}%` },
        },
      ];
    }

    if (status && status !== "all") {
      userWhere.status =
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }

    if (faculty && faculty !== "all") {
      // Dynamic lookup: map short codes to partial names, then use ILIKE
      // to match DB values like 'Faculty of Engineering', 'Information Technology', etc.
      const facultyNameMap = {
        it: "Information Technology",
        eng: "Engineering",
        arch: "Architecture",
        bus: "Business",
        med: "Medicine",
        sci: "Science",
        mgmt: "Management",
      };
      const searchTerm = facultyNameMap[faculty.toLowerCase()] || faculty;
      const facultyRecord = await Faculty.findOne({
        where: { name: { [Op.iLike]: `%${searchTerm}%` } },
      });
      if (facultyRecord) {
        profileWhere.facultyId = facultyRecord.id;
      }
    }

    const isFilteringByProfile = Object.keys(profileWhere).length > 0;

    const { count, rows: students } = await User.findAndCountAll({
      where: userWhere,
      include: [
        {
          model: StudentProfile,
          as: "studentProfile",
          where: isFilteringByProfile ? profileWhere : undefined,
          required: isFilteringByProfile, // Inner join if filtering, Left join otherwise
          include: [{ model: Faculty, as: "faculty", attributes: ["name"] }],
        },
      ],
      subQuery: false,
      distinct: true, // Prevents inflated count from LEFT JOINs
      attributes: ["id", "name", "email", "avatar", "status", "lastActive"],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["lastActive", "DESC"]],
    });

    const formattedStudents = await Promise.all(
      students.map(async (s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        avatar: await resolveAvatarUrl(s.avatar, s.name),
        faculty: s.studentProfile?.faculty?.name || "Unknown",
        status: s.status,
        lastActive: s.lastActive ? moment(s.lastActive).fromNow() : "Never",
      })),
    );

    return sendResponse(res, 200, true, "Student directory retrieved", {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      students: formattedStudents,
    });
  } catch (error) {
    logger.error(`Error in getStudentDirectory: ${error.message}`);
    next(error);
  }
};

//Dashboard statistics for Student Management.
export const getStudentStats = async (req, res, next) => {
  try {
    const totalStudents = await User.count({ where: { role: "Student" } });
    const verifiedIdentities = await User.count({
      where: { role: "Student", status: "Active" },
    });
    const flaggedSessions = await StudentReport.count({
      where: { status: { [Op.ne]: "Resolved" } },
    });

    // Activity Rate calculation (active in last 30 days / total)
    const thirtyDaysAgo = moment().subtract(30, "days").toDate();
    const activeRecently = await User.count({
      where: {
        role: "Student",
        lastActive: { [Op.gte]: thirtyDaysAgo },
      },
    });

    const activityRate =
      totalStudents > 0
        ? Math.round((activeRecently / totalStudents) * 100)
        : 0;

    return sendResponse(res, 200, true, "Student stats retrieved", {
      activityRate: `${activityRate}%`,
      verifiedIdentities:
        verifiedIdentities > 1000
          ? `${(verifiedIdentities / 1000).toFixed(1)}k`
          : verifiedIdentities,
      flaggedSessions,
    });
  } catch (error) {
    logger.error(`Error in getStudentStats: ${error.message}`);
    next(error);
  }
};

//Detailed student profile for Admin view.
export const getStudentProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { id, role: "Student" },
      include: [
        {
          model: StudentProfile,
          as: "studentProfile",
          include: [{ model: Faculty, as: "faculty" }],
        },
      ],
    });

    if (!user) {
      return sendResponse(res, 404, false, "Student not found");
    }

    // ─── Trend Calculations ──────────────────────────────────────────────────
    const now = new Date();
    const startOfThisMonth = moment().startOf("month").toDate();
    const startOfLastMonth = moment()
      .subtract(1, "month")
      .startOf("month")
      .toDate();

    const [
      totalPosts,
      postsThisMonth,
      postsLastMonth,
      totalComments,
      commentsThisMonth,
      commentsLastMonth,
      reportsCount,
    ] = await Promise.all([
      Post.count({ where: { authorId: id } }),
      Post.count({
        where: { authorId: id, createdAt: { [Op.gte]: startOfThisMonth } },
      }),
      Post.count({
        where: {
          authorId: id,
          createdAt: { [Op.lt]: startOfThisMonth, [Op.gte]: startOfLastMonth },
        },
      }),
      Comment.count({ where: { userId: id } }),
      Comment.count({
        where: { userId: id, createdAt: { [Op.gte]: startOfThisMonth } },
      }),
      Comment.count({
        where: {
          userId: id,
          createdAt: { [Op.lt]: startOfThisMonth, [Op.gte]: startOfLastMonth },
        },
      }),
      StudentReport.count({
        where: { studentId: id, status: "Pending Review" },
      }),
    ]);

    // Activity Logs
    const logs = await UserActivityLog.findAll({
      where: { userId: id },
      order: [["createdAt", "DESC"]],
      limit: 20,
    });

    const reputation = user.studentProfile?.reputationScore || 0;

    const getTrendLabel = (current, previous) => {
      if (previous === 0) return current > 0 ? "+100%" : "";
      const diff = ((current - previous) / previous) * 100;
      return `${diff > 0 ? "+" : ""}${diff.toFixed(0)}%`;
    };

    const formattedProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      userId: `#${String(user.id).padStart(6, "0")}`,
      studentCode: user.studentProfile?.registrationNumber || "N/A",
      faculty: user.studentProfile?.faculty?.name || "Unknown",
      joinDate: `Joined ${moment(user.createdAt).format("MMM DD, YYYY")}`,
      status: user.status,
      tier: user.studentProfile?.tier || "Standard",
      isOnline: user.isOnline || false,
      activeSessions: 1,
      avatar: await resolveAvatarUrl(user.avatar, user.name),
      stats: {
        totalPosts: {
          value: totalPosts.toLocaleString(),
          trend: getTrendLabel(postsThisMonth, postsLastMonth)
            ? `${getTrendLabel(postsThisMonth, postsLastMonth)} this month`
            : "",
          icon: "📄",
        },
        comments: {
          value: totalComments.toLocaleString(),
          trend: getTrendLabel(commentsThisMonth, commentsLastMonth)
            ? `${getTrendLabel(commentsThisMonth, commentsLastMonth)} this month`
            : "",
          icon: "💬",
        },
        reputation: {
          value: reputation.toLocaleString(),
          trend: "", // Reputation trend requires more complex logging
          icon: "⭐",
        },
        reports: {
          value: String(reportsCount),
          trend: reportsCount > 0 ? "Needs Review" : "Clean",
          icon: "🚩",
          isWarning: reportsCount > 0,
        },
      },
      activityLog: logs.map((l) => ({
        id: l.id,
        type: l.type || "action",
        typeIcon: l.icon || "📝",
        typeColor: l.iconColor || "bg-primary-blue/20",
        title: l.title || "Activity",
        detail: l.detail || "",
        ip: l.ip || "0.0.0.0",
        device: l.device || "Unknown",
        timestamp: moment(l.createdAt).fromNow(),
      })),
      adminNotes: user.studentProfile?.adminNotes || [],
    };

    return sendResponse(
      res,
      200,
      true,
      "Student profile retrieved",
      formattedProfile,
    );
  } catch (error) {
    logger.error(`Error in getStudentProfile: ${error.message}`);
    next(error);
  }
};

//Updates student status (Suspend/Active).
export const updateStudentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason, suspensionCategory, sendEmail } = req.body;
    const adminId = req.user?.id;

    if (!adminId) {
      return sendResponse(res, 401, false, "Admin authentication required.");
    }

    const user = await User.findByPk(id);
    if (!user || user.role !== "Student") {
      return sendResponse(res, 404, false, "Student not found");
    }

    if (user.status === status) {
      return sendResponse(res, 400, false, `Student is already ${status}`);
    }

    // Use UserSuspensionService to handle the logic and database records
    if (status === "Suspended") {
      await UserSuspensionService.createSuspension(
        {
          userId: parseInt(id),
          reason:
            reason ||
            `Suspended for ${suspensionCategory || "policy violation"}`,
          reasonTag: suspensionCategory || "Violation of Terms",
          effectiveDate: new Date(),
          adminNotes: reason,
        },
        adminId,
      );
    } else if (status === "Active") {
      // If student was suspended, reactivate via service
      if (user.status === "Suspended") {
        await UserSuspensionService.reactivateUser(
          parseInt(id),
          {
            identityVerificationComplete: true,
            securityAuditPassed: true,
            reactivationNotes: "Reactivated from Student Management panel",
          },
          adminId,
        );
      } else {
        // Direct status update for other transitions
        user.status = status;
        await user.save();
      }
    } else {
      // Direct status update for any other statuses
      user.status = status;
      await user.save();
    }

    // Still create an AdminLog for consistency
    await AdminLog.create({
      adminId,
      type: status === "Suspended" ? "user_suspended" : "status_update",
      title:
        status === "Suspended"
          ? `Suspended: ${suspensionCategory || "Violation"}`
          : "Status Updated",
      description:
        status === "Suspended"
          ? `Reason: ${reason || "No reason provided"}. Email sent: ${sendEmail}`
          : `Status changed to ${status}`,
      targetUserId: id,
      severity: status === "Suspended" ? "High" : "Low",
    });

    if (sendEmail && status === "Suspended") {
      logger.info(
        `📧 NOTIFICATION: Suspension email sent to student ${user.email}. Reason: ${reason || suspensionCategory}`,
      );
    }

    // ── Send in-app notification to the student ──────────────────────
    if (status === "Suspended") {
      notifyUser({
        userId: parseInt(id),
        actorId: adminId,
        type: "General",
        title: "Account Suspended",
        content: `Your account has been suspended. Reason: ${reason || suspensionCategory || "Policy violation"}. If you believe this is an error, please contact support.`,
        referenceId: parseInt(id),
        referenceType: "Suspension",
        dedupeKey: `admin:suspend:${id}:${Date.now()}`,
      }).catch(() => {});
    } else if (status === "Active") {
      notifyUser({
        userId: parseInt(id),
        actorId: adminId,
        type: "General",
        title: "Account Reactivated 🎉",
        content: "Your account has been reactivated. You can now access all platform features again. Welcome back!",
        referenceId: parseInt(id),
        referenceType: "Reactivation",
        dedupeKey: `admin:reactivate:${id}:${Date.now()}`,
      }).catch(() => {});
    }

    return sendResponse(res, 200, true, `Student status updated to ${status}`, {
      status: status,
    });
  } catch (error) {
    logger.error(`Error in updateStudentStatus: ${error.message}`);
    next(error);
  }
};

//Adds an internal admin note to the profile.
export const addStudentNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const adminName = req.user?.name;

    if (!adminName) {
      return sendResponse(res, 401, false, "Admin authentication required.");
    }

    const profile = await StudentProfile.findOne({ where: { userId: id } });
    if (!profile) {
      return sendResponse(res, 404, false, "Student profile not found");
    }

    const newNote = {
      text,
      adminName,
      createdAt: new Date().toISOString(),
    };

    const updatedNotes = [...(profile.adminNotes || []), newNote];
    profile.adminNotes = updatedNotes;
    await profile.save();

    return sendResponse(
      res,
      201,
      true,
      "Admin note added successfully",
      updatedNotes,
    );
  } catch (error) {
    logger.error(`Error in addStudentNote: ${error.message}`);
    next(error);
  }
};

//Forces a user logout.
export const forceLogout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user?.id;

    if (!adminId) {
      return sendResponse(res, 401, false, "Admin authentication required.");
    }

    const user = await User.findByPk(id);

    if (!user || user.role !== "Student") {
      return sendResponse(res, 404, false, "Student not found");
    }

    if (!user.isOnline) {
      return sendResponse(res, 400, false, "Student is already logged out");
    }

    user.isOnline = false;
    await user.save();

    await UserSession.update(
      { revokedAt: new Date() },
      { where: { userId: id, revokedAt: null } }
    );

    await AdminLog.create({
      adminId,
      type: "force_logout",
      title: "Force Logout",
      description: `Forced logout for student user ID ${id}`,
      targetUserId: id,
    });

    // ── Notify student about forced logout ────────────────────────────
    notifyUser({
      userId: parseInt(id),
      actorId: adminId,
      type: "General",
      title: "Session Terminated",
      content: "Your session was terminated by an administrator. If you did not expect this, please contact support.",
      referenceId: parseInt(id),
      referenceType: "ForceLogout",
      dedupeKey: `admin:logout:${id}:${Date.now()}`,
    }).catch(() => {});

    return sendResponse(
      res,
      200,
      true,
      "Student forced to logout successfully",
    );
  } catch (error) {
    logger.error(`Error in forceLogout: ${error.message}`);
    next(error);
  }
};

//Sends a warning to a student.
export const sendStudentWarning = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message, category, severity, sendEmail } = req.body;
    const adminId = req.user?.id;

    if (!adminId) {
      return sendResponse(res, 401, false, "Admin authentication required.");
    }

    const user = await User.findByPk(id);

    if (!user || user.role !== "Student") {
      return sendResponse(res, 404, false, "Student not found");
    }

    if (user.status === "Suspended") {
      return sendResponse(
        res,
        400,
        false,
        "Cannot send warning to a suspended student",
      );
    }

    logger.info(
      `Admin ${adminId} sent warning to user ${id}: ${category} - ${severity}`,
    );

    if (sendEmail) {
      logger.info(
        `📧 NOTIFICATION: Warning email sent to student ${user.email}. Message: ${message || category}`,
      );
    }

    await AdminLog.create({
      adminId,
      type: "user_warning",
      title: `Warning: ${category}`,
      description: `[${severity}] ${message}`,
      targetUserId: id,
      severity: "Medium",
    });

    await updateStudentReputation(parseInt(id), 'WARNING_RECEIVED');

    // ── Send in-app warning notification to the student ───────────────
    notifyUser({
      userId: parseInt(id),
      actorId: adminId,
      type: "General",
      title: `⚠️ Warning: ${category}`,
      content: `You have received a ${severity || "Medium"} severity warning. ${message || "Please review the community guidelines to avoid further action."}`,
      referenceId: parseInt(id),
      referenceType: "Warning",
      dedupeKey: `admin:warning:${id}:${Date.now()}`,
    }).catch(() => {});

    return sendResponse(res, 200, true, "Warning sent to student successfully");
  } catch (error) {
    logger.error(`Error in sendStudentWarning: ${error.message}`);
    next(error);
  }
};

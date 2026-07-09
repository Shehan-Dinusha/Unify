import { Op } from "sequelize";
import { 
  UserSuspension, 
  UserSuspensionHistory, 
  User, 
  StudentProfile,
  BusinessProfile,
  ClubProfile,
  Faculty, 
  Degree,
  Batch,
  sequelize 
} from "../modules/index.js";
import { resolveAvatarUrl } from "../utils/avatarUrl.util.js";

class UserSuspensionService {
  async generateCaseReference() {
    let isUnique = false;
    let caseRef = "";
    while (!isUnique) {
      const year = new Date().getFullYear();
      const num = Math.floor(100 + Math.random() * 900); // 3 digits
      caseRef = `#SUS-${year}-${num}`;
      
      const existing = await UserSuspension.findOne({ where: { caseReference: caseRef } });
      if (!existing) {
        isUnique = true;
      }
    }
    return caseRef;
  }

  calculateSuspendedDaysAgo(suspensionDate) {
    if (!suspensionDate) return 0;
    return Math.floor((Date.now() - new Date(this.suspensionDate).getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Maps UI-friendly reason tags to DB Enum values
   */
  mapReasonTag(tag) {
    const map = {
      'Violation of Terms': 'ToS Violation',
      'Spam Activity': 'Suspicious Activity',
      'Harassment': 'Harassment',
      'Suspicious Activity': 'Suspicious Activity',
      'Violation': 'ToS Violation',
      'Non-payment': 'Payment Failure',
      'Payment': 'Payment Failure',
      'Other': 'ToS Violation'
    };
    return map[tag] || 'ToS Violation';
  }

  mapSeverity(tag) {
    const map = {
      'Violation of Terms': 'High',
      'Spam Activity': 'Medium',
      'Harassment': 'Critical',
      'ToS Violation': 'High',
      'Suspicious Activity': 'Medium'
    };
    return map[tag] || 'Medium';
  }

  async createSuspension(data, adminId) {
    const transaction = await sequelize.transaction();
    try {
      const { userId, reason, reasonTag, severity, effectiveDate, adminNotes } = data;
      const mappedTag = this.mapReasonTag(reasonTag);
      const mappedSeverity = severity || this.mapSeverity(reasonTag);

      const user = await User.findByPk(userId);
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      const existingActive = await UserSuspension.findOne({
        where: { userId, status: "ACTIVE" }
      });
      if (existingActive) {
        const error = new Error("User already has an active suspension");
        error.statusCode = 409;
        throw error;
      }

      const caseReference = await this.generateCaseReference();
      const now = new Date();
      const suspensionTime = now.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit', hour12: true });

      const admin = await User.findByPk(adminId);
      const adminName = admin ? admin.name : 'SysAdmin';
      const effDateObj = new Date(effectiveDate);
      const formattedDate = effDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const adminAction = `Action taken on ${formattedDate} by ${adminName}`;

      const suspension = await UserSuspension.create({
        userId,
        caseReference,
        reason,
        reasonTag: mappedTag,
        severity: mappedSeverity,
        effectiveDate,
        suspensionDate: now,
        suspensionTime,
        adminNotes,
        adminAction,
        status: "ACTIVE",
      }, { transaction });

      await UserSuspensionHistory.create({
        suspensionId: suspension.id,
        action: "SUSPENSION_CREATED",
        performedBy: adminId,
        timestamp: now
      }, { transaction });

      await user.update({ status: "Suspended" }, { transaction });
      
      const studentProfile = await StudentProfile.findOne({ where: { userId }, transaction });
      const businessProfile = !studentProfile ? await BusinessProfile.findOne({ where: { userId }, transaction }) : null;
      const clubProfile = (!studentProfile && !businessProfile) ? await ClubProfile.findOne({ where: { userId }, transaction }) : null;

      await transaction.commit();

      let entityId = null;
      if (studentProfile) entityId = studentProfile.registrationNumber;
      else if (businessProfile) entityId = `BUS-${businessProfile.id}`;
      else if (clubProfile) entityId = `CLUB-${clubProfile.id}`;

      return {
        suspensionId: suspension.id,
        userId,
        caseReference,
        studentId: entityId, // Kept as studentId for frontend compatibility but now holds correct ID
        name: user.name,
        reason,
        reasonTag,
        severity: mappedSeverity,
        effectiveDate,
        suspensionDate: suspension.suspensionDate,
        suspensionTime,
        status: suspension.status,
        createdBy: adminId
      };
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback().catch(() => {});
      }
      throw error;
    }
  }

  async reactivateUser(identifier, data, adminId) {
    const transaction = await sequelize.transaction();
    try {
      const { identityVerificationComplete, securityAuditPassed, reactivationNotes } = data;

      if (!identityVerificationComplete || !securityAuditPassed) {
        const error = new Error("Both identity verification and security audit must be passed");
        error.statusCode = 422;
        throw error;
      }

      let user;
      let suspension;
      let userId;

      // Check if identifier is an integer (userId) or UUID (suspension.id)
      if (!isNaN(parseInt(identifier)) && String(identifier).length < 10) {
        userId = parseInt(identifier);
        user = await User.findByPk(userId);
        suspension = await UserSuspension.findOne({
          where: { userId, status: "ACTIVE" }
        });
      } else {
        // Assume UUID (suspension ID)
        suspension = await UserSuspension.findByPk(identifier);
        if (suspension) {
          userId = suspension.userId;
          user = await User.findByPk(userId);
        }
      }

      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      if (!suspension) {
        const error = new Error("No active suspension found for user");
        error.statusCode = 404;
        throw error;
      }

      if (suspension.status === "REACTIVATED") {
        const error = new Error("User is already reactivated");
        error.statusCode = 409;
        throw error;
      }

      const now = new Date();
      await suspension.update({
        status: "REACTIVATED",
        reactivationDate: now,
        reactivatedBy: adminId,
        reactivationNotes,
        identityVerificationComplete,
        securityAuditPassed
      }, { transaction });

      await UserSuspensionHistory.create({
        suspensionId: suspension.id,
        action: "ACCOUNT_REACTIVATED",
        performedBy: adminId,
        timestamp: now
      }, { transaction });

      await user.update({ status: "Active" }, { transaction });

      const studentProfile = await StudentProfile.findOne({ 
        where: { userId },
        transaction
      });

      await transaction.commit();

      return {
        userId,
        studentId: studentProfile?.registrationNumber || null,
        name: user.name,
        caseReference: suspension.caseReference,
        reactivatedAt: now,
        reactivatedBy: adminId,
        previousStatus: "ACTIVE",
        newStatus: "REACTIVATED",
        notificationSent: true
      };

    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback().catch(() => {});
      }
      throw error;
    }
  }

  async getDashboardStatistics() {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Current counts
    const activeCount = await UserSuspension.count({ where: { status: "ACTIVE" } });
    const highSeverityCount = await UserSuspension.count({ 
      where: { 
        status: "ACTIVE",
        severity: { [Op.or]: ['Critical', 'High'] }
      } 
    });
    const reactivatedThisMonth = await UserSuspension.count({
      where: {
        status: "REACTIVATED",
        reactivationDate: { [Op.gte]: startOfThisMonth }
      }
    });

    // Previous month counts for trends
    const activeLastMonth = await UserSuspension.count({ 
      where: { 
        status: "ACTIVE",
        createdAt: { [Op.lt]: startOfThisMonth }
      } 
    });
    const highLastMonth = await UserSuspension.count({ 
      where: { 
        status: "ACTIVE",
        severity: { [Op.or]: ['Critical', 'High'] },
        createdAt: { [Op.lt]: startOfThisMonth }
      } 
    });
    const reactivatedLastMonth = await UserSuspension.count({
      where: {
        status: "REACTIVATED",
        reactivationDate: { [Op.lt]: startOfThisMonth, [Op.gte]: startOfLastMonth }
      }
    });

    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const diff = ((current - previous) / previous) * 100;
      return `${diff >= 0 ? '+' : ''}${Math.round(diff)}%`;
    };

    return {
      suspendedAccounts: { 
        count: activeCount, 
        badge: 'Active', 
        change: calculateTrend(activeCount, activeLastMonth), 
        status: activeCount >= activeLastMonth ? 'increased' : 'decreased' 
      },
      highSeverityCases: { 
        count: highSeverityCount, 
        badge: 'Critical', 
        change: calculateTrend(highSeverityCount, highLastMonth), 
        status: highSeverityCount >= highLastMonth ? 'increased' : 'decreased' 
      },
      reactivatedThisMonth: { 
        count: reactivatedThisMonth, 
        badge: 'Restored', 
        change: calculateTrend(reactivatedThisMonth, reactivatedLastMonth), 
        status: reactivatedThisMonth >= reactivatedLastMonth ? 'increased' : 'decreased' 
      }
    };
  }
  async getAllSuspendedUsers(filters) {
    const { search, reason, dateRange, status, page = 1, limit = 20 } = filters;
    
    const where = {};
    if (status && status !== 'all') where.status = status;
    if (reason && reason !== 'all') where.reasonTag = reason;
    
    if (dateRange && dateRange !== 'all') {
      const days = parseInt(dateRange);
      if (!isNaN(days)) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        where.suspensionDate = { [Op.gte]: date };
      }
    }

    // Search uses $nested.column$ notation in the top-level where
    // so Sequelize correctly resolves columns across associated tables.
    if (search) {
      const searchLower = search.toLowerCase();
      where[Op.or] = [
        sequelize.where(sequelize.fn('LOWER', sequelize.col('user.name')), 'LIKE', `%${searchLower}%`),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('user.email')), 'LIKE', `%${searchLower}%`),
        sequelize.where(
          sequelize.fn('LOWER', sequelize.col('user->studentProfile.registrationNumber')),
          'LIKE',
          `%${searchLower}%`
        ),
        sequelize.where(
          sequelize.fn('LOWER', sequelize.col('user->businessProfile.businessName')),
          'LIKE',
          `%${searchLower}%`
        ),
        sequelize.where(
          sequelize.fn('LOWER', sequelize.col('user->clubProfile.clubName')),
          'LIKE',
          `%${searchLower}%`
        )
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await UserSuspension.findAndCountAll({
      where,
      limit,
      offset,
      subQuery: false,
      order: [['suspensionDate', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: StudentProfile,
              as: 'studentProfile',
              required: false,
              include: [
                { model: Faculty, as: 'faculty' },
                { model: Degree, as: 'degree' },
                { model: Batch, as: 'batch' }
              ]
            },
            {
              model: BusinessProfile,
              as: 'businessProfile',
              required: false
            },
            {
              model: ClubProfile,
              as: 'clubProfile',
              required: false
            }
          ]
        }
      ]
    });

    const formattedUsers = await Promise.all(rows.map(async suspension => {
      const user = suspension.user;
      const studentProfile = user?.studentProfile;
      const businessProfile = user?.businessProfile;
      const clubProfile = user?.clubProfile;
      
      let year = null;
      if (studentProfile?.batch?.year) {
        year = studentProfile.batch.year;
      }
      
      // Get display name based on role
      let displayName = user?.name;
      if (user?.role === 'Business' && businessProfile?.businessName) {
        displayName = businessProfile.businessName;
      } else if (user?.role === 'Club' && clubProfile?.clubName) {
        displayName = clubProfile.clubName;
      }

      // Format address from whichever profile exists
      const profileAddresses = studentProfile?.addresses || businessProfile?.addresses || clubProfile?.addresses || [];
      let addressStr = null;
      if (Array.isArray(profileAddresses) && profileAddresses.length > 0) {
        const addr = profileAddresses[0];
        addressStr = (addr.city ? addr.city + ", " : "") + (addr.country || "");
      } else if (typeof profileAddresses === 'string') {
        addressStr = profileAddresses;
      }

      let phoneStr = user?.phone || businessProfile?.phone || clubProfile?.phone || "";
      if (phoneStr && !phoneStr.startsWith("+94")) {
        if (phoneStr.startsWith("0")) phoneStr = phoneStr.substring(1);
        phoneStr = "+94 " + phoneStr.slice(0, 2) + " " + phoneStr.slice(2, 5) + " " + phoneStr.slice(5);
      }

      return {
        id: suspension.id,
        userId: suspension.userId || user?.id,
        name: displayName,
        email: user?.email,
        avatar: await resolveAvatarUrl(user?.avatar, displayName),
        role: user?.role,
        studentId: studentProfile?.registrationNumber || 
                  (businessProfile ? `BUS-${businessProfile.id}` : 
                  (clubProfile ? `CLUB-${clubProfile.id}` : null)),
        faculty: studentProfile?.faculty?.name || businessProfile?.category || clubProfile?.category || null,
        department: studentProfile?.degree?.name || businessProfile?.serviceType || null,
        year: year ? `${year} Year` : (user?.role !== 'Student' ? user?.role : null),
        gpa: studentProfile?.reputationScore ? (studentProfile.reputationScore / 200).toFixed(2) : null, 
        phone: phoneStr,
        address: addressStr,
        suspensionDate: suspension.suspensionDate,
        suspensionTime: suspension.suspensionTime,
        reason: suspension.reason,
        reasonTag: suspension.reasonTag,
        severity: suspension.severity,
        caseRef: suspension.caseReference,
        effectiveDate: suspension.effectiveDate,
        adminNotes: suspension.adminNotes,
        adminAction: suspension.adminAction,
        suspendedDaysAgo: suspension.suspendedDaysAgo,
        status: suspension.status
      };
    }));

    const stats = await this.getDashboardStatistics();

    return {
      users: formattedUsers,
      statistics: {
        suspendedAccountsCount: stats.suspendedAccounts.count,
        suspendedAccountsChange: stats.suspendedAccounts.change,
        highSeverityCasesCount: stats.highSeverityCases.count,
        highSeverityCasesChange: stats.highSeverityCases.change,
        reactivatedThisMonthCount: stats.reactivatedThisMonth.count,
        reactivatedThisMonthChange: stats.reactivatedThisMonth.change,
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async getSuspendedUserById(identifier) {
    const where = {};
    
    // Check if identifier is an integer (userId) or UUID (suspension.id)
    if (!isNaN(parseInt(identifier)) && String(identifier).length < 10) {
      where.userId = parseInt(identifier);
      where.status = { [Op.ne]: 'REACTIVATED' };
    } else {
      where.id = identifier;
    }

    const suspension = await UserSuspension.findOne({
      where,
      order: [['suspensionDate', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: StudentProfile,
              as: 'studentProfile',
              include: [
                { model: Faculty, as: 'faculty' },
                { model: Degree, as: 'degree' },
                { model: Batch, as: 'batch' }
              ]
            },
            {
              model: BusinessProfile,
              as: 'businessProfile'
            },
            {
              model: ClubProfile,
              as: 'clubProfile'
            }
          ]
        }
      ]
    });

    if (!suspension) {
      // If identifier was a number, try finding a reactivated one
      if (!isNaN(parseInt(identifier)) && String(identifier).length < 10) {
        const reactivatedSuspension = await UserSuspension.findOne({
          where: { userId: parseInt(identifier), status: 'REACTIVATED' },
        order: [['suspensionDate', 'DESC']],
        include: [
          {
            model: User,
            as: 'user',
            include: [
              {
                model: StudentProfile,
                as: 'studentProfile',
                include: [
                  { model: Faculty, as: 'faculty' },
                  { model: Degree, as: 'degree' },
                  { model: Batch, as: 'batch' }
                ]
              },
              {
                model: BusinessProfile,
                as: 'businessProfile'
              },
              {
                model: ClubProfile,
                as: 'clubProfile'
              }
            ]
          }
        ]
      });
      
      if (!reactivatedSuspension) {
        const error = new Error("Suspension record not found for user");
        error.statusCode = 404;
        throw error;
      }
      return await this._formatUserDetails(reactivatedSuspension);
      }
      return null;
    }

    return await this._formatUserDetails(suspension);
  }

  async _formatUserDetails(suspension) {
    const user = suspension.user;
    const studentProfile = user?.studentProfile;
    const businessProfile = user?.businessProfile;
    const clubProfile = user?.clubProfile;
    
    let year = null;
    if (studentProfile?.batch?.year) {
      year = studentProfile.batch.year;
    }
    
    // Format address from whichever profile exists
    const profileAddresses = studentProfile?.addresses || businessProfile?.addresses || clubProfile?.addresses || [];
    let addressStr = null;
    if (Array.isArray(profileAddresses) && profileAddresses.length > 0) {
      const addr = profileAddresses[0];
      addressStr = (addr.city ? addr.city + ", " : "") + (addr.country || "");
    } else if (typeof profileAddresses === 'string') {
      addressStr = profileAddresses;
    }

    let phoneStr = user.phone || businessProfile?.phone || clubProfile?.phone || "";
    if (phoneStr && !phoneStr.startsWith("+94")) {
      if (phoneStr.startsWith("0")) phoneStr = phoneStr.substring(1);
      phoneStr = "+94 " + phoneStr.slice(0, 2) + " " + phoneStr.slice(2, 5) + " " + phoneStr.slice(5);
    }

    // Role-specific display name
    let displayName = user.name;
    if (user.role === 'Business' && businessProfile?.businessName) {
      displayName = businessProfile.businessName;
    } else if (user.role === 'Club' && clubProfile?.clubName) {
      displayName = clubProfile.clubName;
    }

    return {
      id: user.id,
      user: {
        id: user.id,
        name: displayName,
        email: user.email,
        avatar: await resolveAvatarUrl(user.avatar, displayName),
        role: user.role,
        studentId: studentProfile?.registrationNumber || 
                  (businessProfile ? `BUS-${businessProfile.id}` : 
                  (clubProfile ? `CLUB-${clubProfile.id}` : null)),
        faculty: studentProfile?.faculty?.name || businessProfile?.category || clubProfile?.category || null,
        department: studentProfile?.degree?.name || 
                   (businessProfile?.ownerFirstName ? (businessProfile.ownerFirstName + " " + (businessProfile.ownerLastName || "")) : null) || 
                   null,
        year: year ? `${year} Year` : (businessProfile?.nic || null),
        gpa: user.role === 'Student' 
          ? (studentProfile?.reputationScore ? (studentProfile.reputationScore / 200).toFixed(2) : null)
          : (businessProfile?.averageRating ? businessProfile.averageRating.toFixed(1) : null),
        phone: phoneStr,
        address: addressStr,
      },
      suspension: {
        caseRef: suspension.caseReference,
        reason: suspension.reason,
        reasonTag: suspension.reasonTag,
        severity: suspension.severity,
        effectiveDate: suspension.effectiveDate,
        suspensionDate: suspension.suspensionDate,
        suspensionTime: suspension.suspensionTime,
        adminNotes: suspension.adminNotes,
        adminAction: suspension.adminAction,
        status: suspension.status,
        suspendedDaysAgo: suspension.suspendedDaysAgo
      },
      validations: {
        identityVerificationComplete: suspension.identityVerificationComplete,
        securityAuditPassed: suspension.securityAuditPassed
      }
    };
  }
}

export default new UserSuspensionService();

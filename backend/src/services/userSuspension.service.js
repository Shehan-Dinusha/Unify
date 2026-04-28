import { Op } from "sequelize";
import { 
  UserSuspension, 
  UserSuspensionHistory, 
  User, 
  StudentProfile, 
  Faculty, 
  Degree,
  Batch,
  sequelize 
} from "../modules/index.js";

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
    return Math.floor((Date.now() - new Date(suspensionDate).getTime()) / (1000 * 60 * 60 * 24));
  }

  async createSuspension(data, adminId) {
    const transaction = await sequelize.transaction();
    try {
      const { userId, reason, reasonTag, severity, effectiveDate, adminNotes } = data;

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
        reasonTag,
        severity,
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

      await transaction.commit();

      const studentProfile = await StudentProfile.findOne({ where: { userId } });

      return {
        suspensionId: suspension.id,
        userId,
        caseReference,
        studentId: studentProfile?.registrationNumber || null,
        name: user.name,
        reason,
        reasonTag,
        severity,
        effectiveDate,
        suspensionDate: suspension.suspensionDate,
        suspensionTime,
        status: suspension.status,
        createdBy: adminId
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async reactivateUser(userId, data, adminId) {
    const transaction = await sequelize.transaction();
    try {
      const { identityVerificationComplete, securityAuditPassed, reactivationNotes } = data;

      if (!identityVerificationComplete || !securityAuditPassed) {
        const error = new Error("Both identity verification and security audit must be passed");
        error.statusCode = 422;
        throw error;
      }

      const user = await User.findByPk(userId);
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      const suspension = await UserSuspension.findOne({
        where: { userId, status: "ACTIVE" }
      });

      if (!suspension) {
        const existingReactivated = await UserSuspension.findOne({
          where: { userId, status: "REACTIVATED" }
        });
        if (existingReactivated) {
          const error = new Error("User is already reactivated");
          error.statusCode = 409;
          throw error;
        }
        const error = new Error("No active suspension found for user");
        error.statusCode = 404;
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

      await transaction.commit();
      
      const studentProfile = await StudentProfile.findOne({ where: { userId } });

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
      await transaction.rollback();
      throw error;
    }
  }

  async getDashboardStatistics() {
    const activeCount = await UserSuspension.count({ where: { status: "ACTIVE" } });
    const pendingCount = await UserSuspension.count({ where: { status: "PENDING_APPEAL" } });
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const reactivatedCount = await UserSuspension.count({
      where: {
        status: "REACTIVATED",
        reactivationDate: {
          [Op.gte]: startOfMonth
        }
      }
    });

    return {
      suspendedAccounts: { count: activeCount, badge: 'Active', change: '-3%', status: 'decreased' },
      pendingAppeals: { count: pendingCount, badge: 'Review', change: '+5%', status: 'increased' },
      reactivatedThisMonth: { count: reactivatedCount, badge: 'Restored', change: '+18%', status: 'increased' }
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

    const userWhere = {};
    const profileWhere = {};
    if (search) {
      const searchLower = search.toLowerCase();
      userWhere[Op.or] = [
        sequelize.where(sequelize.fn('LOWER', sequelize.col('user.name')), 'LIKE', `%${searchLower}%`),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('user.email')), 'LIKE', `%${searchLower}%`),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('user.studentProfile.registrationNumber')), 'LIKE', `%${searchLower}%`)
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await UserSuspension.findAndCountAll({
      where,
      limit,
      offset,
      order: [['suspensionDate', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          where: userWhere,
          include: [
            {
              model: StudentProfile,
              as: 'studentProfile',
              where: profileWhere,
              required: false,
              include: [
                { model: Faculty, as: 'faculty' },
                { model: Degree, as: 'degree' },
                { model: Batch, as: 'batch' }
              ]
            }
          ]
        }
      ]
    });

    const formattedUsers = rows.map(suspension => {
      const user = suspension.user;
      const profile = user?.studentProfile;
      
      let year = null;
      if (profile?.batch?.year) {
        year = profile.batch.year;
      }
      
      const addresses = profile?.addresses || [];
      const addressStr = addresses.length > 0 ? addresses[0].city + ", " + addresses[0].country : null;

      let phoneStr = user?.phone || "";
      if (phoneStr && !phoneStr.startsWith("+94")) {
        // Strip leading zero if present
        if (phoneStr.startsWith("0")) phoneStr = phoneStr.substring(1);
        phoneStr = "+94 " + phoneStr.slice(0, 2) + " " + phoneStr.slice(2, 5) + " " + phoneStr.slice(5);
      }

      return {
        id: suspension.id,
        name: user?.name,
        email: user?.email,
        avatar: user?.avatar,
        studentId: profile?.registrationNumber,
        faculty: profile?.faculty?.name || null,
        department: profile?.degree?.name || null,
        year: year ? `${year} Year` : null,
        gpa: 3.45, // Mocked as requested
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
    });

    const stats = await this.getDashboardStatistics();

    return {
      users: formattedUsers,
      statistics: {
        suspendedAccountsCount: stats.suspendedAccounts.count,
        suspendedAccountsChange: stats.suspendedAccounts.change,
        pendingAppealsCount: stats.pendingAppeals.count,
        pendingAppealsChange: stats.pendingAppeals.change,
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

  async getSuspendedUserById(userId) {
    const suspension = await UserSuspension.findOne({
      where: { userId, status: { [Op.ne]: 'REACTIVATED' } },
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
            }
          ]
        }
      ]
    });

    if (!suspension) {
      // Return reactivated suspension if they don't have an active one
      const reactivatedSuspension = await UserSuspension.findOne({
        where: { userId, status: 'REACTIVATED' },
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
      return this._formatUserDetails(reactivatedSuspension);
    }

    return this._formatUserDetails(suspension);
  }

  _formatUserDetails(suspension) {
    const user = suspension.user;
    const profile = user?.studentProfile;
    
    let year = null;
    if (profile?.batch?.year) {
      year = profile.batch.year;
    }
    
    const addresses = profile?.addresses || [];
    const addressStr = addresses.length > 0 ? addresses[0].city + ", " + addresses[0].country : null;

      let phoneStr = user.phone || "";
      if (phoneStr && !phoneStr.startsWith("+94")) {
        // Strip leading zero if present
        if (phoneStr.startsWith("0")) phoneStr = phoneStr.substring(1);
        phoneStr = "+94 " + phoneStr.slice(0, 2) + " " + phoneStr.slice(2, 5) + " " + phoneStr.slice(5);
      }

    return {
      id: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        studentId: profile?.registrationNumber,
        faculty: profile?.faculty?.name || null,
        department: profile?.degree?.name || null,
        year: year ? `${year} Year` : null,
        gpa: 3.45, // Mocked as requested
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

import { Op } from 'sequelize';
import { 
  User, 
  BusinessProfile, 
  ClubProfile,
  BoostPurchase, 
  UserActivityLog, 
  AdminLog, 
  Review,
  Wallet,
  Transaction,
  sequelize
} from '../../modules/index.js';
import { sendResponse } from '../../utils/response.js';
import UserSuspensionService from '../../services/userSuspension.service.js';
import logger from '../../utils/logger.js';
import moment from 'moment';
import { resolveAvatarUrl } from '../../utils/avatarUrl.util.js';
import { notifyUser } from '../../services/notification.service.js';

//Retrieves the business directory with filtering and search.
export const getBusinessDirectory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category, status } = req.query;
    const offset = (page - 1) * limit;

    let userWhere = { role: { [Op.in]: ['Business', 'Club'] } };

    if (search) {
      userWhere[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { '$businessProfile.businessName$': { [Op.iLike]: `%${search}%` } },
        { '$clubProfile.clubName$': { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (status && status !== 'all') {
      userWhere.status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }

    if (category && category !== 'all') {
      if (category === 'Clubs & Society') {
        userWhere.role = 'Club';
      } else {
        userWhere.role = 'Business';
        const catMap = {
          'Self Employee': 'SELF_EMPLOYED',
          'Boarding': 'BOARDING',
          'Food & Cafe': 'FOOD'
        };
        userWhere['$businessProfile.category$'] = catMap[category] || category;
      }
    }

    const { count, rows: entities } = await User.findAndCountAll({
      where: userWhere,
      include: [
        {
          model: BusinessProfile,
          as: 'businessProfile',
          required: false,
        },
        {
          model: ClubProfile,
          as: 'clubProfile',
          required: false,
        }
      ],
      subQuery: false,
      distinct: true, // Prevents inflated count from LEFT JOINs
      attributes: ['id', 'name', 'email', 'avatar', 'status', 'createdAt', 'role'],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    const formattedEntities = await Promise.all(entities.map(async e => {
      let categoryLabel = 'General';
      let name = e.name;

      if (e.role === 'Club') {
        categoryLabel = 'Clubs & Society';
        name = e.clubProfile?.clubName || e.name;
      } else if (e.businessProfile) {
        name = e.businessProfile.businessName || e.name;
        const cat = e.businessProfile.category;
        categoryLabel = cat === 'SELF_EMPLOYED' ? 'Self Employee' :
                        cat === 'FOOD' ? 'Food & Cafe' :
                        cat === 'BOARDING' ? 'Boarding' : 'General';
      }

      return {
        id: e.id,
        name: name,
        email: e.email,
        avatar: await resolveAvatarUrl(e.avatar, name),
        category: categoryLabel,
        registrationDate: moment(e.createdAt).format('MMM DD, YYYY'),
        status: e.status
      };
    }));

    return sendResponse(res, 200, true, 'Directory retrieved', {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      businesses: formattedEntities
    });
  } catch (error) {
    logger.error(`Error in getBusinessDirectory: ${error.message}`);
    next(error);
  }
};

//Dashboard statistics for Business Management.
export const getBusinessStats = async (req, res, next) => {
  try {
    const startOfThisMonth = moment().startOf('month').toDate();
    const startOfLastMonth = moment().subtract(1, 'month').startOf('month').toDate();

    const [
      verifiedBusinesses,
      businessesLastMonth,
      pendingApprovals,
      totalRevenue,
      businessCountWithRevenue,
      // Retention: all businesses registered before this month
      totalRegisteredBeforeThisMonth,
      // Retention: of those, how many are still Active
      activeRegisteredBeforeThisMonth,
      // Avg subscription trend: revenue last month
      revenueLastMonth,
      businessCountWithRevenueLastMonth
    ] = await Promise.all([
      User.count({ where: { role: { [Op.in]: ['Business', 'Club'] }, status: 'Active' } }),
      User.count({ where: { role: { [Op.in]: ['Business', 'Club'] }, status: 'Active', createdAt: { [Op.lt]: startOfThisMonth } } }),
      User.count({ where: { role: { [Op.in]: ['Business', 'Club'] }, status: 'Suspended' } }),
      Transaction.sum('amount', { where: { type: 'CREDIT', status: 'COMPLETED' } }),
      Transaction.count({
        distinct: true,
        col: 'walletId',
        where: { type: 'CREDIT', status: 'COMPLETED' }
      }),
      // Total businesses registered before this month (regardless of current status)
      User.count({
        where: {
          role: { [Op.in]: ['Business', 'Club'] },
          createdAt: { [Op.lt]: startOfThisMonth }
        }
      }),
      // Of those, how many are still Active (not Suspended/Deactivated)
      User.count({
        where: {
          role: { [Op.in]: ['Business', 'Club'] },
          status: 'Active',
          createdAt: { [Op.lt]: startOfThisMonth }
        }
      }),
      // Revenue from last month for avg subscription trend
      Transaction.sum('amount', {
        where: {
          type: 'CREDIT', status: 'COMPLETED',
          createdAt: { [Op.gte]: startOfLastMonth, [Op.lt]: startOfThisMonth }
        }
      }),
      Transaction.count({
        distinct: true,
        col: 'walletId',
        where: {
          type: 'CREDIT', status: 'COMPLETED',
          createdAt: { [Op.gte]: startOfLastMonth, [Op.lt]: startOfThisMonth }
        }
      })
    ]);

    // Trend calculation
    const getTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const diff = ((current - previous) / previous) * 100;
      return `${diff > 0 ? '+' : ''}${diff.toFixed(0)}%`;
    };

    // Avg subscription value (all time)
    const avgSubscriptionValue = businessCountWithRevenue > 0 ? (totalRevenue || 0) / businessCountWithRevenue : 0;

    // Avg subscription trend: compare current avg vs last month's avg
    const lastMonthAvg = businessCountWithRevenueLastMonth > 0 ? (revenueLastMonth || 0) / businessCountWithRevenueLastMonth : 0;
    const avgSubTrend = lastMonthAvg > 0
      ? `${getTrend(Math.round(avgSubscriptionValue), Math.round(lastMonthAvg))} per user`
      : avgSubscriptionValue > 0 ? '↑ New activity' : 'Stable';

    // Retention rate: percentage of businesses registered before this month that are still Active
    const retentionRateValue = totalRegisteredBeforeThisMonth > 0
      ? ((activeRegisteredBeforeThisMonth / totalRegisteredBeforeThisMonth) * 100).toFixed(1)
      : 100; // If no businesses existed before, default to 100%

    const retentionNum = parseFloat(retentionRateValue);
    const retentionLabel = retentionNum >= 90 ? 'High Loyalty'
      : retentionNum >= 70 ? 'Good Retention'
      : retentionNum >= 50 ? 'Moderate'
      : 'Needs Attention';

    return sendResponse(res, 200, true, 'Business stats retrieved', {
      verifiedBusinesses: verifiedBusinesses > 1000 ? `${(verifiedBusinesses / 1000).toFixed(1)}k` : verifiedBusinesses,
      verifiedTrend: `${getTrend(verifiedBusinesses, businessesLastMonth)} this month`,
      pendingApprovals,
      avgSubscription: `Rs. ${Math.round(avgSubscriptionValue).toLocaleString()}`,
      avgSubscriptionTrend: avgSubTrend,
      retentionRate: `${retentionRateValue}%`,
      retentionLabel
    });
  } catch (error) {
    logger.error(`Error in getBusinessStats: ${error.message}`);
    next(error);
  }
};

//Detailed business profile for Admin view.
export const getBusinessProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { id, role: { [Op.in]: ['Business', 'Club'] } },
      include: [
        {
          model: BusinessProfile,
          as: 'businessProfile'
        },
        {
          model: ClubProfile,
          as: 'clubProfile'
        }
      ]
    });

    if (!user) {
      return sendResponse(res, 404, false, 'Business not found');
    }

    // ─── Wallet & Transactions ──────────────────────────────────────────────
    const wallet = await Wallet.findOne({ where: { userId: id } });
    const walletId = wallet?.id || 0;

    const startOfThisMonth = moment().startOf('month').toDate();
    const startOfLastMonth = moment().subtract(1, 'month').startOf('month').toDate();

    const [
      revenueThisMonth, revenueLastMonth,
      activeAds, adsLastMonth,
      totalRevenue,
      reviewStats
    ] = await Promise.all([
      walletId ? Transaction.sum('amount', { 
        where: { 
          walletId, 
          type: 'CREDIT', 
          status: 'COMPLETED',
          createdAt: { [Op.gte]: startOfThisMonth }
        } 
      }) : Promise.resolve(0),
      walletId ? Transaction.sum('amount', { 
        where: { 
          walletId, 
          type: 'CREDIT', 
          status: 'COMPLETED',
          createdAt: { [Op.lt]: startOfThisMonth, [Op.gte]: startOfLastMonth }
        } 
      }) : Promise.resolve(0),
      BoostPurchase.count({ where: { userId: id, status: 'active' } }),
      BoostPurchase.count({ 
        where: { 
          userId: id, 
          status: 'active',
          createdAt: { [Op.lt]: startOfThisMonth, [Op.gte]: startOfLastMonth }
        } 
      }),
      walletId ? Transaction.sum('amount', { 
        where: { walletId, type: 'CREDIT', status: 'COMPLETED' } 
      }) : Promise.resolve(0),
      Review.findAll({
        where: { targetId: id },
        attributes: [
          'rating',
          [sequelize.fn('COUNT', sequelize.col('rating')), 'count']
        ],
        group: ['rating'],
        raw: true
      })
    ]);

    // Handle null results from Transaction.sum
    const revThis = revenueThisMonth || 0;
    const revLast = revenueLastMonth || 0;
    const totalRev = totalRevenue || 0;

    // Format review sentiment
    const sentimentBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalReviews = 0;
    let sumRating = 0;
    reviewStats.forEach(r => {
      sentimentBreakdown[r.rating] = parseInt(r.count);
      totalReviews += parseInt(r.count);
      sumRating += (r.rating * parseInt(r.count));
    });

    const overallRating = totalReviews > 0 ? (sumRating / totalReviews).toFixed(1) : user.businessProfile?.averageRating || 0;

    // Activity Logs
    const logs = await UserActivityLog.findAll({
      where: { userId: id },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    const getTrendLabel = (current, previous) => {
      if (previous === 0) return current > 0 ? '+100%' : '';
      const diff = ((current - previous) / previous) * 100;
      return `${diff > 0 ? '+' : ''}${diff.toFixed(0)}%`;
    };

    const isClub = user.role === 'Club';
    const profileName = isClub ? (user.clubProfile?.clubName || user.name) : (user.businessProfile?.businessName || user.name);
    const categoryLabel = isClub ? 'Clubs & Society' : 
                         (user.businessProfile?.category === 'SELF_EMPLOYED' ? 'Self Employee' :
                          user.businessProfile?.category === 'FOOD' ? 'Food & Cafe' :
                          user.businessProfile?.category === 'BOARDING' ? 'Boarding' : 'General');

    const formattedProfile = {
      id: user.id,
      name: profileName,
      businessId: isClub ? `#CLUB-${String(user.id).padStart(4, '0')}` : `#BIZ-${String(user.id).padStart(4, '0')}`,
      location: user.businessProfile?.addresses?.[0]?.city || 'Katubedda',
      isVerified: user.status === 'Active',
      logo: await resolveAvatarUrl(user.avatar, profileName),
      category: categoryLabel,
      registrationDate: moment(user.createdAt).format('MMM DD, YYYY'),
      status: user.status,
      stats: {
        revenue: { 
          label: 'Revenue Generated', 
          value: `LKR ${(totalRev / 1000000).toFixed(1)}M`, 
          badge: getTrendLabel(revThis, revLast) ? `${getTrendLabel(revThis, revLast)} ` : '', 
          badgeClass: 'text-state-success bg-state-success/10' 
        },
        ads: { 
          label: 'Ads Active', 
          value: `${activeAds} Campaigns`, 
          badge: getTrendLabel(activeAds, adsLastMonth) || 'Stable', 
          badgeClass: 'text-text-secondary bg-white/10' 
        },
        engagement: { 
          label: 'Customer Engagement', 
          value: totalReviews > 0 ? `${((sumRating / (totalReviews * 5)) * 100).toFixed(0)}%` : '0%', 
          badge: '', 
          badgeClass: 'text-text-secondary bg-white/10' 
        },
      },
      businessInfo: {
        email: user.businessProfile?.email || user.email,
        phone: user.businessProfile?.phone || user.phone || '+94 11 234 5678',
        website: user.businessProfile?.website || 'www.unify.lk',
        address: user.businessProfile?.addresses?.[0]?.fullAddress || 'Colombo 07, Sri Lanka',
      },
      sentiment: {
        ratings: [
          { stars: 5, percentage: totalReviews ? Math.round((sentimentBreakdown[5] / totalReviews) * 100) : 0, color: '#4ADE80' },
          { stars: 4, percentage: totalReviews ? Math.round((sentimentBreakdown[4] / totalReviews) * 100) : 0, color: '#2B8CEE' },
          { stars: 3, percentage: totalReviews ? Math.round((sentimentBreakdown[3] / totalReviews) * 100) : 0, color: '#FBBF24' },
          { stars: 2, percentage: totalReviews ? Math.round((sentimentBreakdown[2] / totalReviews) * 100) : 0, color: '#FF6366' },
          { stars: 1, percentage: totalReviews ? Math.round((sentimentBreakdown[1] / totalReviews) * 100) : 0, color: '#FF6366' },
        ],
        overallRating,
      },
      activityLog: logs.map(l => ({
        id: l.id,
        icon: l.icon || '📝',
        iconColor: l.iconColor || 'bg-primary-blue/20',
        title: l.title || 'Activity',
        detail: l.detail || '',
        time: moment(l.createdAt).fromNow(),
      })),
      adminNotes: user.businessProfile?.adminNotes || []
    };

    return sendResponse(res, 200, true, 'Business profile retrieved', formattedProfile);
  } catch (error) {
    logger.error(`Error in getBusinessProfile: ${error.message}`);
    next(error);
  }
};

//update business status
export const updateBusinessStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason, suspensionCategory, sendEmail } = req.body;
    const adminId = req.user?.id;

    if (!adminId) {
      return sendResponse(res, 401, false, "Admin authentication required.");
    }

    const user = await User.findByPk(id);
    if (!user || !['Business', 'Club'].includes(user.role)) {
      return sendResponse(res, 404, false, 'Business or Club not found');
    }

    if (user.status === status) {
      return sendResponse(res, 400, false, `Business is already ${status}`);
    }

    // Use UserSuspensionService to handle the logic and database records
    if (status === 'Suspended') {
      await UserSuspensionService.createSuspension({
        userId: parseInt(id),
        reason: reason || `Suspended for ${suspensionCategory || 'policy violation'}`,
        reasonTag: suspensionCategory || 'Violation of Terms',
        effectiveDate: new Date(),
        adminNotes: reason
      }, adminId);
    } else if (status === 'Active') {
      // If business was suspended, reactivate via service
      if (user.status === 'Suspended') {
        await UserSuspensionService.reactivateUser(parseInt(id), {
          identityVerificationComplete: true,
          securityAuditPassed: true,
          reactivationNotes: 'Reactivated from Business Management panel'
        }, adminId);
      } else {
        user.status = status;
        await user.save();
      }
    } else {
      user.status = status;
      await user.save();
    }

    // ── Send in-app notification to the business/club owner ──────────
    if (status === 'Suspended') {
      notifyUser({
        userId: parseInt(id),
        actorId: adminId,
        type: 'General',
        title: 'Account Suspended',
        content: `Your business account has been suspended. Reason: ${reason || suspensionCategory || 'Policy violation'}. If you believe this is an error, please contact support.`,
        referenceId: parseInt(id),
        referenceType: 'Suspension',
        dedupeKey: `admin:suspend:${id}:${Date.now()}`,
      }).catch(() => {});
    } else if (status === 'Active') {
      notifyUser({
        userId: parseInt(id),
        actorId: adminId,
        type: 'General',
        title: 'Account Reactivated 🎉',
        content: 'Your business account has been reactivated. You can now access all platform features again. Welcome back!',
        referenceId: parseInt(id),
        referenceType: 'Reactivation',
        dedupeKey: `admin:reactivate:${id}:${Date.now()}`,
      }).catch(() => {});
    }

    return sendResponse(res, 200, true, `Business status updated to ${status}`, { status: user.status });
  } catch (error) {
    logger.error(`Error in updateBusinessStatus [User: ${req.params.id}]: ${error.message}`);
    return sendResponse(res, error.statusCode || 500, false, error.message || 'Internal server error');
  }
};

//add admin note
export const addBusinessNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const adminName = req.user?.name;

    if (!adminName) {
      return sendResponse(res, 401, false, "Admin authentication required.");
    }

    const profile = await BusinessProfile.findOne({ where: { userId: id } });
    if (!profile) {
      return sendResponse(res, 404, false, 'Business profile not found');
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
    logger.error(`Error in addBusinessNote: ${error.message}`);
    next(error);
  }
};

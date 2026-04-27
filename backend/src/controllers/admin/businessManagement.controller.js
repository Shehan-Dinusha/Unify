import { Op } from 'sequelize';
import { 
  User, 
  BusinessProfile, 
  BoostCampaign, 
  UserActivityLog, 
  AdminLog, 
  Review,
  sequelize
} from '../../modules/index.js';
import { sendResponse } from '../../utils/response.js';
import logger from '../../utils/logger.js';
import moment from 'moment';

/**
 * GET /api/v1/admin/businesses
 * Retrieves the business directory with filtering and search.
 */
export const getBusinessDirectory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category, status } = req.query;
    const offset = (page - 1) * limit;

    let userWhere = { role: 'Business' };
    let profileWhere = {};

    if (search) {
      userWhere[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
      profileWhere.businessName = { [Op.iLike]: `%${search}%` };
    }

    if (status && status !== 'all') {
      userWhere.status = status;
    }

    if (category && category !== 'all') {
      profileWhere.category = category;
    }

    const { count, rows: businesses } = await User.findAndCountAll({
      where: userWhere,
      include: [{
        model: BusinessProfile,
        as: 'businessProfile',
        where: Object.keys(profileWhere).length > 0 ? { [Op.or]: [profileWhere] } : {}
      }],
      attributes: ['id', 'name', 'email', 'avatar', 'status', 'createdAt'],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    const formattedBusinesses = businesses.map(b => ({
      id: b.id,
      name: b.businessProfile?.businessName || b.name,
      email: b.email,
      avatar: b.avatar || (b.businessProfile?.businessName || b.name).substring(0, 2).toUpperCase(),
      category: b.businessProfile?.category || 'General',
      registrationDate: moment(b.createdAt).format('MMM DD, YYYY'),
      status: b.status
    }));

    return sendResponse(res, 200, true, 'Business directory retrieved', {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      businesses: formattedBusinesses
    });
  } catch (error) {
    logger.error(`Error in getBusinessDirectory: ${error.message}`);
    next(error);
  }
};

/**
 * GET /api/v1/admin/businesses/stats
 * Dashboard statistics for Business Management.
 */
export const getBusinessStats = async (req, res, next) => {
  try {
    const verifiedBusinesses = await User.count({ where: { role: 'Business', status: 'Active' } });
    const pendingApprovals = await User.count({ where: { role: 'Business', status: 'Suspended' } }); // Mock logic: Suspended = Pending for this UI
    
    // Financial Mocks as per frontend parity
    const avgSubscription = 8000;
    const retentionRate = 98.2;

    return sendResponse(res, 200, true, 'Business stats retrieved', {
      verifiedBusinesses: verifiedBusinesses > 1000 ? `${(verifiedBusinesses / 1000).toFixed(1)}k` : verifiedBusinesses,
      pendingApprovals,
      avgSubscription: `Rs. ${avgSubscription}`,
      retentionRate: `${retentionRate}%`
    });
  } catch (error) {
    logger.error(`Error in getBusinessStats: ${error.message}`);
    next(error);
  }
};

/**
 * GET /api/v1/admin/businesses/:id
 * Detailed business profile for Admin view.
 */
export const getBusinessProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { id, role: 'Business' },
      include: [{
        model: BusinessProfile,
        as: 'businessProfile'
      }]
    });

    if (!user) {
      return sendResponse(res, 404, false, 'Business not found');
    }

    // Aggregates
    const [revenueGenerated, activeAds, reviewStats] = await Promise.all([
      Promise.resolve(4200000), // Mock 4.2M LKR
      BoostCampaign.count({ where: { userId: id, status: 'Active' } }),
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

    const formattedProfile = {
      header: {
        id: `#${String(user.id).padStart(6, '0')}`,
        name: user.businessProfile?.businessName || user.name,
        location: user.businessProfile?.addresses?.[0]?.city || 'Katubedda',
        status: user.status
      },
      summary: {
        revenueGenerated: `LKR ${(revenueGenerated / 1000000).toFixed(1)}M`,
        adsActive: `${activeAds} Campaigns`,
        customerEngagement: '89%' // Mock
      },
      info: {
        primaryEmail: user.businessProfile?.email || user.email,
        phone: user.businessProfile?.phone || user.phone || '+94 11 234 5678',
        website: user.businessProfile?.website || 'www.unify.lk',
        address: user.businessProfile?.addresses?.[0]?.fullAddress || 'Colombo 07, Sri Lanka'
      },
      activityLog: logs.map(l => ({
        icon: l.icon || '📝',
        description: l.detail || l.title,
        time: moment(l.createdAt).fromNow()
      })),
      sentiment: {
        breakdown: sentimentBreakdown,
        overallRating,
        totalReviews
      },
      internalNotes: user.businessProfile?.adminNotes || []
    };

    return sendResponse(res, 200, true, 'Business profile retrieved', formattedProfile);
  } catch (error) {
    logger.error(`Error in getBusinessProfile: ${error.message}`);
    next(error);
  }
};

/**
 * PUT /api/v1/admin/businesses/:id/status
 */
export const updateBusinessStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason, suspensionCategory, sendEmail } = req.body;
    const adminId = req.user?.id || 1;

    const user = await User.findByPk(id);
    if (!user || user.role !== 'Business') {
      return sendResponse(res, 404, false, 'Business not found');
    }

    if (user.status === status) {
      return sendResponse(res, 400, false, `Business is already ${status}`);
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

    return sendResponse(res, 200, true, `Business status updated to ${status}`, { status: user.status });
  } catch (error) {
    logger.error(`Error in updateBusinessStatus: ${error.message}`);
    next(error);
  }
};

/**
 * POST /api/v1/admin/businesses/:id/notes
 */
export const addBusinessNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const adminName = req.user?.name || 'Admin';

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

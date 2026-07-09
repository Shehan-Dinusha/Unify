import { Op } from 'sequelize';
import { sequelize } from "../../modules/index.js";
import BoostCampaign from "../../modules/BoostCampaign.model.js";
import BoostPackage from "../../modules/BoostPackage.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

//Handle admin retrieval of boost system statistics.
export const getBoostStatistics = async (req, res, next) => {
  try {
    // 1. Date Ranges for Trends
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // 2. Active packages count
    const activePackages = await BoostPackage.count({
      where: { status: 'live' },
    });

    // 3. Monthly Revenue (Current vs Previous)
    const currentRevenueResult = await BoostCampaign.sum('total', {
      where: {
        paymentStatus: 'completed',
        createdAt: { [Op.gte]: thirtyDaysAgo },
      },
    });
    const currentRevenue = currentRevenueResult || 0;

    const previousRevenueResult = await BoostCampaign.sum('total', {
      where: {
        paymentStatus: 'completed',
        createdAt: { [Op.gte]: sixtyDaysAgo, [Op.lt]: thirtyDaysAgo },
      },
    });
    const previousRevenue = previousRevenueResult || 0;

    let revenueTrend = 0;
    if (previousRevenue > 0) {
      revenueTrend = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    } else if (currentRevenue > 0) {
      revenueTrend = 100;
    }

    // 4. Total Boosts (Current vs Previous)
    const currentBoosts = await BoostCampaign.count({
      where: {
        createdAt: { [Op.gte]: thirtyDaysAgo },
      },
    });

    const previousBoosts = await BoostCampaign.count({
      where: {
        createdAt: { [Op.gte]: sixtyDaysAgo, [Op.lt]: thirtyDaysAgo },
      },
    });

    let boostsTrend = 0;
    if (previousBoosts > 0) {
      boostsTrend = ((currentBoosts - previousBoosts) / previousBoosts) * 100;
    } else if (currentBoosts > 0) {
      boostsTrend = 100;
    }

    // 5. Average campaign duration
    const avgDurationResult = await BoostCampaign.findAll({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('durationDays')), 'avgDuration'],
      ],
      raw: true,
    });
    const avgDuration = avgDurationResult[0]?.avgDuration
      ? parseFloat(avgDurationResult[0].avgDuration).toFixed(1)
      : '0.0';

    // 6. Campaign counts by status
    const activeCampaigns = await BoostCampaign.count({ where: { status: 'Active' } });
    const pendingCampaigns = await BoostCampaign.count({ where: { status: 'Pending' } });
    const completedCampaigns = await BoostCampaign.count({ where: { status: 'Completed' } });

    // Trend Formatter Helper
    const formatTrend = (value) => {
      if (value > 0) return { change: `↑${Math.round(value)}%`, changeColor: 'text-state-success' };
      if (value < 0) return { change: `↓${Math.abs(Math.round(value))}%`, changeColor: 'text-state-error' };
      return { change: '~0%', changeColor: 'text-text-secondary' };
    };

    const stats = {
      activePackages: {
        value: String(activePackages),
        change: '~0%',
        changeColor: 'text-text-secondary'
      },
      monthlyRevenue: {
        value: `Rs. ${currentRevenue.toLocaleString()}`,
        ...formatTrend(revenueTrend)
      },
      totalBoosts30d: {
        value: String(currentBoosts),
        ...formatTrend(boostsTrend)
      },
      avgDuration: {
        value: `${avgDuration} Days`,
        change: 'Stable',
        changeColor: 'text-text-secondary'
      },
      campaignsByStatus: {
        active: activeCampaigns,
        pending: pendingCampaigns,
        completed: completedCampaigns,
      },
    };

    return sendResponse(res, 200, true, 'Boost statistics retrieved successfully', stats);
  } catch (error) {
    logger.error(`Error in getBoostStatistics controller: ${error.message}`);
    next(error);
  }
};

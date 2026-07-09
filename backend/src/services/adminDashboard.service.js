import { Op, fn, col, literal } from 'sequelize';
import {
  User,
  BusinessProfile,
  ClubProfile,
  Transaction,
  Report,
  StudentReport,
  BoostPurchase,
  sequelize,
} from '../modules/index.js';
import moment from 'moment';
import logger from '../utils/logger.js';

// ─── In-memory cache with TTL ────────────────────────────────────────────────
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCached = (key) => {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry.data;
  cache.delete(key);
  return null;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export const getDashboardStats = async () => {
  const cacheKey = 'dashboard_stats';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const startOfThisMonth = moment().startOf('month').toDate();
  const startOfLastMonth = moment().subtract(1, 'month').startOf('month').toDate();
  const startOfThisSemester = moment().subtract(6, 'months').toDate();
  const startOfLastSemester = moment().subtract(12, 'months').toDate();

  const [
    totalStudentUsers,
    studentsLastSemester,
    boostRevenue,
    boostRevenueLastMonth,
    activeBusinesses,
    businessesLastYear,
  ] = await Promise.all([
    // Total student users
    User.count({ where: { role: 'Student' } }),
    // Students from last semester for trend
    User.count({
      where: {
        role: 'Student',
        createdAt: { [Op.lt]: startOfThisSemester, [Op.gte]: startOfLastSemester },
      },
    }),
    // Business Boost Revenue — from BoostPurchase table
    BoostPurchase.sum('amount', {
      where: { status: { [Op.in]: ['active', 'expired', 'used'] } },
    }),
    // Boost revenue last month
    BoostPurchase.sum('amount', {
      where: {
        status: { [Op.in]: ['active', 'expired', 'used'] },
        createdAt: { [Op.lt]: startOfThisMonth, [Op.gte]: startOfLastMonth },
      },
    }),
    // Active businesses (Business + Club roles, status Active)
    User.count({
      where: {
        role: { [Op.in]: ['Business', 'Club'] },
        status: 'Active',
      },
    }),
    // Businesses from last year for trend
    User.count({
      where: {
        role: { [Op.in]: ['Business', 'Club'] },
        status: 'Active',
        createdAt: { [Op.lt]: moment().subtract(1, 'year').toDate() },
      },
    }),
  ]);

  const currentBoostRevenue = boostRevenue || 0;
  const lastMonthBoostRevenue = boostRevenueLastMonth || 0;

  // Trend helper — returns a clean signed string like '+12' or '-5'
  const calcTrend = (current, previous) => {
    if (previous > 0) {
      const pct = (((current - previous) / previous) * 100).toFixed(0);
      return Number(pct) >= 0 ? `+${pct}` : String(pct);
    }
    return current > 0 ? '+100' : '0';
  };

  const studentTrendVal = calcTrend(totalStudentUsers, studentsLastSemester);
  const boostTrendVal = calcTrend(currentBoostRevenue, lastMonthBoostRevenue);
  const bizTrendVal = calcTrend(activeBusinesses, businessesLastYear);

  // Compact currency formatter
  const fmtCompact = (v) => {
    if (v >= 1000000) return `Rs. ${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `Rs. ${(v / 1000).toFixed(1)}K`;
    return `Rs. ${v}`;
  };

  const result = {
    totalStudentUsers,
    totalStudentUsersFormatted: totalStudentUsers >= 1000
      ? totalStudentUsers.toLocaleString()
      : String(totalStudentUsers),
    studentTrend: `↗ ${studentTrendVal}% vs last semester`,
    businessBoostRevenue: currentBoostRevenue,
    businessBoostRevenueFormatted: fmtCompact(currentBoostRevenue),
    boostTrend: `↑ ${boostTrendVal}% this month`,
    activeBusinesses,
    activeBusinessesFormatted: String(activeBusinesses),
    bizTrend: `↗ ${bizTrendVal}% this year`,
    lastUpdated: new Date().toISOString(),
  };

  setCache(cacheKey, result);
  return result;
};

// ─── Platform Growth ──────────────────────────────────────────────────────────

export const getPlatformGrowth = async (range = 'month') => {
  const cacheKey = `platform_growth_${range}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  let startDate, endDate, groupBy;
  const now = moment();

  if (range === 'yearly') {
    startDate = now.clone().startOf('year').toDate();
    endDate = now.clone().endOf('year').toDate();
    groupBy = 'month';
  } else if (range === '30days') {
    startDate = now.clone().subtract(30, 'days').startOf('day').toDate();
    endDate = now.clone().endOf('day').toDate();
    groupBy = 'week';
  } else {
    // 'month' — current calendar month
    startDate = now.clone().startOf('month').toDate();
    endDate = now.clone().endOf('month').toDate();
    groupBy = 'week';
  }

  let registrations, revenueData, businessData;

  if (groupBy === 'month') {
    // Yearly view — group by month
    const [regRows] = await sequelize.query(`
      SELECT EXTRACT(MONTH FROM "createdAt") AS period,
             COUNT(*) AS count
      FROM users
      WHERE "createdAt" >= :startDate AND "createdAt" <= :endDate
      GROUP BY period ORDER BY period
    `, { replacements: { startDate, endDate } });

    const [revRows] = await sequelize.query(`
      SELECT period, COALESCE(SUM(total), 0) AS total FROM (
        SELECT EXTRACT(MONTH FROM "createdAt") AS period, amount AS total
        FROM transactions
        WHERE "createdAt" >= :startDate AND "createdAt" <= :endDate AND status = 'COMPLETED'
        UNION ALL
        SELECT EXTRACT(MONTH FROM "createdAt") AS period, amount AS total
        FROM boost_purchases
        WHERE "createdAt" >= :startDate AND "createdAt" <= :endDate
      ) combined
      GROUP BY period ORDER BY period
    `, { replacements: { startDate, endDate } });

    const [bizRows] = await sequelize.query(`
      SELECT EXTRACT(MONTH FROM "createdAt") AS period,
             COUNT(*) AS count
      FROM users
      WHERE role IN ('Business', 'Club')
        AND "createdAt" >= :startDate AND "createdAt" <= :endDate
      GROUP BY period ORDER BY period
    `, { replacements: { startDate, endDate } });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const regMap = Object.fromEntries(regRows.map(r => [parseInt(r.period), parseInt(r.count)]));
    const revMap = Object.fromEntries(revRows.map(r => [parseInt(r.period), parseFloat(r.total)]));
    const bizMap = Object.fromEntries(bizRows.map(r => [parseInt(r.period), parseInt(r.count)]));

    registrations = monthNames.map((name, i) => ({
      label: name,
      registrations: regMap[i + 1] || 0,
      revenue: revMap[i + 1] || 0,
      businesses: bizMap[i + 1] || 0,
    }));
  } else {
    // Weekly view
    const weekCount = range === '30days' ? 5 : 4;

    const [regRows] = await sequelize.query(`
      SELECT FLOOR((EXTRACT(DOY FROM "createdAt") - EXTRACT(DOY FROM :startDate::timestamp)) / 7) + 1 AS week_num,
             COUNT(*) AS count
      FROM users
      WHERE "createdAt" >= :startDate AND "createdAt" <= :endDate
      GROUP BY week_num ORDER BY week_num
    `, { replacements: { startDate, endDate } });

    const [revRows] = await sequelize.query(`
      SELECT week_num, COALESCE(SUM(total), 0) AS total FROM (
        SELECT FLOOR((EXTRACT(DOY FROM "createdAt") - EXTRACT(DOY FROM :startDate::timestamp)) / 7) + 1 AS week_num,
               amount AS total
        FROM transactions
        WHERE "createdAt" >= :startDate AND "createdAt" <= :endDate AND status = 'COMPLETED'
        UNION ALL
        SELECT FLOOR((EXTRACT(DOY FROM "createdAt") - EXTRACT(DOY FROM :startDate::timestamp)) / 7) + 1 AS week_num,
               amount AS total
        FROM boost_purchases
        WHERE "createdAt" >= :startDate AND "createdAt" <= :endDate
      ) combined
      GROUP BY week_num ORDER BY week_num
    `, { replacements: { startDate, endDate } });

    const [bizRows] = await sequelize.query(`
      SELECT FLOOR((EXTRACT(DOY FROM "createdAt") - EXTRACT(DOY FROM :startDate::timestamp)) / 7) + 1 AS week_num,
             COUNT(*) AS count
      FROM users
      WHERE role IN ('Business', 'Club')
        AND "createdAt" >= :startDate AND "createdAt" <= :endDate
      GROUP BY week_num ORDER BY week_num
    `, { replacements: { startDate, endDate } });

    const regMap = Object.fromEntries(regRows.map(r => [parseInt(r.week_num), parseInt(r.count)]));
    const revMap = Object.fromEntries(revRows.map(r => [parseInt(r.week_num), parseFloat(r.total)]));
    const bizMap = Object.fromEntries(bizRows.map(r => [parseInt(r.week_num), parseInt(r.count)]));

    const labels = range === '30days'
      ? ['W1', 'W2', 'W3', 'W4', 'W5']
      : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

    registrations = labels.map((label, i) => ({
      label,
      registrations: regMap[i + 1] || 0,
      revenue: revMap[i + 1] || 0,
      businesses: bizMap[i + 1] || 0,
    }));
  }

  // Compute totals and chart metadata for each slide type
  const regData = registrations.map(r => r.registrations);
  const revData = registrations.map(r => r.revenue);
  const bizData = registrations.map(r => r.businesses);

  const computeChartMeta = (data, type) => {
    const maxDataVal = Math.max(...data, 1);
    const peakIdx = data.indexOf(Math.max(...data));

    let maxVal, yLabels, yVals;
    if (type === 'revenue') {
      maxVal = Math.ceil(maxDataVal / 1000) * 1000 + 500;
      if (maxVal < 4500) maxVal = 4500;
      const step = Math.ceil(maxVal / 4);
      yVals = [];
      yLabels = [];
      for (let v = maxVal; v >= 0; v -= step) {
        yVals.push(v);
        yLabels.push(v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v));
      }
      if (yVals[yVals.length - 1] !== 0) { yVals.push(0); yLabels.push('0'); }
    } else if (type === 'business') {
      maxVal = Math.max(Math.ceil(maxDataVal / 10) * 10 + 10, 30);
      const step = Math.ceil(maxVal / 3);
      yVals = [];
      yLabels = [];
      for (let v = maxVal; v >= 0; v -= step) {
        yVals.push(v);
        yLabels.push(String(v));
      }
      if (yVals[yVals.length - 1] !== 0) { yVals.push(0); yLabels.push('0'); }
    } else {
      maxVal = Math.max(Math.ceil(maxDataVal / 100) * 100 + 100, 500);
      const step = Math.ceil(maxVal / 4);
      yVals = [];
      yLabels = [];
      for (let v = maxVal; v >= 0; v -= step) {
        yVals.push(v);
        yLabels.push(v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v));
      }
      if (yVals[yVals.length - 1] !== 0) { yVals.push(0); yLabels.push('0'); }
    }

    return { maxVal, peakIdx, yLabels, yVals };
  };

  const totalUsers = await User.count();
  const txnRevenue = (await Transaction.sum('amount', { where: { status: 'COMPLETED' } })) || 0;
  const boostRevTotal = (await BoostPurchase.sum('amount')) || 0;
  const totalRevenue = txnRevenue + boostRevTotal;
  const totalBiz = await User.count({ where: { role: { [Op.in]: ['Business', 'Club'] } } });

  const regMeta = computeChartMeta(regData, 'registration');
  const revMeta = computeChartMeta(revData, 'revenue');
  const bizMeta = computeChartMeta(bizData, 'business');

  const result = {
    labels: registrations.map(r => r.label),
    slides: [
      {
        title: 'Platform Growth',
        description: groupBy === 'month'
          ? 'Monthly new user registrations across the platform'
          : `Weekly new user registrations ${range === '30days' ? 'over the last 30 days' : 'this month'}`,
        legend: groupBy === 'month' ? 'Total Registrations' : 'Registrations',
        data: regData,
        ...regMeta,
        statLabel: 'Total Users',
        formatType: 'number',
        statTotal: totalUsers,
      },
      {
        title: 'Revenue Growth',
        description: groupBy === 'month'
          ? 'Monthly platform revenue for the fiscal year'
          : `Weekly platform revenue ${range === '30days' ? 'over the last 30 days' : 'this month'}`,
        legend: groupBy === 'month' ? 'Monthly Revenue' : 'Weekly Revenue',
        data: revData,
        ...revMeta,
        statLabel: 'Total Revenue',
        formatType: 'currency',
        statTotal: totalRevenue,
      },
      {
        title: 'Business Growth',
        description: groupBy === 'month'
          ? 'Monthly new business registrations on the platform'
          : `Weekly new business registrations ${range === '30days' ? 'over the last 30 days' : 'this month'}`,
        legend: 'New Businesses',
        data: bizData,
        ...bizMeta,
        statLabel: 'Total Businesses',
        formatType: 'number',
        statTotal: totalBiz,
      },
    ],
    lastUpdated: new Date().toISOString(),
  };

  setCache(cacheKey, result);
  return result;
};

// ─── Content Moderation ───────────────────────────────────────────────────────

export const getContentModeration = async () => {
  const cacheKey = 'content_moderation';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Combine both Report and StudentReport tables
  const [reportCounts] = await sequelize.query(`
    SELECT status, COUNT(*) AS count FROM (
      SELECT CASE
        WHEN status IN ('Resolved', 'Dismissed') THEN 'resolved'
        WHEN status = 'In Progress' THEN 'reviewing'
        WHEN status = 'Pending Review' THEN 'pending'
        ELSE 'other'
      END AS status
      FROM student_reports 
      WHERE "deletedAt" IS NULL 
        AND status != 'Withdrawn'
    ) combined
    WHERE status != 'other'
    GROUP BY status
  `);

  const counts = { resolved: 0, reviewing: 0, pending: 0 };
  reportCounts.forEach(r => { counts[r.status] = parseInt(r.count); });

  const total = counts.resolved + counts.reviewing + counts.pending;

  const result = { total, ...counts, lastUpdated: new Date().toISOString() };
  setCache(cacheKey, result);
  return result;
};

// ─── Business Engagement ──────────────────────────────────────────────────────

export const getBusinessEngagement = async () => {
  const cacheKey = 'business_engagement';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const categories = [
    { label: 'Food & Cafe', dbCategory: 'FOOD', color: '#2B8CEE' },
    { label: 'Boarding', dbCategory: 'BOARDING', color: '#FF6366' },
    { label: 'Self Employed', dbCategory: 'SELF_EMPLOYED', color: '#4ADE80' },
    { label: 'Clubs & Society', dbCategory: null, color: '#9CA3AF' },
  ];

  const result = [];
  for (const cat of categories) {
    let count;
    if (cat.dbCategory) {
      count = await User.count({
        where: { role: 'Business', status: 'Active' },
        include: [{
          model: BusinessProfile,
          as: 'businessProfile',
          required: true,
          where: { category: cat.dbCategory },
        }],
      });
    } else {
      count = await User.count({
        where: { role: 'Club', status: 'Active' },
      });
    }
    result.push({ label: cat.label, value: count, color: cat.color });
  }

  setCache(cacheKey, result);
  return result;
};

// ─── Revenue Overview Stats ──────────────────────────────────────────────────

export const getRevenueOverviewStats = async () => {
  const cacheKey = 'revenue_overview_stats';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const startOfThisYear = moment().startOf('year').toDate();
  const startOfThisMonth = moment().startOf('month').toDate();
  const startOfLastMonth = moment().subtract(1, 'month').startOf('month').toDate();
  const endOfLastMonth = moment().subtract(1, 'month').endOf('month').toDate();
  const startOfLastSemester = moment().subtract(6, 'months').toDate();

  const [
    totalRevenue, bizBoosts, activeUserCount, lastSemesterRevenue,
    boostsThisMonth, boostsLastMonth,
    lastYearRevenue,
  ] = await Promise.all([
    Transaction.sum('amount', {
      where: { type: 'CREDIT', status: 'COMPLETED', createdAt: { [Op.gte]: startOfThisYear } },
    }),
    BoostPurchase.sum('amount', {
      where: { status: { [Op.in]: ['active', 'expired', 'used'] } },
    }),
    User.count({ where: { status: 'Active' } }),
    Transaction.sum('amount', {
      where: {
        type: 'CREDIT', status: 'COMPLETED',
        createdAt: { [Op.gte]: startOfLastSemester, [Op.lt]: startOfThisYear },
      },
    }),
    BoostPurchase.sum('amount', {
      where: { createdAt: { [Op.gte]: startOfThisMonth } },
    }),
    BoostPurchase.sum('amount', {
      where: { createdAt: { [Op.gte]: startOfLastMonth, [Op.lte]: endOfLastMonth } },
    }),
    Transaction.sum('amount', {
      where: {
        type: 'CREDIT', status: 'COMPLETED',
        createdAt: { [Op.gte]: moment().subtract(1, 'year').startOf('year').toDate(), [Op.lt]: startOfThisYear },
      },
    }),
  ]);

  const txnRevenue = totalRevenue || 0;
  const boosts = bizBoosts || 0;
  const total = txnRevenue + boosts; // Total Revenue = transactions + boost purchases
  const avgSpend = activeUserCount > 0 ? Math.round(total / activeUserCount) : 0;
  const lastSem = lastSemesterRevenue || 0;
  const boostsM = boostsThisMonth || 0;
  const boostsLM = boostsLastMonth || 0;
  const lastYr = lastYearRevenue || 0;

  // Compact currency formatter
  const fmtCompact = (v) => {
    if (v >= 1000000) return `Rs. ${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `Rs. ${(v / 1000).toFixed(1)}K`;
    return `Rs. ${v}`;
  };

  // Trend helper
  const makeTrend = (current, previous, label) => {
    if (previous > 0) {
      const pct = (((current - previous) / previous) * 100).toFixed(1);
      const num = parseFloat(pct);
      const arrow = num >= 0 ? '↗' : '↘';
      return {
        text: `${arrow} ${num >= 0 ? '+' : ''}${pct}% ${label}`,
        cls: num >= 0 ? 'text-state-success' : 'text-state-error',
      };
    }
    if (current > 0) return { text: `↗ +100% ${label}`, cls: 'text-state-success' };
    return { text: `— 0% ${label}`, cls: 'text-text-secondary' };
  };

  const revT = makeTrend(total, lastSem, 'vs last semester');
  const boostT = makeTrend(boostsM, boostsLM, 'vs last month');

  // Avg spend trend vs last year
  const lastYrAvg = lastYr > 0 && activeUserCount > 0 ? Math.round(lastYr / activeUserCount) : 0;
  const avgT = makeTrend(avgSpend, lastYrAvg, 'vs last year');

  // Projected annual
  const monthsElapsed = moment().diff(moment().startOf('year'), 'months', true) || 1;
  const projectedAnnual = Math.round((total / monthsElapsed) * 12);
  const projT = makeTrend(projectedAnnual, lastYr, 'vs last year');

  const result = {
    totalRevenue: total,
    totalRevenueFormatted: fmtCompact(total),
    totalRevenueTrend: revT.text,
    totalRevenueTrendClass: revT.cls,
    bizBoosts: boosts,
    bizBoostsFormatted: fmtCompact(boosts),
    bizBoostsTrend: boostT.text,
    bizBoostsTrendClass: boostT.cls,
    avgSpend,
    avgSpendFormatted: fmtCompact(avgSpend),
    avgSpendTrend: avgT.text,
    avgSpendTrendClass: avgT.cls,
    projectedAnnual,
    projectedAnnualFormatted: fmtCompact(projectedAnnual),
    projectedAnnualTrend: projT.text,
    projectedAnnualTrendClass: projT.cls,
    lastUpdated: new Date().toISOString(),
  };

  setCache(cacheKey, result);
  return result;
};

// ─── Revenue Trajectory ──────────────────────────────────────────────────────

export const getRevenueTrajectory = async (year) => {
  const targetYear = year || moment().year();
  const cacheKey = `revenue_trajectory_${targetYear}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const startDate = new Date(`${targetYear}-01-01`);
  const endDate = new Date(`${targetYear}-12-31T23:59:59`);

  const [rows] = await sequelize.query(`
    SELECT month_num, COALESCE(SUM(total), 0) AS total FROM (
      SELECT EXTRACT(MONTH FROM "createdAt") AS month_num, amount AS total
      FROM transactions
      WHERE "createdAt" >= :startDate AND "createdAt" <= :endDate
        AND status = 'COMPLETED' AND type = 'CREDIT'
      UNION ALL
      SELECT EXTRACT(MONTH FROM "createdAt") AS month_num, amount AS total
      FROM boost_purchases
      WHERE "createdAt" >= :startDate AND "createdAt" <= :endDate
    ) combined
    GROUP BY month_num ORDER BY month_num
  `, { replacements: { startDate, endDate } });

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenueMap = Object.fromEntries(rows.map(r => [parseInt(r.month_num), parseFloat(r.total)]));
  const actual = monthNames.map((_, i) => revenueMap[i + 1] || 0);

  // Linear regression for projection using months with data
  const currentMonth = moment().month(); // 0-indexed
  const dataPoints = actual.slice(0, currentMonth + 1);
  const n = dataPoints.length || 1;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i; sumY += dataPoints[i]; sumXY += i * dataPoints[i]; sumX2 += i * i;
  }
  const slope = n > 1 ? (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX) : 0;
  const intercept = (sumY - slope * sumX) / n;
  const projected = monthNames.map((_, i) => Math.max(0, Math.round(intercept + slope * i)));

  // Auto-detect scale: K or M based on actual data magnitude
  const maxActual = Math.max(...actual, 1);
  const maxProjected = Math.max(...projected, 1);
  const maxAll = Math.max(maxActual, maxProjected);

  let divisor, suffix;
  if (maxAll >= 1000000) {
    divisor = 1000000; suffix = 'M';
  } else if (maxAll >= 1000) {
    divisor = 1000; suffix = 'K';
  } else {
    divisor = 1; suffix = '';
  }

  // Round up maxVal to a clean number in the chosen unit
  const maxInUnit = maxAll / divisor;
  const ceilMax = Math.ceil(maxInUnit * 1.2); // 20% headroom
  const maxVal = Math.max(ceilMax, 1);

  const actualNorm = actual.map(v => parseFloat((v / divisor).toFixed(2)));
  const projectedNorm = projected.map(v => parseFloat((v / divisor).toFixed(2)));

  // Generate yAxis labels (6 steps)
  const ySteps = 5;
  const yStep = maxVal / ySteps;
  const yAxisLabels = [];
  for (let i = ySteps; i >= 0; i--) {
    const v = parseFloat((yStep * i).toFixed(1));
    yAxisLabels.push(suffix ? `${v}${suffix}` : String(v));
  }

  const result = {
    months: monthNames,
    actual: actualNorm,
    projected: projectedNorm,
    actualRaw: actual,
    projectedRaw: projected,
    maxVal,
    yAxisLabels,
    totalRevenue: actual.reduce((a, b) => a + b, 0),
    lastUpdated: new Date().toISOString(),
  };

  setCache(cacheKey, result);
  return result;
};

// ─── Revenue Breakdown ───────────────────────────────────────────────────────

export const getRevenueBreakdown = async () => {
  const cacheKey = 'revenue_breakdown';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Query transactions grouped by category
  const [txnRows] = await sequelize.query(`
    SELECT category, COALESCE(SUM(amount), 0) AS total
    FROM transactions WHERE status = 'COMPLETED'
    GROUP BY category
  `);

  // Query boost purchases separately (they're in a different table)
  const boostTotal = (await BoostPurchase.sum('amount')) || 0;

  // Build revenue sources from actual DB data
  const colorPalette = ['#2B8CEE', '#6A3093', '#FBBF24', '#4ADE80', '#FF6366', '#9CA3AF'];
  const sources = [];
  let colorIdx = 0;

  // Add boost purchases as 'Biz Boosts'
  if (boostTotal > 0) {
    sources.push({ label: 'Biz Boosts', rawValue: boostTotal, color: colorPalette[colorIdx++] });
  }

  // Add each transaction category
  const labelMap = {
    'General': 'Platform Revenue',
    'Club Tickets': 'Club Tickets',
    'Merchandise': 'Merchandise',
    'Donation': 'Donations',
    'Platform Fee': 'Platform Fees',
  };

  for (const row of txnRows) {
    const val = parseFloat(row.total);
    if (val <= 0) continue;
    sources.push({
      label: labelMap[row.category] || row.category,
      rawValue: val,
      color: colorPalette[colorIdx % colorPalette.length],
    });
    colorIdx++;
  }

  // If no data at all, show a placeholder
  if (sources.length === 0) {
    sources.push({ label: 'No Revenue', rawValue: 0, color: '#6B7280' });
  }

  const grandTotal = sources.reduce((sum, s) => sum + s.rawValue, 0) || 1;

  const segments = sources.map(s => ({
    ...s,
    value: Math.round((s.rawValue / grandTotal) * 100),
  }));

  // Ensure percentages sum to 100
  const totalPct = segments.reduce((s, seg) => s + seg.value, 0);
  if (totalPct !== 100 && segments.length > 0) {
    segments[0].value += (100 - totalPct);
  }

  // Compact formatting
  const fmtCompact = (v) => {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
    return String(Math.round(v));
  };

  const result = {
    segments,
    totalRevenue: grandTotal,
    totalRevenueFormatted: fmtCompact(grandTotal),
    lastUpdated: new Date().toISOString(),
  };

  setCache(cacheKey, result);
  return result;
};

// ─── Pure Helper Functions (extracted from controllers for testability) ──────

export function formatStudentForDirectory(user, faculty) {
  return {
    id: user.id,
    name: user.name,
    status: user.status,
    faculty: faculty?.name || 'Unknown',
    lastActive: user.lastActive ? moment(user.lastActive).fromNow() : 'Never',
  };
}

export function isStatusChangeRedundant(currentStatus, targetStatus) {
  return currentStatus === targetStatus;
}

export function canForceLogout(isOnline) {
  return isOnline === true;
}

export function canSendWarning(userStatus) {
  return userStatus !== 'Suspended';
}

export default {
  getDashboardStats,
  getPlatformGrowth,
  getContentModeration,
  getBusinessEngagement,
  getRevenueOverviewStats,
  getRevenueTrajectory,
  getRevenueBreakdown,
};

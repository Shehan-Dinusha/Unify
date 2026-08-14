/**
 * Safe Shared Database Seeder
 * 
 * ONLY INSERTS new data — never deletes or modifies existing records.
 * Uses findOrCreate / ignoreDuplicates to be idempotent (safe to re-run).
 * 
 * Seeds:
 *  1. Boost Packages (6 packages: 3 tier-based + 3 admin packs)
 *  2. Social Reports (3 reports)
 *  3. Student Reports (3 reports)
 * 
 * Run: docker exec unify-backend node src/controllers/base/seedSharedDb.js
 */

import sequelize from '../../config/database.js';
import {
  BoostPackage,
  BoostLog,
  Report,
  StudentReport,
} from '../../modules/index.js';
import moment from 'moment';
import logger from '../../utils/logger.js';

async function seedSharedDb() {
  try {
    await sequelize.authenticate();
    logger.info('✅ Connected to shared database.');

    // ═══════════════════════════════════════════════════════════════════════
    // 1. BOOST PACKAGES (findOrCreate — safe for existing data)
    // ═══════════════════════════════════════════════════════════════════════

    logger.info('Seeding boost packages...');

    // --- Tier-based packages (from seedBoostData) ---
    const [starterPkg] = await BoostPackage.findOrCreate({
      where: { id: 'PKG-SEED-STARTER' },
      defaults: {
        id: 'PKG-SEED-STARTER',
        name: 'Starter Boost',
        price: 1000,
        durationValue: 24,
        durationUnit: 'Hours',
        description: 'Get your post noticed with basic promotion. Ideal for first-time advertisers.',
        badge: 'No Badge',
        features: [
          'Priority #7 Feed Placement',
          'Sponsored Label on Post',
          '24 Hours Promotion Period',
        ],
        boostConfig: {
          feedPriority: 7,
          visibilityMultiplier: 1,
          highlightStyle: 'subtle',
          crossCategoryReach: false,
          analyticsAccess: false,
          autoRefreshHours: 0,
        },
        status: 'live',
      },
    });
    logger.info(`  ✅ Starter Boost: ${starterPkg.id}`);

    const [growthPkg] = await BoostPackage.findOrCreate({
      where: { id: 'PKG-SEED-GROWTH' },
      defaults: {
        id: 'PKG-SEED-GROWTH',
        name: 'Growth Boost',
        price: 2500,
        durationValue: 3,
        durationUnit: 'Days',
        description: 'Maximize your reach with priority placement and 2x visibility. Perfect for promotions.',
        badge: 'Most Popular',
        features: [
          'Priority #3 Feed Placement',
          '2x Visibility Boost',
          'Blue Highlighted Card + Badge',
          'Boost Analytics Dashboard',
          'Auto-Refresh Every 12 Hours',
          '3 Days Promotion Period',
        ],
        boostConfig: {
          feedPriority: 3,
          visibilityMultiplier: 2,
          highlightStyle: 'blue',
          crossCategoryReach: false,
          analyticsAccess: true,
          autoRefreshHours: 12,
        },
        status: 'live',
      },
    });
    logger.info(`  ✅ Growth Boost: ${growthPkg.id}`);

    const [dominatePkg] = await BoostPackage.findOrCreate({
      where: { id: 'PKG-SEED-DOMINATE' },
      defaults: {
        id: 'PKG-SEED-DOMINATE',
        name: 'Dominate Boost',
        price: 5000,
        durationValue: 7,
        durationUnit: 'Days',
        description: 'Total domination. Your post is #1 in every feed, with gold styling and full analytics.',
        badge: 'Premium',
        features: [
          'Always #1 in Feed',
          '3x Visibility Boost',
          '⚡ Gold Premium Card Styling',
          'Appears in All Category Feeds',
          'Boost Analytics Dashboard',
          'Auto-Refresh Every 6 Hours',
          '7 Days Promotion Period',
        ],
        boostConfig: {
          feedPriority: 1,
          visibilityMultiplier: 3,
          highlightStyle: 'gold',
          crossCategoryReach: true,
          analyticsAccess: true,
          autoRefreshHours: 6,
        },
        status: 'live',
      },
    });
    logger.info(`  ✅ Dominate Boost: ${dominatePkg.id}`);

    // --- Admin-tier packages (from seed_admin_data) ---
    await BoostPackage.bulkCreate([
      {
        id: 'Premium',
        name: 'Premium Pack',
        price: 50000,
        durationValue: 30,
        durationUnit: 'Days',
        description: 'Premium 30-day boost package for maximum business exposure.',
        badge: 'Premium',
        features: [
          'Always #1 in Feed',
          '3x Visibility Boost',
          'Gold Premium Card Styling',
          'Cross-Category Reach',
          'Full Analytics Dashboard',
          '30 Days Promotion Period',
        ],
        boostConfig: {
          feedPriority: 1,
          visibilityMultiplier: 3,
          highlightStyle: 'gold',
          crossCategoryReach: true,
          analyticsAccess: true,
          autoRefreshHours: 6,
        },
        status: 'live',
      },
      {
        id: 'Standard',
        name: 'Standard Pack',
        price: 20000,
        durationValue: 14,
        durationUnit: 'Days',
        description: 'Standard 14-day boost with enhanced visibility and analytics.',
        badge: 'Most Popular',
        features: [
          'Priority #3 Feed Placement',
          '2x Visibility Boost',
          'Blue Highlighted Card',
          'Boost Analytics Dashboard',
          '14 Days Promotion Period',
        ],
        boostConfig: {
          feedPriority: 3,
          visibilityMultiplier: 2,
          highlightStyle: 'blue',
          crossCategoryReach: false,
          analyticsAccess: true,
          autoRefreshHours: 12,
        },
        status: 'live',
      },
      {
        id: 'Starter',
        name: 'Starter Pack',
        price: 5000,
        durationValue: 3,
        durationUnit: 'Days',
        description: 'Entry-level 3-day boost to get started with advertising.',
        badge: 'No Badge',
        features: [
          'Priority #7 Feed Placement',
          'Sponsored Label on Post',
          '3 Days Promotion Period',
        ],
        boostConfig: {
          feedPriority: 7,
          visibilityMultiplier: 1,
          highlightStyle: 'subtle',
          crossCategoryReach: false,
          analyticsAccess: false,
          autoRefreshHours: 0,
        },
        status: 'live',
      },
    ], { ignoreDuplicates: true });
    logger.info('  ✅ Admin-tier packages (Premium, Standard, Starter) seeded.');

    // --- Boost Audit Logs ---
    await BoostLog.findOrCreate({
      where: { id: 'log-seed-starter' },
      defaults: {
        id: 'log-seed-starter',
        type: 'package_added',
        packageId: starterPkg.id,
        changedBy: null,
        title: "New package 'Starter Boost' created",
        description: 'Tier added with pricing: Rs. 1,000 / 24 Hours',
        changes: { name: 'Starter Boost', price: 1000, boostConfig: starterPkg.boostConfig },
      },
    });

    await BoostLog.findOrCreate({
      where: { id: 'log-seed-growth' },
      defaults: {
        id: 'log-seed-growth',
        type: 'package_added',
        packageId: growthPkg.id,
        changedBy: null,
        title: "New package 'Growth Boost' created",
        description: 'Tier added with pricing: Rs. 2,500 / 3 Days',
        changes: { name: 'Growth Boost', price: 2500, boostConfig: growthPkg.boostConfig },
      },
    });

    await BoostLog.findOrCreate({
      where: { id: 'log-seed-dominate' },
      defaults: {
        id: 'log-seed-dominate',
        type: 'package_added',
        packageId: dominatePkg.id,
        changedBy: null,
        title: "New package 'Dominate Boost' created",
        description: 'Tier added with pricing: Rs. 5,000 / 7 Days',
        changes: { name: 'Dominate Boost', price: 5000, boostConfig: dominatePkg.boostConfig },
      },
    });
    logger.info('  ✅ Boost audit logs seeded.');

    // ═══════════════════════════════════════════════════════════════════════
    // 2. SOCIAL REPORTS (uses existing user IDs from shared DB)
    // ═══════════════════════════════════════════════════════════════════════

    logger.info('Seeding social reports...');

    // Use existing students: Sunil Fernando (ID 4), Tharushi Bandara (ID 5)
    const reporterId = 4;
    const offenderId = 5;

    // Check if social reports already exist for this reporter/offender pair
    const existingSocialReports = await Report.count({
      where: { reporterId, offenderId },
    });

    if (existingSocialReports === 0) {
      await Report.bulkCreate([
        {
          reporterId,
          offenderId,
          type: 'Hate Speech',
          status: 'Pending',
          priority: 'High',
          description: 'This user is posting hateful comments about specific groups.',
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          reporterId,
          offenderId,
          type: 'Harassment',
          status: 'In Review',
          priority: 'Medium',
          description: 'Repeatedly tagging me in inappropriate posts.',
          notes: 'Admin viewed report. Status changed to In Review.',
          createdAt: moment().subtract(1, 'days').toDate(),
          updatedAt: new Date(),
        },
        {
          reporterId,
          offenderId,
          type: 'Spam',
          status: 'Resolved',
          priority: 'Low',
          description: 'Posting advertisement links in every comment section.',
          notes: 'Resolution: User warned. Content removed.\nAdmin Note: First warning sent.',
          createdAt: moment().subtract(2, 'days').toDate(),
          updatedAt: moment().subtract(1, 'days').toDate(),
        },
      ]);
      logger.info('  ✅ 3 Social reports created.');
    } else {
      logger.info('  ⏭️ Social reports already exist — skipped.');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 3. STUDENT REPORTS (uses existing student IDs from shared DB)
    // ═══════════════════════════════════════════════════════════════════════

    logger.info('Seeding student reports...');

    const existingStudentReports = await StudentReport.count({
      where: { studentId: reporterId },
    });

    if (existingStudentReports === 0) {
      const reportDate = moment().format('YYYYMMDD');
      await StudentReport.bulkCreate([
        {
          studentId: reporterId,
          reportId: `#RPT-${reportDate}-0001`,
          title: 'Harassment on News Feed',
          category: 'harassment',
          reportType: 'user',
          reportedEntityId: '5',
          additionalDetails: 'A student is consistently using abusive language in comments on my posts. I have attached screenshots of the most recent incidents.',
          status: 'Pending Review',
          priority: 'Medium',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          studentId: reporterId,
          reportId: `#RPT-${moment().subtract(2, 'days').format('YYYYMMDD')}-0002`,
          title: 'Inappropriate Content in Marketplace',
          category: 'inappropriate',
          reportType: 'post',
          reportedEntityId: '101',
          additionalDetails: 'Someone listed an item with offensive imagery. This is against community guidelines.',
          status: 'In Progress',
          priority: 'High',
          createdAt: moment().subtract(2, 'days').toDate(),
          updatedAt: moment().subtract(1, 'days').toDate(),
        },
        {
          studentId: reporterId,
          reportId: `#RPT-${moment().subtract(5, 'days').format('YYYYMMDD')}-0003`,
          title: 'Scam Account Attempt',
          category: 'spam',
          reportType: 'user',
          reportedEntityId: '12',
          additionalDetails: 'This account messaged me asking for bank details to "verify" a payment.',
          status: 'Resolved',
          priority: 'Critical',
          createdAt: moment().subtract(5, 'days').toDate(),
          updatedAt: moment().subtract(4, 'days').toDate(),
        },
      ]);
      logger.info('  ✅ 3 Student reports created.');
    } else {
      logger.info('  ⏭️ Student reports already exist — skipped.');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════════════════════════════════

    const pkgCount = await BoostPackage.count();
    const socialCount = await Report.count();
    const studentCount = await StudentReport.count();

    logger.info('\n🎉 Shared database seeding complete!');
    logger.info(`   📦 Boost Packages: ${pkgCount}`);
    logger.info(`   🚩 Social Reports: ${socialCount}`);
    logger.info(`   📋 Student Reports: ${studentCount}`);
    logger.info('   ⚠️  No existing data was modified or deleted.');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Seeding failed:', error.message);
    logger.error(error.stack);
    process.exit(1);
  }
}

seedSharedDb();

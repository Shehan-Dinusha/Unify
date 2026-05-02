import { v4 as uuidv4 } from 'uuid';
import { 
  UserSuspension, 
  sequelize 
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * @desc    Seed Suspension Data
 * @route   POST /api/v1/base/seed-suspensions
 */
export const seedSuspensions = async (req, res, next) => {
  logger.info("Starting suspension data seeding...");

  const suspensionSeeds = [
    {
      userId: 3,
      reason: 'Violation of Academic Integrity Policy. Multiple reports received from other users regarding plagiarism.',
      reasonTag: 'ToS Violation',
      severity: 'High',
      daysAgo: 3,
      adminNotes: 'Student admitted to the violation. Admin recommends a 3-month suspension with mandatory counselling before reinstatement.',
      adminAction: 'SysAdmin',
    },
    {
      userId: 6,
      reason: 'Payment failure for student services. Account flagged for outstanding dues.',
      reasonTag: 'Payment Failure',
      severity: 'Medium',
      daysAgo: 5,
      adminNotes: 'Student has outstanding payment of Rs. 45,000. Account suspended until payment is resolved.',
      adminAction: 'FinanceAdmin',
    },
    {
      userId: 2,
      reason: 'Suspicious activity detected on account. Multiple login attempts from unknown locations.',
      reasonTag: 'Suspicious Activity',
      severity: 'Critical',
      daysAgo: 7,
      adminNotes: 'Flagged for unauthorized bulk data export from student registry. Security audit initiated.',
      adminAction: 'SysAdmin',
    },
    {
      userId: 14,
      reason: 'Harassment complaint filed by multiple students. Investigation completed.',
      reasonTag: 'Harassment',
      severity: 'High',
      daysAgo: 10,
      adminNotes: 'Multiple complaints verified. Student placed under mandatory behavioral review program.',
      adminAction: 'DisciplinaryBoard',
    },
    {
      userId: 12,
      reason: 'Repeated Terms of Service violations. Business account used for unauthorized commercial activity.',
      reasonTag: 'ToS Violation',
      severity: 'High',
      daysAgo: 14,
      adminNotes: 'Business account found operating outside approved guidelines. Third violation in 6 months.',
      adminAction: 'SysAdmin',
    },
    {
      userId: 13,
      reason: 'Payment failure. Subscription fees unpaid for 3 consecutive months.',
      reasonTag: 'Payment Failure',
      severity: 'Medium',
      daysAgo: 8,
      adminNotes: 'Cafe account flagged for non-payment. Reached out via email twice with no response.',
      adminAction: 'FinanceAdmin',
    },
    {
      userId: 7,
      reason: 'Suspicious activity detected. Unusual transaction patterns flagged by automated system.',
      reasonTag: 'Suspicious Activity',
      severity: 'High',
      daysAgo: 12,
      adminNotes: 'Automated fraud detection triggered. Multiple refund requests linked to same account.',
      adminAction: 'SecurityTeam',
    },
    {
      userId: 8,
      reason: 'Terms of Service violation. Unauthorized data scraping detected from platform APIs.',
      reasonTag: 'ToS Violation',
      severity: 'Critical',
      daysAgo: 6,
      adminNotes: 'API rate limits consistently exceeded. Evidence of automated scraping tools being used.',
      adminAction: 'SysAdmin',
    },
  ];

  const transaction = await sequelize.transaction();

  try {
    // Clear existing suspensions to avoid duplicates during testing
    await UserSuspension.destroy({ where: {}, truncate: true, cascade: true, transaction });

    for (const seed of suspensionSeeds) {
      const now = new Date();
      const suspensionDate = new Date(now);
      suspensionDate.setDate(suspensionDate.getDate() - seed.daysAgo);

      const effectiveDate = new Date(suspensionDate);
      effectiveDate.setDate(effectiveDate.getDate() - 2);

      const suspensionTime = suspensionDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      const year = suspensionDate.getFullYear();
      const num = Math.floor(100 + Math.random() * 900);
      const caseReference = `#SUS-${year}-${num}`;

      const formattedEffDate = effectiveDate.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
      const adminActionLabel = `Action taken on ${formattedEffDate} by ${seed.adminAction}`;

      await UserSuspension.create({
        id: uuidv4(),
        userId: seed.userId,
        caseReference,
        reason: seed.reason,
        reasonTag: seed.reasonTag,
        severity: seed.severity,
        effectiveDate: effectiveDate,
        suspensionDate: suspensionDate,
        suspensionTime,
        adminNotes: seed.adminNotes,
        adminAction: adminActionLabel,
        identityVerificationComplete: false,
        securityAuditPassed: false,
        status: 'ACTIVE',
        createdAt: suspensionDate,
        updatedAt: suspensionDate
      }, { transaction });
    }

    await transaction.commit();
    logger.info("Suspension data seeded successfully.");
    return sendResponse(res, 201, true, "Suspension data seeded successfully!");

  } catch (error) {
    if (transaction) await transaction.rollback();
    logger.error("Error seeding suspension data:", error);
    return sendResponse(res, 500, false, "Failed to seed suspension data", error.message);
  }
};

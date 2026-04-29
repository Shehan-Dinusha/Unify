import { Report, StudentReport } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import moment from "moment";

/**
 * Controller to seed both Social and Student Reports.
 * 100% Consistent with the base seeding pattern.
 */
export const seedReports = async (req, res, next) => {
  logger.info("Starting report data seeding...");
  
  try {
    // Reporter: Achini Jayasuriya (ID 4)
    // Offender: Kaveesha Silva (ID 5)
    const reporterId = 4;
    const offenderId = 5;

    // 1. Create Social Reports (moderation queue)
    const socialReports = [
      {
        reporterId,
        offenderId,
        type: 'Hate Speech',
        status: 'Pending',
        priority: 'High',
        description: 'This user is posting hateful comments about specific groups.',
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date()
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
        updatedAt: new Date()
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
        updatedAt: moment().subtract(1, 'days').toDate()
      }
    ];

    await Report.bulkCreate(socialReports);
    logger.info("Social reports seeded successfully.");

    // 2. Create Student Submitted Reports (student dashboard)
    const studentReports = [
      {
        studentId: reporterId,
        reportId: `#RPT-${moment().format('YYYYMMDD')}-0001`,
        title: 'Harassment on News Feed',
        category: 'harassment',
        reportType: 'user',
        reportedEntityId: '5',
        additionalDetails: 'A student is consistently using abusive language in comments on my posts. I have attached screenshots of the most recent incidents.',
        status: 'Pending Review',
        createdAt: new Date(),
        updatedAt: new Date()
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
        notes: 'Admin Note: Investigation started. Contacted the seller.',
        createdAt: moment().subtract(2, 'days').toDate(),
        updatedAt: moment().subtract(1, 'days').toDate()
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
        resolutionNote: 'The reported user has been permanently suspended after verifying they were indeed a scammer.',
        notes: 'Resolution: Account Suspended.\nAdmin Note: Verified phishing attempt.',
        createdAt: moment().subtract(5, 'days').toDate(),
        updatedAt: moment().subtract(4, 'days').toDate()
      }
    ];

    await StudentReport.bulkCreate(studentReports);
    logger.info("Student reports seeded successfully.");

    return sendResponse(res, 201, true, "Report data seeded successfully!");
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    return sendResponse(res, 500, false, "Failed to seed report data", error.message);
  }
};

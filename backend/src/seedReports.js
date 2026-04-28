import { Report, StudentReport, User, Post } from "./modules/index.js";
import sequelize from "./config/database.js";
import moment from "moment";

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection established successfully.");

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
    console.log("Social reports seeded.");

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
    console.log("Student reports seeded.");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();

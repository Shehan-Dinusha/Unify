import { Op } from 'sequelize';
import StudentReport from "../../modules/StudentReport.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import moment from "moment";

const generateTimeline = (report) => {
  const timeline = [
    {
      label: "Report Submitted",
      date: moment(report.createdAt).format("MMM DD, YYYY • hh:mm A"),
      status: "completed",
    },
    {
      label: "Received by Admin",
      date: report.status !== 'Pending Review' ? moment(report.createdAt).add(1, 'hours').format("MMM DD, YYYY • hh:mm A") : "Pending",
      status: report.status !== 'Pending Review' ? "completed" : "pending",
    },
    {
      label: "Under Investigation",
      date: report.status === 'In Progress' ? "In Progress" : (report.status === 'Resolved' || report.status === 'Dismissed' ? moment(report.updatedAt).subtract(1, 'days').format("MMM DD, YYYY • hh:mm A") : "Pending"),
      description: report.status === 'In Progress' ? "Admin is reviewing evidence." : null,
      status: report.status === 'In Progress' ? "active" : (report.status === 'Resolved' || report.status === 'Dismissed' ? "completed" : "pending"),
    },
    {
      label: "Resolution",
      date: report.status === 'Resolved' || report.status === 'Dismissed' ? moment(report.updatedAt).format("MMM DD, YYYY • hh:mm A") : "Pending",
      description: report.status === 'Resolved' ? "Action taken." : null,
      status: report.status === 'Resolved' || report.status === 'Dismissed' ? "completed" : "pending",
    },
  ];
  return timeline;
};

const mapEvidence = (files) => {
  if (!files || !Array.isArray(files)) return [];
  return files.map(file => {
    const ext = file.split('.').pop().toLowerCase();
    const type = ['jpg', 'jpeg', 'png', 'gif'].includes(ext) ? 'image' : 'pdf';
    const name = file.split('/').pop() || 'evidence_file';
    return { name, type, url: file };
  });
};

/**
 * Retrieves a single report detail by ID.
 * Ensures the student is authorized to view it and formats it for StudentReportDetail.jsx.
 */
export const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studentId = req.user?.id || 1;

    // Support both integer ID and string reportId (e.g., #RPT-2023-849)
    let whereClause = { studentId };
    if (!isNaN(parseInt(id)) && !id.startsWith('#')) {
      whereClause.id = parseInt(id);
    } else {
      whereClause.reportId = id.toUpperCase();
    }

    const report = await StudentReport.findOne({
      where: whereClause,
    });

    if (!report) {
      return sendResponse(res, 404, false, 'Report not found or unauthorized');
    }

    // Fetch Violation History for this reported entity
    let pastViolations = [];
    if (report.reportedEntityId) {
      pastViolations = await StudentReport.findAll({
        where: { 
          reportedEntityId: report.reportedEntityId,
          id: { [Op.ne]: report.id } // Exclude current report
        },
        order: [['createdAt', 'DESC']],
        limit: 5
      });
    }

    // Format for frontend StudentReportDetail.jsx
    const formattedData = {
      id: report.reportId, // frontend router uses this ID
      reportId: report.reportId,
      title: report.title,
      category: report.category,
      categoryIcon: "🔧", // generic for now
      dateSubmitted: moment(report.createdAt).format("MMM DD, YYYY"),
      dateSubmittedFull: moment(report.createdAt).format("MMM DD, YYYY • hh:mm A"),
      status: report.status,
      reportType: report.reportType,
      reason: report.category,
      reportedEntity: {
        name: report.reportType === 'user' ? "Reported User" : "Reported Content",
        faculty: "N/A",
        entityId: report.reportedEntityId,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${report.reportedEntityId}`,
        categoryBadge: report.category
      },
      description: report.additionalDetails || "No additional description provided.",
      evidence: mapEvidence(report.evidenceFiles),
      timeline: generateTimeline(report),
      violationHistory: pastViolations.map(v => ({
        type: v.category,
        date: moment(v.createdAt).format('MMM DD, YYYY'),
        status: v.status === 'Resolved' ? 'Action Taken' : (v.status === 'Dismissed' ? 'Dismissed' : 'Warning Sent')
      })),
      reportCount: pastViolations.length + 1,
      adminNote: report.adminNotes ? {
        author: "Admin",
        avatar: "A",
        date: moment(report.updatedAt).format("MMM DD, YYYY [at] h:mm A"),
        message: report.adminNotes
      } : null,
      statusLabel: report.status
    };

    return sendResponse(res, 200, true, 'Report details retrieved', formattedData);
  } catch (error) {
    logger.error(`Error in getReportById controller: ${error.message}`);
    next(error);
  }
};

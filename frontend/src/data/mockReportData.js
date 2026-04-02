// Mock data for student report system

export const mockStudentReports = [
  {
    id: "rpt-2023-849",
    reportId: "#RPT-2023-849",
    title: "Broken Projector in Hall B",
    category: "Facility",
    categoryIcon: "🔧",
    dateSubmitted: "Oct 24, 2023",
    dateSubmittedFull: "Oct 24, 2023 • 10:45 AM",
    status: "Pending Review",
    reportType: "Post",
    reason: "Inappropriate Content",
    reportedEntity: {
      name: "Kamal Perera",
      faculty: "Faculty of Science",
      entityId: "FAC-SCI-0042",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KamalPerera",
      categoryBadge: "Academic Misconduct",
    },
    description:
      "I observed that the exam paper for PHY101 was potentially leaked prior to the start time. Several students were discussing specific questions outside the exam hall at 8:45 AM minutes before the papers were distributed.",
    evidence: [
      { name: "atsapp_screen...", type: "image", url: "/placeholder-evidence-1.jpg" },
      { name: "email_thread.pdf", type: "pdf", url: "/placeholder-evidence-2.pdf" },
    ],
    timeline: [
      {
        label: "Report Submitted",
        date: "Oct 24, 2023 • 10:45 AM",
        status: "completed",
      },
      {
        label: "Received by Admin",
        date: "Oct 24, 2023 • 11:30 AM",
        status: "completed",
      },
      {
        label: "Under Investigation",
        date: "In Progress",
        description: "Disciplinary committee is reviewing evidence.",
        status: "active",
      },
      {
        label: "Resolution",
        date: "Pending",
        status: "pending",
      },
    ],
    adminNote: {
      author: "Admin",
      avatar: "G",
      date: "Oct 25, 2023 at 2:00 PM",
      message:
        "Thank you for the report. The disciplinary committee has been notified and the provided evidence is currently being verified by the IT department. We will update you once the verification process is complete.",
    },
    statusLabel: "Under Investigation",
  },
  {
    id: "rpt-2023-001",
    reportId: "#REP-2023-001",
    title: "Broken Projector in Hall B",
    category: "Facility",
    categoryIcon: "🔧",
    dateSubmitted: "Oct 24, 2023",
    dateSubmittedFull: "Oct 24, 2023 • 09:15 AM",
    status: "Pending Review",
    reportType: "Post",
    reason: "Inappropriate Content",
    reportedEntity: {
      name: "Nimal Silva",
      faculty: "Faculty of Engineering",
      entityId: "FAC-ENG-0118",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NimalSilva",
      categoryBadge: "Facility Issue",
    },
    description:
      "The main projector in Lecture Hall B has been malfunctioning for the past week. It flickers constantly during presentations and sometimes shuts down completely mid-lecture.",
    evidence: [],
    timeline: [
      {
        label: "Report Submitted",
        date: "Oct 24, 2023 • 09:15 AM",
        status: "completed",
      },
      {
        label: "Received by Admin",
        date: "Pending",
        status: "pending",
      },
      {
        label: "Under Investigation",
        date: "Pending",
        status: "pending",
      },
      {
        label: "Resolution",
        date: "Pending",
        status: "pending",
      },
    ],
    adminNote: null,
    statusLabel: "Pending Review",
  },
  {
    id: "rpt-2023-039",
    reportId: "#REP-2023-039",
    title: "Wi-Fi Connectivity Issue - Library",
    category: "IT Support",
    categoryIcon: "🌐",
    dateSubmitted: "Oct 15, 2023",
    dateSubmittedFull: "Oct 15, 2023 • 02:30 PM",
    status: "Resolved",
    reportType: "Post",
    reason: "Misinformation",
    reportedEntity: {
      name: "IT Department",
      faculty: "University Infrastructure",
      entityId: "INF-IT-0003",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ITDept",
      categoryBadge: "IT Support",
    },
    description:
      "The Wi-Fi connection in the main library has been extremely slow and frequently drops during peak hours. Students are unable to access online resources for their research.",
    evidence: [
      { name: "speed_test.png", type: "image", url: "/placeholder-evidence-3.jpg" },
    ],
    timeline: [
      {
        label: "Report Submitted",
        date: "Oct 15, 2023 • 02:30 PM",
        status: "completed",
      },
      {
        label: "Received by Admin",
        date: "Oct 15, 2023 • 03:00 PM",
        status: "completed",
      },
      {
        label: "Under Investigation",
        date: "Oct 16, 2023 • 10:00 AM",
        status: "completed",
      },
      {
        label: "Resolution",
        date: "Oct 18, 2023 • 04:00 PM",
        description: "New access points installed in library zones.",
        status: "completed",
      },
    ],
    adminNote: {
      author: "Admin",
      avatar: "G",
      date: "Oct 18, 2023 at 4:00 PM",
      message:
        "The IT team has installed additional access points in the library to improve coverage. Please test the connection and let us know if the issue persists.",
    },
    statusLabel: "Resolved",
  },
  {
    id: "rpt-2023-042",
    reportId: "#REP-2023-042",
    title: "Grade Discrepancy - CS101",
    category: "Academic",
    categoryIcon: "🎓",
    dateSubmitted: "Oct 20, 2023",
    dateSubmittedFull: "Oct 20, 2023 • 11:00 AM",
    status: "In Progress",
    reportType: "Comment",
    reason: "Harassment or Bullying",
    reportedEntity: {
      name: "Prof. Bandara",
      faculty: "Faculty of Computing",
      entityId: "FAC-COM-0021",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ProfBandara",
      categoryBadge: "Academic Issue",
    },
    description:
      "My final grade for CS101 does not reflect my assignment and exam scores. The calculated total should be a B+ based on the grading rubric provided at the start of the semester.",
    evidence: [
      { name: "grade_sheet.pdf", type: "pdf", url: "/placeholder-evidence-4.pdf" },
    ],
    timeline: [
      {
        label: "Report Submitted",
        date: "Oct 20, 2023 • 11:00 AM",
        status: "completed",
      },
      {
        label: "Received by Admin",
        date: "Oct 20, 2023 • 01:15 PM",
        status: "completed",
      },
      {
        label: "Under Investigation",
        date: "In Progress",
        description: "Academic office is reviewing grade records.",
        status: "active",
      },
      {
        label: "Resolution",
        date: "Pending",
        status: "pending",
      },
    ],
    adminNote: {
      author: "Admin",
      avatar: "G",
      date: "Oct 21, 2023 at 9:30 AM",
      message:
        "We have forwarded your grade concern to the academic office. They will review the grading records and respond within 5 working days.",
    },
    statusLabel: "Under Investigation",
  },
  {
    id: "rpt-2023-028",
    reportId: "#REP-2023-028",
    title: "Request for new textbook",
    category: "Library",
    categoryIcon: "📚",
    dateSubmitted: "Oct 10, 2023",
    dateSubmittedFull: "Oct 10, 2023 • 08:45 AM",
    status: "Resolved",
    reportType: "Post",
    reason: "Spam",
    reportedEntity: {
      name: "Library Services",
      faculty: "University Library",
      entityId: "LIB-SVC-0009",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LibraryServ",
      categoryBadge: "Library",
    },
    description:
      "The library does not have copies of the prescribed textbook for BIO201 (Molecular Biology - 7th Edition). Multiple students have requested this resource.",
    evidence: [],
    timeline: [
      {
        label: "Report Submitted",
        date: "Oct 10, 2023 • 08:45 AM",
        status: "completed",
      },
      {
        label: "Received by Admin",
        date: "Oct 10, 2023 • 10:00 AM",
        status: "completed",
      },
      {
        label: "Under Investigation",
        date: "Oct 11, 2023 • 09:00 AM",
        status: "completed",
      },
      {
        label: "Resolution",
        date: "Oct 14, 2023 • 03:30 PM",
        description: "5 copies of the textbook have been ordered.",
        status: "completed",
      },
    ],
    adminNote: {
      author: "Admin",
      avatar: "G",
      date: "Oct 14, 2023 at 3:30 PM",
      message:
        "We have placed an order for 5 copies of the prescribed textbook. They are expected to arrive within 2 weeks. Meanwhile, a digital copy has been made available on the university e-library.",
    },
    statusLabel: "Resolved",
  },
];

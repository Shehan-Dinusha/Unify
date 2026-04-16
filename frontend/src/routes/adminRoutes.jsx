import VerificationQueue from "../pages/VerificationQueue";
import AdminDashboard from "../pages/AdminDashboard";
import RevenueOverview from "../pages/RevenueOverview";
import ActiveBusinesses from "../pages/ActiveBusinesses";
import BusinessProfile from "../pages/BusinessProfile";
import StudentManagement from "../pages/StudentManagement";
import StudentUserProfile from "../pages/StudentUserProfile";
import ReportModeration from "../pages/ReportModeration";
import ReportDetail from "../pages/ReportDetail";
import ClubVerification from "../pages/ClubVerification";
import BatchRepVerification from "../pages/BatchRepVerification";
import SuspendedUsers from "../pages/SuspendedUsers";
import SuspendedUserProfile from "../pages/SuspendedUserProfile";
import SuspendedUserReactivation from "../pages/SuspendedUserReactivation";
import SuspendedUserSuccess from "../pages/SuspendedUserSuccess";
import BoostController from "../pages/BoostController";
import BoostPackageForm from "../pages/BoostPackageForm";
import BoostAnalytics from "../pages/BoostAnalytics";

export const adminRoutes = [
  // System administrator core
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/verification-queue", element: <VerificationQueue /> },

  // User management
  { path: "/active-businesses", element: <ActiveBusinesses /> },
  { path: "/active-businesses/:id", element: <BusinessProfile /> },
  { path: "/student-management", element: <StudentManagement /> },
  { path: "/student-management/:id", element: <StudentUserProfile /> },
  { path: "/suspended-users", element: <SuspendedUsers /> },
  { path: "/suspended-users/:id", element: <SuspendedUserProfile /> },
  {
    path: "/suspended-users/:id/reactivate",
    element: <SuspendedUserReactivation />,
  },
  { path: "/suspended-users/:id/success", element: <SuspendedUserSuccess /> },
  { path: "/club-verification", element: <ClubVerification /> },
  { path: "/batch-rep-verification", element: <BatchRepVerification /> },

  // Reports panel and analytics
  { path: "/report-moderation", element: <ReportModeration /> },
  { path: "/report-moderation/:id", element: <ReportDetail /> },
  { path: "/revenue-overview", element: <RevenueOverview /> },

  // Boost management
  { path: "/boost-controller", element: <BoostController /> },
  { path: "/boost-controller/new", element: <BoostPackageForm /> },
  { path: "/boost-controller/edit/:id", element: <BoostPackageForm /> },
  { path: "/boost-controller/analytics/:id", element: <BoostAnalytics /> },
];

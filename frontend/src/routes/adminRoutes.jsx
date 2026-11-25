import lazyWithRetry from "../utils/lazyWithRetry";
import ProtectedRoute from "../components/auth/ProtectedRoute";
const VerificationQueue = lazyWithRetry(() => import("../pages/VerificationQueue"));
const AdminDashboard = lazyWithRetry(() => import("../pages/AdminDashboard"));
const RevenueOverview = lazyWithRetry(() => import("../pages/RevenueOverview"));
const ActiveBusinesses = lazyWithRetry(() => import("../pages/ActiveBusinesses"));
const BusinessProfile = lazyWithRetry(() => import("../pages/BusinessProfile"));
const StudentManagement = lazyWithRetry(() => import("../pages/StudentManagement"));
const StudentUserProfile = lazyWithRetry(() => import("../pages/StudentUserProfile"));
const ReportModeration = lazyWithRetry(() => import("../pages/ReportModeration"));
const ReportDetail = lazyWithRetry(() => import("../pages/ReportDetail"));
const SuspendedUsers = lazyWithRetry(() => import("../pages/SuspendedUsers"));
const SuspendedUserProfile = lazyWithRetry(() => import("../pages/SuspendedUserProfile"));
const SuspendedUserReactivation = lazyWithRetry(() => import("../pages/SuspendedUserReactivation"));
const SuspendedUserSuccess = lazyWithRetry(() => import("../pages/SuspendedUserSuccess"));
const BoostController = lazyWithRetry(() => import("../pages/BoostController"));
const BoostPackageForm = lazyWithRetry(() => import("../pages/BoostPackageForm"));

export const adminRoutes = [
  {
    element: <ProtectedRoute allowedRoles={["Admin"]} />,
    children: [
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
      {
        path: "/suspended-users/:id/success",
        element: <SuspendedUserSuccess />,
      },

      // Reports panel and analytics
      { path: "/report-moderation", element: <ReportModeration /> },
      { path: "/report-moderation/:id", element: <ReportDetail /> },
      { path: "/revenue-overview", element: <RevenueOverview /> },

      // Boost management
      { path: "/boost-controller", element: <BoostController /> },
      { path: "/boost-controller/new", element: <BoostPackageForm /> },
      { path: "/boost-controller/edit/:id", element: <BoostPackageForm /> },
    ],
  },
];

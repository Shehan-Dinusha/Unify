import NewsFeed from "../pages/NewsFeed";
import Notification from "../pages/Notification";
import ChatPage from "../pages/chat/ChatPage";
import LostAndFound from "../pages/LostAndFound";
import MyLostAndFound from "../pages/MyLostAndFound";
import Marketplace from "../pages/Marketplace";
import MarketplaceItems from "../pages/MarketplaceItems";
import EventsToday from "../pages/EventsToday";
import NewAnnouncements from "../pages/NewAnnouncements";
import Followings from "../pages/Followings";
import StudentLearningDashboard from "../pages/StudentLearningDashboard";
import BatchRepLearningDashboard from "../pages/BatchRepLearningDashboard";
import OwnProfilePage from "../pages/profile/OwnProfilePage";
import PublicProfilePage from "../pages/profile/PublicProfilePage";
import EditProfilePage from "../pages/profile/EditProfilePage";
import SecurityPage from "../pages/profile/SecurityPage";
import MySavedPosts from "../pages/MySavedPosts";
import MyReviewHistory from "../pages/MyReviewHistory";
import MarketplaceReviews from "../pages/MarketplaceReviews";
import MyOrders from "../pages/MyOrders";
import OrderDetails from "../pages/OrderDetails";
import BookingDetails from "../pages/BookingDetails";
import StudentReportIssue from "../pages/StudentReportIssue";
import StudentReportSuccess from "../pages/StudentReportSuccess";
import StudentSubmittedReports from "../pages/StudentSubmittedReports";
import StudentReportDetail from "../pages/StudentReportDetail";
import StudentReportWithdrawal from "../pages/StudentReportWithdrawal";
import StudentReportWithdrawalSuccess from "../pages/StudentReportWithdrawalSuccess";
import BatchRepVerification from "../pages/BatchRepVerification";
import Club from "../pages/Club";
import Services from "../pages/Services";
import FoodCafe from "../pages/FoodCafe";
import Boarding from "../pages/Boarding";
import ClubProduct from "../pages/ClubProduct";
import ClubCheckout from "../pages/ClubCheckout";
import ClubPaymentSuccess from "../pages/ClubPaymentSuccess";
import ClubPaymentCancel from "../pages/ClubPaymentCancel";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export const studentRoutes = [
  // 1. PROFILE ROUTES (Accessible by everyone logged in, including unverified clubs)
  {
    element: (
      <ProtectedRoute allowedRoles={["Student", "Business", "Club", "Admin"]} />
    ),
    children: [
      { path: "/profile", element: <OwnProfilePage /> },
      { path: "/profile/edit", element: <EditProfilePage /> },
      { path: "/profile/security", element: <SecurityPage /> },
      { path: "/profile/:userId", element: <PublicProfilePage /> },
    ],
  },
  // 2. SHARED ROUTES (Require club verification for Club users)
  {
    element: (
      <ProtectedRoute
        allowedRoles={["Student", "Business", "Club", "Admin"]}
        requireVerified
      />
    ),
    children: [
      { path: "/news-feed", element: <NewsFeed /> },
      { path: "/messages", element: <ChatPage /> },
      { path: "/profile/reviews", element: <MyReviewHistory /> },
      {
        path: "/marketplace/:targetId/reviews",
        element: <MarketplaceReviews />,
      },
    ],
  },
  // 3. NOTIFICATIONS (Accessible to all, including unverified clubs)
  {
    element: (
      <ProtectedRoute allowedRoles={["Student", "Business", "Club", "Admin"]} />
    ),
    children: [{ path: "/notifications", element: <Notification /> }],
  },
  // 4. STUDENT-ONLY ROUTES
  {
    element: <ProtectedRoute allowedRoles={["Student", "Admin"]} />,
    children: [
      { path: "/lost-and-found", element: <LostAndFound /> },
      { path: "/my-lost-and-found", element: <MyLostAndFound /> },
      { path: "/marketplace", element: <Marketplace /> },
      { path: "/marketplace-items", element: <MarketplaceItems /> },
      { path: "/events-today", element: <EventsToday /> },
      { path: "/new-announcements", element: <NewAnnouncements /> },
      { path: "/student/followings", element: <Followings /> },

      //marketplace
      { path: "/marketplace/club", element: <Club /> },
      { path: "marketplace/services", element: <Services /> },
      { path: "marketplace/food-cafe", element: <FoodCafe /> },
      { path: "marketplace/boarding", element: <Boarding /> },
      { path: "/marketplace/club/product/:type/:id", element: <ClubProduct /> },
      { path: "/marketplace/club/checkout", element: <ClubCheckout /> },
      {
        path: "/marketplace/club/payment-success",
        element: <ClubPaymentSuccess />,
      },
      {
        path: "/marketplace/club/payment-cancel",
        element: <ClubPaymentCancel />,
      },

      // Learning
      { path: "/learning", element: <BatchRepLearningDashboard /> },
      { path: "/student-learning", element: <StudentLearningDashboard /> },
      { path: "/batch-rep-verification", element: <BatchRepVerification /> },

      // Saved content & Reviews
      { path: "/my-saved-posts", element: <MySavedPosts /> },

      // Orders & reports
      { path: "/order-history", element: <MyOrders /> },
      { path: "/order-details/:id", element: <OrderDetails /> },
      { path: "/booking-details/:id", element: <BookingDetails /> },
      { path: "/student/report-issue", element: <StudentReportIssue /> },
      { path: "/student/report-success", element: <StudentReportSuccess /> },
      { path: "/student/reports", element: <StudentSubmittedReports /> },
      { path: "/student/reports/:id", element: <StudentReportDetail /> },
      {
        path: "/student/reports/:id/withdraw",
        element: <StudentReportWithdrawal />,
      },
      {
        path: "/student/reports/:id/withdraw/success",
        element: <StudentReportWithdrawalSuccess />,
      },
    ],
  },
];

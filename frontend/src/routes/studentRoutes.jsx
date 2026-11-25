import lazyWithRetry from "../utils/lazyWithRetry";
import ProtectedRoute from "../components/auth/ProtectedRoute";
const NewsFeed = lazyWithRetry(() => import("../pages/NewsFeed"));
const Notification = lazyWithRetry(() => import("../pages/Notification"));
const ChatPage = lazyWithRetry(() => import("../pages/chat/ChatPage"));
const LostAndFound = lazyWithRetry(() => import("../pages/LostAndFound"));
const MyLostAndFound = lazyWithRetry(() => import("../pages/MyLostAndFound"));
const Marketplace = lazyWithRetry(() => import("../pages/Marketplace"));
const MarketplaceItems = lazyWithRetry(() => import("../pages/MarketplaceItems"));
const EventsToday = lazyWithRetry(() => import("../pages/EventsToday"));
const NewAnnouncements = lazyWithRetry(() => import("../pages/NewAnnouncements"));
const Followings = lazyWithRetry(() => import("../pages/Followings"));
const StudentLearningDashboard = lazyWithRetry(() => import("../pages/StudentLearningDashboard"));
const BatchRepLearningDashboard = lazyWithRetry(() => import("../pages/BatchRepLearningDashboard"));
const OwnProfilePage = lazyWithRetry(() => import("../pages/profile/OwnProfilePage"));
const PublicProfilePage = lazyWithRetry(() => import("../pages/profile/PublicProfilePage"));
const EditProfilePage = lazyWithRetry(() => import("../pages/profile/EditProfilePage"));
const SecurityPage = lazyWithRetry(() => import("../pages/profile/SecurityPage"));
const MySavedPosts = lazyWithRetry(() => import("../pages/MySavedPosts"));
const MyReviewHistory = lazyWithRetry(() => import("../pages/MyReviewHistory"));
const MarketplaceReviews = lazyWithRetry(() => import("../pages/MarketplaceReviews"));
const MyOrders = lazyWithRetry(() => import("../pages/MyOrders"));
const OrderDetails = lazyWithRetry(() => import("../pages/OrderDetails"));
const BookingDetails = lazyWithRetry(() => import("../pages/BookingDetails"));
const StudentReportIssue = lazyWithRetry(() => import("../pages/StudentReportIssue"));
const StudentReportSuccess = lazyWithRetry(() => import("../pages/StudentReportSuccess"));
const StudentSubmittedReports = lazyWithRetry(() => import("../pages/StudentSubmittedReports"));
const StudentReportDetail = lazyWithRetry(() => import("../pages/StudentReportDetail"));
const StudentReportWithdrawal = lazyWithRetry(() => import("../pages/StudentReportWithdrawal"));
const StudentReportWithdrawalSuccess = lazyWithRetry(() => import("../pages/StudentReportWithdrawalSuccess"));
const BatchRepVerification = lazyWithRetry(() => import("../pages/BatchRepVerification"));
const Club = lazyWithRetry(() => import("../pages/Club"));
const Services = lazyWithRetry(() => import("../pages/Services"));
const FoodCafe = lazyWithRetry(() => import("../pages/FoodCafe"));
const Boarding = lazyWithRetry(() => import("../pages/Boarding"));
const ClubProduct = lazyWithRetry(() => import("../pages/ClubProduct"));
const ClubCheckout = lazyWithRetry(() => import("../pages/ClubCheckout"));
const ClubPaymentSuccess = lazyWithRetry(() => import("../pages/ClubPaymentSuccess"));
const ClubPaymentCancel = lazyWithRetry(() => import("../pages/ClubPaymentCancel"));

export const studentRoutes = [
  // 1. PROFILE ROUTES (Accessible by everyone logged in, including unverified clubs)
  {
    element: (
      <ProtectedRoute allowedRoles={["Student", "Business", "Club"]} />
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
      <ProtectedRoute allowedRoles={["Student", "Business", "Club"]} requireVerified />
    ),
    children: [
      { path: "/news-feed", element: <NewsFeed /> },
      { path: "/profile/reviews", element: <MyReviewHistory /> },
      {
        path: "/marketplace/:targetId/reviews",
        element: <MarketplaceReviews />,
      },
      // Newsfeed highlight card destinations — accessible to all roles
      { path: "/events-today", element: <EventsToday /> },
      { path: "/marketplace-items", element: <MarketplaceItems /> },
      { path: "/new-announcements", element: <NewAnnouncements /> },
      // Saved posts — accessible to all roles
      { path: "/my-saved-posts", element: <MySavedPosts /> },
    ],
  },
  // 2b. CHAT — Accessible to Students and Clubs
  {
    element: (
      <ProtectedRoute allowedRoles={["Student", "Club"]} requireVerified />
    ),
    children: [
      { path: "/messages", element: <ChatPage /> },
    ],
  },
  // 3. NOTIFICATIONS (Accessible to all, including unverified clubs)
  {
    element: (
      <ProtectedRoute allowedRoles={["Student", "Business", "Club"]} />
    ),
    children: [{ path: "/notifications", element: <Notification /> }],
  },
  // 4. STUDENT-ONLY ROUTES
  {
    element: <ProtectedRoute allowedRoles={["Student", "Business"]} />,
    children: [
      { path: "/lost-and-found", element: <LostAndFound /> },
      { path: "/my-lost-and-found", element: <MyLostAndFound /> },
      { path: "/marketplace", element: <Marketplace /> },
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

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
import MyOrders from "../pages/MyOrders";
import OrderDetails from "../pages/OrderDetails";
import BookingDetails from "../pages/BookingDetails";
import StudentReportIssue from "../pages/StudentReportIssue";
import StudentReportSuccess from "../pages/StudentReportSuccess";
import StudentSubmittedReports from "../pages/StudentSubmittedReports";
import StudentReportDetail from "../pages/StudentReportDetail";
import StudentReportWithdrawal from "../pages/StudentReportWithdrawal";
import StudentReportWithdrawalSuccess from "../pages/StudentReportWithdrawalSuccess";

export const studentRoutes = [
  // Core student experience
  { path: "/news-feed", element: <NewsFeed /> },
  { path: "/notifications", element: <Notification /> },
  { path: "/messages", element: <ChatPage /> },
  { path: "/lost-and-found", element: <LostAndFound /> },
  { path: "/my-lost-and-found", element: <MyLostAndFound /> },
  { path: "/marketplace", element: <Marketplace /> },
  { path: "/marketplace-items", element: <MarketplaceItems /> },
  { path: "/events-today", element: <EventsToday /> },
  { path: "/new-announcements", element: <NewAnnouncements /> },
  { path: "/student/followings", element: <Followings /> },

  // Learning
  { path: "/learning", element: <BatchRepLearningDashboard /> },
  { path: "/student-learning", element: <StudentLearningDashboard /> },

  // Profile & saved content
  { path: "/profile", element: <OwnProfilePage /> },
  { path: "/profile/edit", element: <EditProfilePage /> },
  { path: "/profile/security", element: <SecurityPage /> },
  { path: "/profile/:userId", element: <PublicProfilePage /> },
  { path: "/my-saved-posts", element: <MySavedPosts /> },
  { path: "/profile/reviews", element: <MyReviewHistory /> },

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
];

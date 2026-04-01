import React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ScrollToTop from "../components/common/ScrollToTop";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import RegisterAccountTypePage from "../pages/RegisterAccountTypePage";
import RegisterCredentialsPage from "../pages/RegisterCredentialsPage";
import RegisterOtpPage from "../pages/RegisterOtpPage";
import RegisterProfilePage from "../pages/RegisterProfilePage";
import RegisterSuccessPage from "../pages/RegisterSuccessPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import LandingHome from "../pages/LandingHome";
import AboutPage from "../pages/AboutPage";
import FeaturesPage from "../pages/FeaturesPage";
import SupportPage from "../pages/SupportPage";
import PricingPage from "../pages/PricingPage";
import VerificationQueue from "../pages/VerificationQueue";
import AdminDashboard from "../pages/AdminDashboard";
import RevenueOverview from "../pages/RevenueOverview";
import ActiveBusinesses from "../pages/ActiveBusinesses";
import BusinessProfile from "../pages/BusinessProfile";
import StudentManagement from "../pages/StudentManagement";
import StudentUserProfile from "../pages/StudentUserProfile";
import BoostController from "../pages/BoostController";
import BoostPackageForm from "../pages/BoostPackageForm";
import ReportModeration from "../pages/ReportModeration";
import ReportDetail from "../pages/ReportDetail";
import { BoostPackageProvider } from "../context/BoostPackageContext";
import ClubVerification from "../pages/ClubVerification";
import BatchRepVerification from "../pages/BatchRepVerification";
import SuspendedUsers from "../pages/SuspendedUsers";
import SuspendedUserProfile from "../pages/SuspendedUserProfile";
import SuspendedUserReactivation from "../pages/SuspendedUserReactivation";
import SuspendedUserSuccess from "../pages/SuspendedUserSuccess";
import { mockRequests } from "../data/mockData";
import NewsFeed from "../pages/NewsFeed";
import MarketplaceItems from "../pages/MarketplaceItems";
import EventsToday from "../pages/EventsToday";
import NewAnnouncements from "../pages/NewAnnouncements";
import Marketplace from "../pages/Marketplace";
import Club from "../pages/Club";
import ClubProduct from "../pages/ClubProduct";
import Boarding from "../pages/Boarding";
import LostAndFound from "../pages/LostAndFound";
import FoodCafe from "../pages/FoodCafe";
import Services from "../pages/Services";
import ClubCheckout from "../pages/ClubCheckout";
import ClubPaymentSuccess from "../pages/ClubPaymentSuccess";
import MyOrders from "../pages/MyOrders";
import BoostSelectPackage from "../pages/BoostSelectPackage";
import BoostConfirmOrder from "../pages/BoostConfirmOrder";
import BoostPostSuccess from "../pages/BoostPostSuccess";
import BoostAnalytics from "../pages/BoostAnalytics";


import NotFound from "../pages/NotFound";
import MarketplaceReviews from "../pages/MarketplaceReviews";
import MyReviewHistory from "../pages/MyReviewHistory";
import ReceivedReviews from "../pages/ReceivedReviews";
import FollowersDirectory from "../pages/FollowersDirectory";
import Followings from "../pages/Followings";
import StudentReportIssue from "../pages/StudentReportIssue";
import StudentReportSuccess from "../pages/StudentReportSuccess";
import StudentSubmittedReports from "../pages/StudentSubmittedReports";
import StudentReportDetail from "../pages/StudentReportDetail";
import StudentReportWithdrawal from "../pages/StudentReportWithdrawal";
import StudentReportWithdrawalSuccess from "../pages/StudentReportWithdrawalSuccess";

const PlaceholderPage = ({ title, verificationCount }) => (
  <MainLayout
    user={{ name: "Alex Johnson", role: "admin" }}
    pageTitle={title}
    verificationCount={verificationCount}
  >
    <div className="flex flex-col items-center justify-center h-full text-center p-lg">
      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-lg">
        <span className="text-heading-large">🚧</span>
      </div>
      <h1 className="text-heading-medium text-text-primary mb-sm">{title}</h1>
      <p className="text-body-medium text-text-secondary max-w-md">
        This feature is currently under development. Check back soon for
        updates!
      </p>
    </div>
  </MainLayout>
);

// Root layout wraps every route in the BoostPackageProvider
const RootLayout = () => (
  <BoostPackageProvider>
    <ScrollToTop />
    <Outlet />
  </BoostPackageProvider>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <LandingHome />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/register/account-type",
        element: <RegisterAccountTypePage />,
      },
      {
        path: "/register/credentials",
        element: <RegisterCredentialsPage />,
      },
      {
        path: "/register/otp",
        element: <RegisterOtpPage />,
      },
      {
        path: "/register/profile",
        element: <RegisterProfilePage />,
      },
      {
        path: "/register/success",
        element: <RegisterSuccessPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/features",
        element: <FeaturesPage />,
      },
      {
        path: "/support",
        element: <SupportPage />,
      },
      {
        path: "/pricing",
        element: <PricingPage />,
      },
      {
        path: "/verification-queue",
        element: <VerificationQueue />,
      },
      {
        path: "/boost-controller",
        element: <BoostController />,
      },
      {
        path: "/boost-controller/new",
        element: <BoostPackageForm />,
      },
      {
        path: "/boost-controller/edit/:id",
        element: <BoostPackageForm />,
      },
      {
        path: "/boost-controller/analytics/:id",
        element: <BoostAnalytics />,
      },
      {
        path: "/business/boost-post",
        element: <BoostSelectPackage />,
      },
      {
        path: "/business/boost-post/confirm",
        element: <BoostConfirmOrder />,
      },
      {
        path: "/business/boost-post/success",
        element: <BoostPostSuccess />,
      },
      {
        path: "/club-verification",
        element: <ClubVerification />,
      },
      {
        path: "/batch-rep-verification",
        element: <BatchRepVerification />,
      },
      {
        path: "/revenue-overview",
        element: <RevenueOverview />,
      },
      {
        path: "/active-businesses",
        element: <ActiveBusinesses />,
      },
      {
        path: "/active-businesses/:id",
        element: <BusinessProfile />,
      },
      {
        path: "/student-management",
        element: <StudentManagement />,
      },
      {
        path: "/student-management/:id",
        element: <StudentUserProfile />,
      },
      {
        path: "/news-feed",
        element: <NewsFeed />,
      },
      {
        path: "/business/news-feed",
        element: <NewsFeed userRole="business" />,
      },
      {
        path: "/marketplace-items",
        element: <MarketplaceItems />,
      },
      {
        path: "/events-today",
        element: <EventsToday />,
      },
      {
        path: "/new-announcements",
        element: <NewAnnouncements />,
      },
      {
        path: "/notifications",
        element: (
          <PlaceholderPage
            title="Notifications"
            verificationCount={mockRequests.length}
          />
        ),
      },
      {
        path: "/messages",
        element: (
          <PlaceholderPage
            title="Messages"
            verificationCount={mockRequests.length}
          />
        ),
      },
      {
        path: "/lost-and-found",
        element: <LostAndFound />,
      },
      { path: "/marketplace", element: <Marketplace /> },
      { path: "/marketplace/club", element: <Club /> },
      { path: "/marketplace/club/product", element: <ClubProduct /> },
      { path: "/marketplace/club/checkout", element: <ClubCheckout /> },
      { path: "/marketplace/club/payment-success", element: <ClubPaymentSuccess /> },
      { path: "/marketplace/food-cafe", element: <FoodCafe /> },
      { path: "/marketplace/services", element: <Services /> },
      { path: "/club/followers", element: <FollowersDirectory /> },
      { path: "/student/followings", element: <Followings /> },
      { path: "/marketplace/boarding", element: <Boarding /> },
      { path: "/marketplace/reviews", element: <MarketplaceReviews /> },
      { path: "/profile/reviews", element: <MyReviewHistory /> },
      { path: "/business/reviews", element: <ReceivedReviews /> },
      {
        path: "/learning",
        element: (
          <PlaceholderPage
            title="Learning"
            verificationCount={mockRequests.length}
          />
        ),
      },
      {
        path: "/report-moderation",
        element: <ReportModeration />,
      },
      {
        path: "/report-moderation/:id",
        element: <ReportDetail />,
      },
      {
        path: "/suspended-users",
        element: <SuspendedUsers />,
      },
      {
        path: "/suspended-users/:id",
        element: <SuspendedUserProfile />,
      },
      {
        path: "/suspended-users/:id/reactivate",
        element: <SuspendedUserReactivation />,
      },
      {
        path: "/suspended-users/:id/success",
        element: <SuspendedUserSuccess />,
      },
      {
        path: "/boost-controller",
        element: (
          <PlaceholderPage
            title="Boost Controller"
            verificationCount={mockRequests.length}
          />
        ),
      },
      {
        path: "/my-products",
        element: (
          <PlaceholderPage
            title="My Products"
            verificationCount={mockRequests.length}
          />
        ),
      },
      { path: '/order-history', element: <MyOrders /> },
      { path: '/student/report-issue', element: <StudentReportIssue /> },
      { path: '/student/report-success', element: <StudentReportSuccess /> },
      { path: '/student/reports', element: <StudentSubmittedReports /> },
      { path: '/student/reports/:id', element: <StudentReportDetail /> },
      { path: '/student/reports/:id/withdraw', element: <StudentReportWithdrawal /> },
      { path: '/student/reports/:id/withdraw/success', element: <StudentReportWithdrawalSuccess /> },
      {
        path: "/order-dashboard",
        element: (
          <PlaceholderPage
            title="Order Dashboard"
            verificationCount={mockRequests.length}
          />
        ),
      },
    ],
  },
]);

export default router;

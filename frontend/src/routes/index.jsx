import React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import LandingHome from "../pages/LandingHome";
import AboutPage from "../pages/AboutPage";
import FeaturesPage from "../pages/FeaturesPage";
import SupportPage from "../pages/SupportPage";
import PricingPage from "../pages/PricingPage";
import VerificationQueue from "../pages/VerificationQueue";
import AdminDashboard from "../pages/AdminDashboard";
import RevenueOverview from "../pages/RevenueOverview";
import ActiveBusinesses from "../pages/ActiveBusinesses";
import StudentManagement from "../pages/StudentManagement";
import BoostController from "../pages/BoostController";
import BoostPackageForm from "../pages/BoostPackageForm";
import { BoostPackageProvider } from "../context/BoostPackageContext";
import ClubVerification from "../pages/ClubVerification";
import BatchRepVerification from "../pages/BatchRepVerification";
import { mockRequests } from "../data/mockData";
import NewsFeed from "../pages/NewsFeed";
import MarketplaceItems from "../pages/MarketplaceItems";
import EventsToday from "../pages/EventsToday";
import NewAnnouncements from "../pages/NewAnnouncements";
import Marketplace from "../pages/Marketplace";
import Club from "../pages/Club";
import ClubProduct from "../pages/ClubProduct";
import Boarding from "../pages/Boarding";
import FoodCafe from "../pages/FoodCafe";
import Services from "../pages/Services";



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
    <Outlet />
  </BoostPackageProvider>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <AdminDashboard />,
      },
      {
        path: "/landing",
        element: <LandingHome />,
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
        path: "/student-management",
        element: <StudentManagement />,
      },
      {
        path: "/news-feed",
        element: <NewsFeed />,
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
        element: (
          <PlaceholderPage
            title="Lost & Found"
            verificationCount={mockRequests.length}
          />
        ),
      },
      { path: "/marketplace", element: <Marketplace /> },
      { path: "/marketplace/club", element: <Club /> },
      { path: "/marketplace/club/product", element: <ClubProduct /> },
      { path: "/marketplace/boarding", element: <Boarding /> },
      { path: "/marketplace/food-cafe", element: <FoodCafe /> },
      { path: "/marketplace/services", element: <Services /> },


      { path: '/learning', element: <PlaceholderPage title="Learning" verificationCount={mockRequests.length} /> },
      { path: '/report-moderation', element: <PlaceholderPage title="Report Moderation" verificationCount={mockRequests.length} /> },
      { path: '/suspended-users', element: <PlaceholderPage title="Suspended Users" verificationCount={mockRequests.length} /> },
      { path: '/boost-controller', element: <PlaceholderPage title="Boost Controller" verificationCount={mockRequests.length} /> },
      { path: '/my-products', element: <PlaceholderPage title="My Products" verificationCount={mockRequests.length} /> },
      { path: '/order-history', element: <PlaceholderPage title="Order History" verificationCount={mockRequests.length} /> },
      { path: '/order-dashboard', element: <PlaceholderPage title="Order Dashboard" verificationCount={mockRequests.length} /> },
    ]
  }]);

export default router;

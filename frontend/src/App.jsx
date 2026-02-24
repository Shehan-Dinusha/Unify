import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import MainLayout from "./components/layout/MainLayout";
import VerificationQueue from "./pages/VerificationQueue";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LandingHome from "./pages/LandingHome";
import AboutPage from "./pages/AboutPage";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import SupportPage from "./pages/SupportPage";
import AdminDashboard from "./pages/AdminDashboard";
import { mockRequests } from "./data/mockData";

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

function App() {
  const verificationCount = mockRequests.length;

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingHome />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verification-queue" element={<VerificationQueue />} />
        <Route
          path="/news-feed"
          element={
            <PlaceholderPage
              title="News Feed"
              verificationCount={verificationCount}
            />
          }
        />
        <Route
          path="/notifications"
          element={
            <PlaceholderPage
              title="Notifications"
              verificationCount={verificationCount}
            />
          }
        />
        <Route
          path="/messages"
          element={
            <PlaceholderPage
              title="Messages"
              verificationCount={verificationCount}
            />
          }
        />
        <Route
          path="/lost-and-found"
          element={
            <PlaceholderPage
              title="Lost & Found"
              verificationCount={verificationCount}
            />
          }
        />
        <Route
          path="/marketplace"
          element={
            <PlaceholderPage
              title="Marketplace"
              verificationCount={verificationCount}
            />
          }
        />
        <Route
          path="/learning"
          element={
            <PlaceholderPage
              title="Learning"
              verificationCount={verificationCount}
            />
          }
        />
        <Route
          path="/report-moderation"
          element={
            <PlaceholderPage
              title="Report Moderation"
              verificationCount={verificationCount}
            />
          }
        />
        <Route
          path="/suspended-users"
          element={
            <PlaceholderPage
              title="Suspended Users"
              verificationCount={verificationCount}
            />
          }
        />
        <Route
          path="/boost-controller"
          element={
            <PlaceholderPage
              title="Boost Controller"
              verificationCount={verificationCount}
            />
          }
        />
        <Route
          path="/my-products"
          element={
            <PlaceholderPage
              title="My Products"
              verificationCount={verificationCount}
            />
          }
        />
        <Route
          path="/order-history"
          element={
            <PlaceholderPage
              title="Order History"
              verificationCount={verificationCount}
            />
          }
        />
        <Route
          path="/order-dashboard"
          element={
            <PlaceholderPage
              title="Order Dashboard"
              verificationCount={verificationCount}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

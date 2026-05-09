import React from "react";
import MainLayout from "../components/layout/MainLayout";
import { mockRequests } from "../data/mockData";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import NewsFeed from "../pages/NewsFeed";
import Marketplace from "../pages/Marketplace";
import Club from "../pages/Club";
import ClubOwnerMarketplace from "../pages/ClubOwnerMarketplace";
import ClubProduct from "../pages/ClubProduct";
import ClubCheckout from "../pages/ClubCheckout";
import ClubPaymentSuccess from "../pages/ClubPaymentSuccess";
import ClubOwnerDashboard from "../pages/ClubOwnerDashboard";
import ProductOrderDashboard from "../pages/ProductOrderDashboard";
import ClubWalletPage from "../pages/ClubWalletPage";
import FollowersDirectory from "../pages/FollowersDirectory";
import CreateProductPage from "../pages/CreateProductPage";
import CreateEventPage from "../pages/CreateEventPage";
import CreateNormalPostPage from "../pages/CreateNormalPostPage";
import MyPosts from "../pages/MyPosts";

import Boarding from "../pages/Boarding";
import BoardingOwnerMarketplace from "../pages/BoardingOwnerMarketplace";
import CreateBoardingPostPage from "../pages/CreateBoardingPostPage";

import FoodCafe from "../pages/FoodCafe";
import FoodCafeOwnerMarketplace from "../pages/FoodCafeOwnerMarketplace";
import CreateFoodCafePostPage from "../pages/CreateFoodCafePostPage";

import Services from "../pages/Services";
import ServicesOwnerMarketplace from "../pages/ServicesOwnerMarketplace";
import CreateServicePostPage from "../pages/CreateServicePostPage";

import MarketplaceReviews from "../pages/MarketplaceReviews";
import ReceivedReviews from "../pages/ReceivedReviews";
import BoostSelectPackage from "../pages/BoostSelectPackage";
import BoostConfirmOrder from "../pages/BoostConfirmOrder";
import BoostPostSuccess from "../pages/BoostPostSuccess";

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

export const businessSharedRoutes = [
  { path: "/business/news-feed", element: <NewsFeed userRole="business" /> },
  { path: "/business/reviews", element: <ReceivedReviews /> },
  { path: "/marketplace", element: <Marketplace /> },
  { path: "/marketplace/reviews", element: <MarketplaceReviews /> },
  { path: "/business/boost-post", element: <BoostSelectPackage /> },
  { path: "/business/boost-post/confirm", element: <BoostConfirmOrder /> },
  { path: "/business/boost-post/success", element: <BoostPostSuccess /> },
  { path: "/my-posts", element: <MyPosts /> },
  {
    path: "/order-dashboard",
    element: (
      <PlaceholderPage
        title="Order Dashboard"
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
];

// Clubs & societies
export const clubRoutes = [
  {
    element: <ProtectedRoute allowedRoles={["Club", "Admin"]} />,
    children: [
      //{ path: "/marketplace/club", element: <Club /> },
      { path: "/club-owner/marketplace", element: <ClubOwnerMarketplace /> },
      { path: "/club-owner/create-product", element: <CreateProductPage /> },
      { path: "/club-owner/create-event", element: <CreateEventPage /> },
      { path: "/club-owner/create-post", element: <CreateNormalPostPage /> },
      { path: "/club-owner/dashboard", element: <ClubOwnerDashboard /> },
      { path: "/club-owner/product-orders/:type/:id", element: <ProductOrderDashboard /> },
      { path: "/club-owner/wallet", element: <ClubWalletPage /> },
      { path: "/marketplace/club/product/:type/:id", element: <ClubProduct /> },
      { path: "/marketplace/club/checkout", element: <ClubCheckout /> },
      { path: "/marketplace/club/payment-success", element: <ClubPaymentSuccess /> },
      { path: "/club/followers", element: <FollowersDirectory /> },
    ]
  }
];

// Boarding owners
export const boardingOwnerRoutes = [
  {
    element: <ProtectedRoute allowedRoles={["Business", "Admin"]} allowedCategories={["BOARDING"]} />,
    children: [
      { path: "/marketplace/boarding", element: <Boarding /> },
      { path: "/boarding-owner/marketplace", element: <BoardingOwnerMarketplace /> },
      { path: "/boarding-owner/create-post", element: <CreateBoardingPostPage /> },
    ]
  }
];

// Food & café
export const foodCafeRoutes = [
  {
    element: <ProtectedRoute allowedRoles={["Business", "Admin"]} allowedCategories={["FOOD"]} />,
    children: [
      { path: "/marketplace/food-cafe", element: <FoodCafe /> },
      { path: "/food-cafe-owner/marketplace", element: <FoodCafeOwnerMarketplace /> },
      { path: "/food-cafe-owner/create-post", element: <CreateFoodCafePostPage /> },
    ]
  }
];

// Self-employed services
export const selfEmployedRoutes = [
  {
    element: <ProtectedRoute allowedRoles={["Business", "Admin"]} allowedCategories={["SELF_EMPLOYED"]} />,
    children: [
      { path: "/marketplace/services", element: <Services /> },
      { path: "/services-owner/marketplace", element: <ServicesOwnerMarketplace /> },
      { path: "/services-owner/create-post", element: <CreateServicePostPage /> },
    ]
  }
];

export const businessRoutes = [
  ...businessSharedRoutes,
  ...clubRoutes,
  ...boardingOwnerRoutes,
  ...foodCafeRoutes,
  ...selfEmployedRoutes,
];

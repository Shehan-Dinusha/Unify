import lazyWithRetry from "../utils/lazyWithRetry";
import React from "react";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const NewsFeed = lazyWithRetry(() => import("../pages/NewsFeed"));
const Marketplace = lazyWithRetry(() => import("../pages/Marketplace"));
const ClubVerification = lazyWithRetry(() => import("../pages/ClubVerification"));
const ClubOwnerMarketplace = lazyWithRetry(() => import("../pages/ClubOwnerMarketplace"));
const ClubProduct = lazyWithRetry(() => import("../pages/ClubProduct"));
const ClubCheckout = lazyWithRetry(() => import("../pages/ClubCheckout"));
const ClubPaymentSuccess = lazyWithRetry(() => import("../pages/ClubPaymentSuccess"));
const ClubOwnerDashboard = lazyWithRetry(() => import("../pages/ClubOwnerDashboard"));
const ProductOrderDashboard = lazyWithRetry(() => import("../pages/ProductOrderDashboard"));
const ClubWalletPage = lazyWithRetry(() => import("../pages/ClubWalletPage"));
const FollowersDirectory = lazyWithRetry(() => import("../pages/FollowersDirectory"));
const CreateProductPage = lazyWithRetry(() => import("../pages/CreateProductPage"));
const CreateEventPage = lazyWithRetry(() => import("../pages/CreateEventPage"));
const CreateNormalPostPage = lazyWithRetry(() => import("../pages/CreateNormalPostPage"));
const MyPosts = lazyWithRetry(() => import("../pages/MyPosts"));
const ChatPage = lazyWithRetry(() => import("../pages/chat/ChatPage"));
const OwnProfilePage = lazyWithRetry(() => import("../pages/profile/OwnProfilePage"));
const EditProfilePage = lazyWithRetry(() => import("../pages/profile/EditProfilePage"));
const SecurityPage = lazyWithRetry(() => import("../pages/profile/SecurityPage"));
const PublicProfilePage = lazyWithRetry(() => import("../pages/profile/PublicProfilePage"));

const BoardingOwnerMarketplace = lazyWithRetry(() => import("../pages/BoardingOwnerMarketplace"));
const CreateBoardingPostPage = lazyWithRetry(() => import("../pages/CreateBoardingPostPage"));

const FoodCafeOwnerMarketplace = lazyWithRetry(() => import("../pages/FoodCafeOwnerMarketplace"));
const CreateFoodCafePostPage = lazyWithRetry(() => import("../pages/CreateFoodCafePostPage"));

const ServicesOwnerMarketplace = lazyWithRetry(() => import("../pages/ServicesOwnerMarketplace"));
const CreateServicePostPage = lazyWithRetry(() => import("../pages/CreateServicePostPage"));

const MarketplaceReviews = lazyWithRetry(() => import("../pages/MarketplaceReviews"));
const ReceivedReviews = lazyWithRetry(() => import("../pages/ReceivedReviews"));
const MyReviewHistory = lazyWithRetry(() => import("../pages/MyReviewHistory"));
const BoostSelectPackage = lazyWithRetry(() => import("../pages/BoostSelectPackage"));
const BoostConfirmOrder = lazyWithRetry(() => import("../pages/BoostConfirmOrder"));
const BoostPostSuccess = lazyWithRetry(() => import("../pages/BoostPostSuccess"));
const BoostAnalytics = lazyWithRetry(() => import("../pages/BoostAnalytics"));

// eslint-disable-next-line react-refresh/only-export-components
const PlaceholderPage = ({ title }) => (
  <MainLayout
    pageTitle={title}
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
  { path: "/marketplace/:targetId/reviews", element: <MarketplaceReviews /> },
  { path: "/business/boost-post", element: <BoostSelectPackage /> },
  { path: "/business/boost-post/confirm", element: <BoostConfirmOrder /> },
  { path: "/business/boost-post/success", element: <BoostPostSuccess /> },
  // Business user boost analytics — accessed from My Posts when a boost is active
  { path: "/boost-analytics/:purchaseId", element: <BoostAnalytics /> },
  { path: "/my-posts", element: <MyPosts /> },
  { path: "/messages", element: <ChatPage /> },
  { path: "/profile", element: <OwnProfilePage /> },
  { path: "/profile/edit", element: <EditProfilePage /> },
  { path: "/profile/security", element: <SecurityPage /> },
  { path: "/profile/:userId", element: <PublicProfilePage /> },
  {
    path: "/order-dashboard",
    element: (
      <PlaceholderPage
        title="Order Dashboard"
      />
    ),
  },
  {
    path: "/my-products",
    element: (
      <PlaceholderPage
        title="My Products"
      />
    ),
  },
];

// Clubs & societies
export const clubRoutes = [
  // Club verification — accessible without being verified
  {
    element: <ProtectedRoute allowedRoles={["Club"]} />,
    children: [
      { path: "/club-verification", element: <ClubVerification /> },
    ],
  },
  // All other club routes require verification
  {
    element: <ProtectedRoute allowedRoles={["Club"]} requireVerified />,
    children: [
      { path: "/club-owner/marketplace", element: <ClubOwnerMarketplace /> },
      { path: "/club-owner/create-product", element: <CreateProductPage /> },
      { path: "/club-owner/create-event", element: <CreateEventPage /> },
      { path: "/club-owner/create-post", element: <CreateNormalPostPage /> },
      { path: "/club-owner/dashboard", element: <ClubOwnerDashboard /> },
      {
        path: "/club-owner/product-orders/:type/:id",
        element: <ProductOrderDashboard />,
      },
      { path: "/club-owner/wallet", element: <ClubWalletPage /> },
      { path: "/marketplace/club/product/:type/:id", element: <ClubProduct /> },
      { path: "/marketplace/club/checkout", element: <ClubCheckout /> },
      { path: "/marketplace/club/payment-success", element: <ClubPaymentSuccess /> },
      { path: "/profile/reviews", element: <MyReviewHistory /> },
      { path: "/club/followers", element: <FollowersDirectory /> },
    ],
  },
];

// Boarding owners
export const boardingOwnerRoutes = [
  {
    element: (
      <ProtectedRoute
        allowedRoles={["Business"]}
        allowedCategories={["BOARDING"]}
      />
    ),
    children: [

      { path: "/boarding-owner/marketplace", element: <BoardingOwnerMarketplace /> },
      { path: "/boarding-owner/create-post", element: <CreateBoardingPostPage /> },
    ]
  }
];

// Food & café
export const foodCafeRoutes = [
  {
    element: (
      <ProtectedRoute
        allowedRoles={["Business"]}
        allowedCategories={["FOOD"]}
      />
    ),
    children: [

      { path: "/food-cafe-owner/marketplace", element: <FoodCafeOwnerMarketplace /> },
      { path: "/food-cafe-owner/create-post", element: <CreateFoodCafePostPage /> },
    ]
  }
];

// Self-employed services
export const selfEmployedRoutes = [
  {
    element: (
      <ProtectedRoute
        allowedRoles={["Business"]}
        allowedCategories={["SELF_EMPLOYED"]}
      />
    ),
    children: [

      { path: "/services-owner/marketplace", element: <ServicesOwnerMarketplace /> },
      { path: "/services-owner/create-post", element: <CreateServicePostPage /> },
    ]
  }
];

export const businessRoutes = [
  {
    element: <ProtectedRoute allowedRoles={["Business", "Club"]} requireVerified />,
    children: businessSharedRoutes,
  },
  ...clubRoutes,
  ...boardingOwnerRoutes,
  ...foodCafeRoutes,
  ...selfEmployedRoutes,
];

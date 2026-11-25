import lazyWithRetry from "../utils/lazyWithRetry";
import { Navigate } from "react-router-dom";
import GuestRoute, { getDefaultPath } from "../components/auth/GuestRoute";
const LandingHome = lazyWithRetry(() => import("../pages/LandingHome"));
const AboutPage = lazyWithRetry(() => import("../pages/AboutPage"));
const FeaturesPage = lazyWithRetry(() => import("../pages/FeaturesPage"));
const SupportPage = lazyWithRetry(() => import("../pages/SupportPage"));
const PricingPage = lazyWithRetry(() => import("../pages/PricingPage"));

// eslint-disable-next-line react-refresh/only-export-components
const IndexRoute = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return <LandingHome />;
  return <Navigate to={getDefaultPath(JSON.parse(userStr))} replace />;
};

export const publicRoutes = [
  { path: "/", element: <IndexRoute /> },
  {
    element: <GuestRoute />,
    children: [
      { path: "/about", element: <AboutPage /> },
      { path: "/features", element: <FeaturesPage /> },
      { path: "/support", element: <SupportPage /> },
      { path: "/pricing", element: <PricingPage /> },
    ],
  },
];

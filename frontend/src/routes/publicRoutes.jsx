import { Navigate } from "react-router-dom";
import GuestRoute, { getDefaultPath } from "../components/auth/GuestRoute";
import LandingHome from "../pages/LandingHome";
import AboutPage from "../pages/AboutPage";
import FeaturesPage from "../pages/FeaturesPage";
import SupportPage from "../pages/SupportPage";
import PricingPage from "../pages/PricingPage";

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

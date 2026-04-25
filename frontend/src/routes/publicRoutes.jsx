import LandingHome from "../pages/LandingHome";
import AboutPage from "../pages/AboutPage";
import FeaturesPage from "../pages/FeaturesPage";
import SupportPage from "../pages/SupportPage";
import PricingPage from "../pages/PricingPage";

export const publicRoutes = [
  { path: "/", element: <LandingHome /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/features", element: <FeaturesPage /> },
  { path: "/support", element: <SupportPage /> },
  { path: "/pricing", element: <PricingPage /> },
];

import React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import ScrollToTop from "../components/common/ScrollToTop";
import { BoostPackageProvider } from "../context/BoostPackageContext";
import { SavedPostsProvider } from "../context/SavedPostsContext";
import NotFound from "../pages/NotFound";
import { authRoutes } from "./authRoutes";
import { studentRoutes } from "./studentRoutes";
import { businessRoutes } from "./businessRoutes";
import { adminRoutes } from "./adminRoutes";
import { publicRoutes } from "./publicRoutes";

// Root layout wraps every route in the BoostPackageProvider
const RootLayout = () => (
  <SavedPostsProvider>
    <BoostPackageProvider>
      <ScrollToTop />
      <Outlet />
    </BoostPackageProvider>
  </SavedPostsProvider>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      ...publicRoutes,
      ...authRoutes,
      ...studentRoutes,
      ...businessRoutes,
      ...adminRoutes,
    ],
  },
]);

export default router;

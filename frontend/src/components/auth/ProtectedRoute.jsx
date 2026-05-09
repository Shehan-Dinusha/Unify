import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import NotFound from "../../pages/NotFound";

const ProtectedRoute = ({ allowedRoles, allowedCategories }) => {
  const location = useLocation();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // 1. If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If the route specifies allowed roles, check against the user's role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <NotFound />;
  }

  // 3. If the route specifies allowed categories (for Business users), check against user's category
  if (allowedCategories && !allowedCategories.includes(user.category)) {
    return <NotFound />;
  }

  // If all checks pass, render the child routes
  return <Outlet />;
};

// Helper function to redirect unauthorized users back to their own dashboard
const getDefaultDashboard = (user) => {
  if (user.role === "Student") return "/marketplace";
  if (user.role === "Club") return "/club-owner/marketplace";
  if (user.role === "Admin") return "/admin/dashboard";
  
  if (user.role === "Business") {
    switch (user.category) {
      case "FOOD":
        return "/food-cafe-owner/marketplace";
      case "BOARDING":
        return "/boarding-owner/marketplace";
      case "SELF_EMPLOYED":
        return "/services-owner/marketplace";
      default:
        return "/marketplace";
    }
  }

  return "/";
};

export default ProtectedRoute;

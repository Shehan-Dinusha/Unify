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
    return <NotFound status={403} />;
  }

  // 3. If the route specifies allowed categories (for Business users), check against user's category
  if (allowedCategories && !allowedCategories.includes(user.category)) {
    return <NotFound status={403} />;
  }

  // If all checks pass, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;

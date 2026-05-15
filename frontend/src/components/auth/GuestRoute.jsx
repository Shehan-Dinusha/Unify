import { Navigate, Outlet } from "react-router-dom";

const rolePaths = {
  Student: "/news-feed",
  Club: "/club-owner/marketplace",
  Admin: "/admin",
  Business: {
    FOOD: "/food-cafe-owner/marketplace",
    BOARDING: "/boarding-owner/marketplace",
    SELF_EMPLOYED: "/services-owner/marketplace",
  },
};

export const getDefaultPath = (user) => {
  if (!user) return "/";
  return rolePaths[user.role]?.[user.category] || rolePaths[user.role] || "/";
};

const GuestRoute = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    const user = JSON.parse(userStr);
    return <Navigate to={getDefaultPath(user)} replace />;
  }
  return <Outlet />;
};

export default GuestRoute;

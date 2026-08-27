import { Navigate, Outlet, useSearchParams } from "react-router-dom";

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

// eslint-disable-next-line react-refresh/only-export-components
export const getDefaultPath = (user) => {
  if (!user) return "/";
  if (user.hasProfile === false) {
    return "/profile/edit";
  }
  return rolePaths[user.role]?.[user.category] || rolePaths[user.role] || "/";
};

const GuestRoute = () => {
  const [searchParams] = useSearchParams();
  const isAddAccount = searchParams.get("addAccount") === "true";

  if (isAddAccount) {
    return <Outlet />;
  }

  const userStr = localStorage.getItem("user");
  if (userStr) {
    const user = JSON.parse(userStr);
    return <Navigate to={getDefaultPath(user)} replace />;
  }
  return <Outlet />;
};

export default GuestRoute;

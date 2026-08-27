import { Navigate, Outlet, useSearchParams, useLocation } from "react-router-dom";

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
  if (user.hasProfile === false) {
    return "/profile/edit";
  }
  return rolePaths[user.role]?.[user.category] || rolePaths[user.role] || "/";
};

const GuestRoute = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isAddAccount = searchParams.get("addAccount") === "true";

  if (isAddAccount) {
    return <Outlet />;
  }

  // Allow registration wizard steps (profile setup and success message)
  if (
    location.pathname === "/register/profile" ||
    location.pathname === "/register/success"
  ) {
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

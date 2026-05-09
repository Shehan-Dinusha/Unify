import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Rss,
  Bell,
  MessageSquare,
  PackageSearch,
  Store,
  GraduationCap,
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
} from "lucide-react";
import LogoutModal from "../profile/modals/LogoutModal";
import { getCurrentUser, logout } from "../../services/authService";

// Sub-component for individual Nav Items
const SidebarItem = ({
  icon: Icon,
  iconSrc,
  label,
  badge,
  active = false,
  isDanger = false,
  path,
  onClick,
  disabled = false,
}) => {
  const navigate = useNavigate();

  const baseStyles = `w-full px-md py-sm rounded-xl inline-flex justify-between items-center transition-all duration-200 ${disabled
    ? "opacity-40 grayscale-[0.2] pointer-events-none cursor-not-allowed"
    : "cursor-pointer group"
    }`;

  const activeStyles = active
    ? "bg-primary-blue shadow-custom text-text-primary"
    : isDanger
      ? "text-state-error hover:bg-state-error/10"
      : "text-text-secondary hover:bg-white/5 hover:text-text-primary";

  const handleClick = () => {
    if (disabled) return;
    if (path) navigate(path);
    if (onClick) onClick();
  };

  return (
    <div className={`${baseStyles} ${activeStyles}`} onClick={handleClick}>
      <div className="flex items-center gap-md">
        {iconSrc ? (
          <img
            src={iconSrc}
            alt={label}
            className={`w-[22px] h-[22px] object-contain transition-transform group-hover:scale-110 ${active ? "brightness-200 contrast-200" : "opacity-70 group-hover:opacity-100"}`}
          />
        ) : (
          <Icon
            size={22}
            className={
              active
                ? "text-text-primary"
                : "group-hover:scale-110 transition-transform"
            }
          />
        )}
        <span className="text-body-medium font-bold font-inter leading-5">
          {label}
        </span>
      </div>
      {!!badge && !active && (
        <div className="w-5 h-5 bg-primary-blue rounded-full flex justify-center items-center border border-white/10 shadow-lg">
          <span className="text-text-primary text-body-extra-small-bold font-inter">
            {badge}
          </span>
        </div>
      )}
    </div>
  );
};

const UnifiedSidebar = ({
  user: propUser,
  verificationCount,
  isOpen,
  onClose,
  sidebarDisabled = false,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  // Get user from auth or fallback to prop
  const authUser = getCurrentUser();
  const user = authUser || propUser || { name: "Guest", role: "student" };

  // Configuration Map for different user roles
  const roleConfigs = {
    student: {
      title: "Student Dashboard",
      links: [
        { icon: Rss, label: "News Feed", path: "/news-feed" },
        { icon: Bell, label: "Notification", badge: 3, path: "/notifications" },
        { icon: MessageSquare, label: "Message", badge: 3, path: "/messages" },
        { icon: PackageSearch, label: "Lost & Found", path: "/lost-and-found" },
        { icon: Store, label: "Marketplace", path: "/marketplace" },
        { icon: GraduationCap, label: "Learning", path: "/student-learning" },
      ],
    },
    batch_rep: {
      title: "Batch Rep Dashboard",
      links: [
        { icon: Rss, label: "News Feed", path: "/news-feed" },
        { icon: Bell, label: "Notification", badge: 3, path: "/notifications" },
        { icon: MessageSquare, label: "Message", badge: 3, path: "/messages" },
        { icon: PackageSearch, label: "Lost & Found", path: "/lost-and-found" },
        { icon: Store, label: "Marketplace", path: "/marketplace" },
        { icon: GraduationCap, label: "Learning", path: "/learning" },
      ],
    },
    admin: {
      title: "Admin Dashboard",
      links: [
        {
          iconSrc: "/icon_dashboard.svg",
          label: "Dashboard",
          path: "/admin",
          childPaths: [
            "/revenue-overview",
            "/active-businesses",
            "/student-management",
          ],
        },
        {
          iconSrc: "/icon_report_moderation.svg",
          label: "Report Moderation",
          badge: 3,
          path: "/report-moderation",
        },
        {
          iconSrc: "/icon_suspended_users.svg",
          label: "Suspended Users",
          badge: 3,
          path: "/suspended-users",
          childPaths: ["/suspended-users"],
        },
        {
          iconSrc: "/icon_boost_controller.svg",
          label: "Boost Controller",
          path: "/boost-controller",
        },
        {
          iconSrc: "/icon_tab_verified.svg",
          label: "Verification Queue",
          badge: verificationCount,
          path: "/verification-queue",
        },
      ],
    },
    club: {
      title: "Clubs & Societies Dashboard",
      links: [
        { icon: Rss, label: "News Feed", path: "/business/news-feed" },
        { icon: Bell, label: "Notification", badge: 3, path: "/notifications" },
        { icon: MessageSquare, label: "Message", badge: 3, path: "/messages" },
        { icon: Store, label: "Marketplace", path: "/club-owner/marketplace" },
        {
          icon: LayoutDashboard,
          label: "Order Dashboard",
          path: "/club-owner/dashboard",
        },
      ],
    },
    boarding_owner: {
      title: "Boarding Dashboard",
      links: [
        { icon: Rss, label: "News Feed", path: "/boarding-owner/marketplace" },
        { icon: Bell, label: "Notification", badge: 3, path: "/notifications" },
      ],
    },
    food_cafe_owner: {
      title: "Food & Cafe Dashboard",
      links: [
        { icon: Rss, label: "News Feed", path: "/food-cafe-owner/marketplace" },
        { icon: Bell, label: "Notification", badge: 3, path: "/notifications" },
      ],
    },
    self_employed: {
      title: "Services Dashboard",
      links: [
        { icon: Rss, label: "News Feed", path: "/services-owner/marketplace" },
        { icon: Bell, label: "Notification", badge: 3, path: "/notifications" },
      ],
    },
  };

  const isClub =
    user.role?.toLowerCase() === "club_society" ||
    user.role?.toLowerCase() === "club";
  const shouldDisableNav = sidebarDisabled && isClub;

  let configKey = user.role?.toLowerCase();
  if (configKey === "student" && user.isBatchRep) {
    configKey = "batch_rep";
  }
  // Map club_society to club config
  if (configKey === "club_society") {
    configKey = "club";
  }

  // Map generic business role to specific config if category exists
  if (configKey === "business") {
    const category = user.category || user.BusinessProfile?.category;
    if (category === "BOARDING") configKey = "boarding_owner";
    else if (category === "FOOD") configKey = "food_cafe_owner";
    else if (category === "SELF_EMPLOYED") configKey = "self_employed";
  }

  const currentConfig =
    roleConfigs[configKey] || roleConfigs.student;

  const handleNavClick = (path) => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`w-72 h-screen bg-dark-1 border-r border-white/10 flex flex-col justify-between items-start 
          fixed md:sticky top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Brand & Dynamic Navigation */}
        <div className="w-full p-lg md:p-md flex flex-col gap-lg">
          <div className="p-sm flex items-center gap-md">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-custom overflow-hidden">
              <img
                src="/icon_unify_logo.svg"
                alt="Unify Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-text-primary text-2xl font-bold font-inter leading-tight">
                Unify
              </h1>
              <p className="text-text-tertiary text-body-extra-small font-normal font-inter truncate">
                {currentConfig.title}
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-xs w-full">
            {currentConfig.links.map((link, index) => (
              <SidebarItem
                key={index}
                {...link}
                disabled={shouldDisableNav}
                active={
                  pathname === link.path ||
                  (link.childPaths &&
                    link.childPaths.some((cp) => pathname.startsWith(cp)))
                }
              />
            ))}
          </nav>
        </div>

        {/* Account Section */}
        <div className="w-full px-md pb-md flex flex-col gap-md">
          <div className="h-px bg-white/10 w-full" />

          <SidebarItem
            iconSrc="/icon_log_out.svg"
            label="Log Out"
            isDanger
            onClick={() => setShowLogoutModal(true)}
          />

          <div
            onClick={() => navigate("/profile?role=" + user.role)}
            className="w-full p-sm bg-white/5 rounded-2xl border border-white/10 flex items-center gap-md transition-colors group hover:bg-white/10 cursor-pointer"
          >
            <img
              className="w-10 h-10 rounded-full object-cover border border-white/20 group-hover:border-primary-blue transition-colors"
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2666F1&color=fff`
              }
              alt="Avatar"
            />
            <div className="overflow-hidden">
              <h4 className="text-text-primary text-body-medium-bold font-inter truncate">
                {user.name}
              </h4>
              <p className="text-text-tertiary text-body-extra-small font-normal font-inter uppercase tracking-widest">
                {user.role?.toLowerCase() === "student"
                  ? "Student"
                  : user.displayRole || user.role}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={() => {
            setShowLogoutModal(false);
            logout();
          }}
        />
      )}
    </>
  );
};

export default UnifiedSidebar;

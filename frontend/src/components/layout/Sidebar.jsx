import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rss, Bell, MessageSquare, PackageSearch, Store, GraduationCap, 
  LayoutDashboard, ShieldAlert, UserX, Zap, UserCheck, 
  ShoppingCart, ClipboardList, LogOut 
} from 'lucide-react';

// Sub-component for individual Nav Items
const SidebarItem = ({ icon: Icon, iconSrc, label, badge, active = false, isDanger = false, path }) => {
  const baseStyles = "w-full px-3 py-2.5 rounded-xl inline-flex justify-between items-center transition-all duration-200 cursor-pointer group";
  
  const activeStyles = active 
    ? "bg-primary-blue shadow-custom text-white" 
    : isDanger 
      ? "text-state-error hover:bg-state-error/10" 
      : "text-text-secondary hover:bg-white/5 hover:text-white";

  const navigate = useNavigate();

  return (
    <div 
      className={`${baseStyles} ${activeStyles}`}
      onClick={() => path && navigate(path)}
    >
      <div className="flex items-center gap-3">
        {iconSrc ? (
          <img 
            src={iconSrc} 
            alt={label} 
            className={`w-[22px] h-[22px] object-contain transition-transform group-hover:scale-110 ${active ? 'brightness-200 contrast-200' : 'opacity-70 group-hover:opacity-100'}`} 
          />
        ) : (
          <Icon size={22} className={active ? "text-white" : "group-hover:scale-110 transition-transform"} />
        )}
        <span className="text-base font-bold font-inter leading-5">{label}</span>
      </div>
      {badge && (
        <div className="w-5 h-5 bg-primary-blue rounded-full flex justify-center items-center border border-white/10 shadow-lg">
          <span className="text-white text-[10px] font-bold font-inter">{badge}</span>
        </div>
      )}
    </div>
  );
};

const UnifiedSidebar = ({ user }) => {
  // Configuration Map for different user roles
  const roleConfigs = {
    student: {
      title: "Student Dashboard",
      links: [
        { icon: Rss, label: "News Feed", active: true },
        { icon: Bell, label: "Notification", badge: 3 },
        { icon: MessageSquare, label: "Message", badge: 3 },
        { icon: PackageSearch, label: "Lost & Found" },
        { icon: Store, label: "Marketplace" },
        { icon: GraduationCap, label: "Learning" },
      ]
    },
    admin: {
      title: "Admin Dashboard",
      links: [
        { iconSrc: "/icon_dashboard.svg", label: "Dashboard", active: true, path: "/" },
        { iconSrc: "/icon_report_moderation.svg", label: "Report Moderation", badge: 3 },
        { iconSrc: "/icon_suspended_users.svg", label: "Suspended Users", badge: 3 },
        { iconSrc: "/icon_boost_controller.svg", label: "Boost Controller" },
        { iconSrc: "/icon_tab_verified.svg", label: "Verification Queue", badge: 3, path: "/verification-queue" },
      ]
    },
    business: {
      title: "Business Dashboard",
      links: [
        { icon: Rss, label: "News Feed", active: true },
        { icon: Bell, label: "Notification", badge: 3 },
        { icon: ShoppingCart, label: "My Products" },
        { icon: ClipboardList, label: "Order History" },
      ]
    },
    club: {
      title: "Clubs & Societies Dashboard",
      links: [
        { icon: Rss, label: "News Feed", active: true },
        { icon: Bell, label: "Notification", badge: 3 },
        { icon: MessageSquare, label: "Message", badge: 3 },
        { icon: LayoutDashboard, label: "Order Dashboard" },
      ]
    }
  };

  const currentConfig = roleConfigs[user.role.toLowerCase()] || roleConfigs.student;

  return (
    <aside className="w-72 h-screen bg-dark-1 border-r border-white/10 flex flex-col justify-between items-start sticky top-0">
      
      {/* Brand & Dynamic Navigation */}
      <div className="w-full p-4 flex flex-col gap-6">
        <div className="p-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-custom overflow-hidden">
            <img src="/icon_unify_logo.svg" alt="Unify Logo" className="w-full h-full object-contain" />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-white text-2xl font-bold font-inter leading-tight">Unify</h1>
            <p className="text-text-tertiary text-xs font-normal font-inter truncate">{currentConfig.title}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 w-full">
          {currentConfig.links.map((link, index) => (
            <SidebarItem key={index} {...link} />
          ))}
        </nav>
      </div>

      {/* Account Section */}
      <div className="w-full px-4 pb-6 flex flex-col gap-4">
        <div className="h-px bg-white/10 w-full" />
        
        <SidebarItem iconSrc="/icon_log_out.svg" label="Log Out" isDanger />

        <div className="w-full p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer group">
          <img 
            className="w-10 h-10 rounded-full object-cover border border-white/20 group-hover:border-primary-blue transition-colors" 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
            alt="Avatar" 
          />
          <div className="overflow-hidden">
            <h4 className="text-white text-base font-bold font-inter truncate">{user.name}</h4>
            <p className="text-text-tertiary text-[10px] font-normal font-inter uppercase tracking-widest">{user.displayRole || user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default UnifiedSidebar;
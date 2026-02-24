import React, { useState } from "react";
import UnifiedSidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = ({
  children,
  user,
  pageTitle,
  headerRight,
  verificationCount,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-app-bg flex font-inter selection:bg-primary-blue/30 relative overflow-hidden">
      {/* Background Orbs - Overlay */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary-blue/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-primary-accent/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 pointer-events-none z-50"></div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <UnifiedSidebar
        user={user}
        verificationCount={verificationCount}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Dynamic Header */}
        <Header
          title={pageTitle}
          rightContent={headerRight}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="pt-4 px-4 md:px-6 md:pt-6 lg:p-lg flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

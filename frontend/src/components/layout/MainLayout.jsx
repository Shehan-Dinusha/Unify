import React, { useState, useEffect } from "react";
import UnifiedSidebar from "./Sidebar";
import Header from "./Header";
import verificationService from "../../services/verificationService";

const MainLayout = ({
  children,
  user,
  pageTitle,
  headerRight,
  sidebarDisabled = false,
}) => {
  const [fetchedCount, setFetchedCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await verificationService.getPendingRequests();
        if (response.success) {
          setFetchedCount(response.data?.requests?.length || 0);
        }
      } catch {
        // Non-admin users will get a 403 — silently ignore
      }
    };
    fetchCount();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <div className="h-screen bg-app-bg flex font-inter selection:bg-primary-blue/30 relative">
      {/* Background Orbs - Overlay */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary-blue/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100]"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-primary-accent/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 pointer-events-none z-[100]"></div>

      {/* Fixed Sidebar */}
      <UnifiedSidebar
        user={user}
        verificationCount={fetchedCount}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sidebarDisabled={sidebarDisabled}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Dynamic Header */}
        <Header
          title={pageTitle}
          rightContent={headerRight}
          onMenuToggle={toggleSidebar}
        />

        {/* Page Content */}
        <main className="px-3.5 py-4 md:p-lg flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

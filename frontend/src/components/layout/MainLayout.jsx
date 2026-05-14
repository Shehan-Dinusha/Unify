import React, { useState, useEffect } from "react";
import UnifiedSidebar from "./Sidebar";
import Header from "./Header";
import verificationService from "../../services/verificationService";
import * as reportService from "../../services/reportService";
import * as suspensionService from "../../services/suspensionService";

const MainLayout = ({
  children,
  user,
  pageTitle,
  headerRight,
  sidebarDisabled = false,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [reportCount, setReportCount] = useState(0);
  const [suspensionCount, setSuspensionCount] = useState(0);
  const [verificationCount, setVerificationCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch Verification Count
        const vResponse = await verificationService.getPendingRequests();
        if (vResponse.success) {
          setVerificationCount(vResponse.data?.requests?.length || 0);
        }

        // Fetch Report Count
        const rResponse = await reportService.getReportStats();
        if (rResponse.success) {
          setReportCount(rResponse.data?.totalPending || 0);
        }

        // Fetch Suspension Count
        const sResponse = await suspensionService.getDashboardStatistics();
        if (sResponse.success) {
          setSuspensionCount(sResponse.data?.suspendedAccounts?.count || 0);
        }
      } catch (error) {
        // Non-admin users or network errors will fail — silently ignore for layout
      }
    };
    fetchCounts();
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
        verificationCount={verificationCount}
        reportCount={reportCount}
        suspensionCount={suspensionCount}
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

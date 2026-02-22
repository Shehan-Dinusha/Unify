import React from 'react';
import UnifiedSidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children, user, pageTitle, headerRight, verificationCount }) => {
  return (
    <div className="h-screen bg-app-bg flex font-inter selection:bg-primary-blue/30 relative">
      {/* Background Orbs - Overlay */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary-blue/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-primary-accent/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 pointer-events-none z-50"></div>

      {/* Fixed Sidebar */}
      <UnifiedSidebar user={user} verificationCount={verificationCount} />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Dynamic Header */}
        <Header title={pageTitle} rightContent={headerRight} />

        {/* Page Content */}
        <main className="p-lg flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
import React from "react";
import LoginHeader from "../auth/LoginHeader";
import LandingFooter from "../LandingFooter";

const LandingLayout = ({ children, Header = LoginHeader }) => {
  return (
    <div className="min-h-screen bg-app-bg flex flex-col font-inter relative overflow-x-hidden selection:bg-primary-blue/30">
      {/* Background Orbs (same concept as MainLayout) */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary-blue/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-primary-accent/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 pointer-events-none z-0"></div>

      {/* Header */}
      <Header />

      {/* Page Content */}
      <main className="flex-1 flex flex-col px-8 lg:px-28 relative z-10 w-full pt-20">
        {children}
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingLayout;

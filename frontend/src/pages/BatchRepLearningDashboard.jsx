import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import ModuleSidebar from "../components/learning/ModuleSidebar";
import ModuleHeader from "../components/learning/ModuleHeader";
import CategoryGrid from "../components/learning/CategoryGrid";
import FileListTable from "../components/learning/FileListTable";
import BatchRepTeam from "../components/learning/BatchRepTeam";
import {
  mockRequests,
  mockSemesters,
  mockLearningFiles,
  mockCurrentUser,
} from "../data/mockData";

const BatchRepLearningDashboard = () => {
  const [activeSemesterId, setActiveSemesterId] = useState("sem1");
  const [activeModuleId, setActiveModuleId] = useState("mod1");

  return (
    <MainLayout
      user={mockCurrentUser}
      verificationCount={mockRequests.length}
      pageTitle={
        <div className="flex items-center gap-2">
          <span>Learning</span>
          <div className="px-2 py-0.5 bg-blue-600 rounded-full flex justify-center items-center">
            <span className="text-white text-xs font-bold font-inter leading-5">
              Batch Rep Dashboard
            </span>
          </div>
        </div>
      }
    >
      <div className="w-full relative pb-20 mt-0">
        {/* Breadcrumb Context Title spanning above grid */}
        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold font-inter leading-5 w-full mb-6 mt-2 pl-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span>Faculty of Information Technology</span>
          <span className="font-normal mx-0.5">/</span>
          <span>Bsc.(Hons) IT</span>
        </div>

        {/* Dashboard Layout */}
        <div className="w-full flex flex-col lg:flex-row items-start gap-5 mb-5">
          {/* Left Column (Sticky Sidebar) */}
          <div className="w-full lg:w-60 shrink-0 sticky top-0 z-10 flex flex-col gap-2">
            <ModuleSidebar
              semesters={mockSemesters}
              activeSemesterId={activeSemesterId}
              activeModuleId={activeModuleId}
              onSelectModule={setActiveModuleId}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full flex flex-col items-start gap-5 min-w-0">
            <ModuleHeader />
            <CategoryGrid />
            <FileListTable files={mockLearningFiles} />
          </div>
        </div>

        {/* Full width Batch Rep Team */}
        <BatchRepTeam />
      </div>
    </MainLayout>
  );
};

export default BatchRepLearningDashboard;

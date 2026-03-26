import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import ModuleSidebar from "../components/learning/ModuleSidebar";
import StudentModuleHeader from "../components/learning/StudentModuleHeader";
import StudentCategoryGrid from "../components/learning/StudentCategoryGrid";
import StudentMaterialList from "../components/learning/StudentMaterialList";
import {
  mockRequests,
  mockSemesters,
  mockLearningFiles,
  mockModuleCategories,
  mockCategoryFiles,
  mockCurrentUser,
} from "../data/mockData";

const StudentLearningDashboard = () => {
  const [semesters] = useState(mockSemesters);
  const [activeSemesterId, setActiveSemesterId] = useState("sem3"); // default to sem3 per design
  const [activeModuleId, setActiveModuleId] = useState("mod1");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // Add subtitle specifically to match the design to our mock categories if needed
    const categoriesForModule = mockModuleCategories[activeModuleId] || [];
    if (categoriesForModule.length > 0) {
      setSelectedCategory(categoriesForModule[0]);
    } else {
      setSelectedCategory(null);
    }
  }, [activeModuleId]);

  // Compute Active Module Data derived from state
  const activeSemesterInfo = semesters.find(
    (sem) =>
      sem.modules && sem.modules.some((mod) => mod.id === activeModuleId),
  );

  const activeModuleData = activeSemesterInfo?.modules.find(
    (mod) => mod.id === activeModuleId,
  );

  // Extend mock categories to have subtitles if they don't have them
  const displayCategories = (mockModuleCategories[activeModuleId] || []).map(
    (cat) => {
      let subtitle = "Files & Docs";
      if (cat.title === "Notes") subtitle = "Slides & PDFs";
      if (cat.title === "Videos") subtitle = "Class Recordings";
      if (cat.title === "Lab Reports") subtitle = "Manuals & Tasks";
      if (cat.title === "Past Papers") subtitle = "2018 - 2023";
      if (cat.title === "Additional") subtitle = "External Links";

      return { ...cat, subtitle };
    },
  );

  return (
    <MainLayout
      user={{ ...mockCurrentUser, displayRole: "Student" }}
      verificationCount={mockRequests.length}
      pageTitle={
        <div className="flex justify-center items-center gap-2">
          <div className="inline-flex flex-col justify-start items-start">
            <div className="justify-center text-white text-2xl font-bold font-inter leading-8">
              Learning
            </div>
          </div>
        </div>
      }
    >
      <div className="w-full relative pb-20 mt-0">
        {/* Dashboard Layout */}
        <div className="w-full flex flex-col lg:flex-row items-start gap-6 mb-5 pt-7">
          {/* Left Column (Sticky Sidebar) */}
          <div className="w-full lg:w-64 shrink-0 sticky top-[28px] z-10 flex flex-col gap-3.5">
            {/* Faculty Info Card matching the design snippet */}
            <div className="w-full p-3.5 bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-white/5 flex flex-col justify-start items-start shrink-0">
              <div className="w-full flex justify-start items-center gap-2.5">
                <div className="flex flex-col justify-start items-start min-w-0">
                  <div className="flex flex-col justify-start items-start">
                    <div className="justify-center text-gray-400 text-sm font-bold font-inter leading-5 w-full">
                      Faculty of Information
                      <br />
                      Technology
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-start mt-1">
                    <div className="justify-center text-gray-400 text-sm font-normal font-inter leading-5">
                      Bsc.(Hons) IT
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ModuleSidebar
              semesters={semesters}
              activeSemesterId={activeSemesterId}
              activeModuleId={activeModuleId}
              onSelectModule={setActiveModuleId}
              readOnly={true}
              title="Course Structure"
              className="!w-full outline-white/5 !h-[calc(100vh-250px)] min-h-[400px]"
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full flex flex-col items-start gap-6 min-w-0 pr-2 pb-7">
            {activeModuleData ? (
              <>
                <StudentModuleHeader
                  moduleName={activeModuleData?.name}
                  moduleCode={activeModuleData?.code || "N/A"}
                  semesterName={activeSemesterInfo?.name}
                  batchName="Batch 2024"
                />

                <StudentCategoryGrid
                  key={activeModuleId}
                  categories={displayCategories}
                  selectedCategoryId={selectedCategory?.id}
                  onCategoryClick={setSelectedCategory}
                />

                <StudentMaterialList
                  categoryName={
                    selectedCategory ? selectedCategory.title : "Notes"
                  }
                  files={
                    selectedCategory
                      ? mockCategoryFiles[selectedCategory.id] || []
                      : mockLearningFiles
                  }
                />
              </>
            ) : (
              <div className="w-full p-10 flex flex-col items-center justify-center bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-slate-700 text-gray-400">
                <p>
                  Select a module from the sidebar to view learning materials.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentLearningDashboard;

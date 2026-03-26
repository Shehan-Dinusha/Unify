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
  mockModuleCategories,
  mockCategoryFiles,
  mockCurrentUser,
} from "../data/mockData";
import { ModuleActionSuccessModal } from "../components/common/ModuleActionModals";

const BatchRepLearningDashboard = () => {
  const [semesters, setSemesters] = useState(mockSemesters);
  const [activeSemesterId, setActiveSemesterId] = useState("sem1");
  const [activeModuleId, setActiveModuleId] = useState("mod1");
  const [selectedCategory, setSelectedCategory] = useState(null);

  React.useEffect(() => {
    const categoriesForModule = mockModuleCategories[activeModuleId] || [];
    if (categoriesForModule.length > 0) {
      setSelectedCategory(categoriesForModule[0]);
    } else {
      setSelectedCategory(null);
    }
  }, [activeModuleId]);

  // Success Modal States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionModuleName, setActionModuleName] = useState("");

  // Compute Active Module Data derived from state
  const activeSemesterInfo = semesters.find(
    (sem) =>
      sem.modules && sem.modules.some((mod) => mod.id === activeModuleId),
  );

  const activeModuleData = activeSemesterInfo?.modules.find(
    (mod) => mod.id === activeModuleId,
  );

  const handleAddModule = (newModule) => {
    setSemesters((prevSemesters) =>
      prevSemesters.map((sem) => {
        if (sem.id === newModule.semester) {
          return {
            ...sem,
            modules: [
              ...(sem.modules || []),
              {
                id: `mod-${Date.now()}`,
                name: newModule.title,
                code: newModule.code,
                degrees: newModule.visibility,
              },
            ],
          };
        }
        return sem;
      }),
    );
    setActionModuleName(newModule.title);
    setShowSuccessModal(true);
  };

  const handleEditModule = (editedData) => {
    setSemesters((prevSemesters) => {
      // First, remove the module from wherever it currently is
      let updatedSemesters = prevSemesters.map((sem) => ({
        ...sem,
        modules: sem.modules
          ? sem.modules.filter((mod) => mod.id !== activeModuleId)
          : [],
      }));

      // Then, add the updated module to its new semester Destination
      updatedSemesters = updatedSemesters.map((sem) => {
        if (
          sem.name === editedData.semester ||
          sem.id === editedData.semester
        ) {
          return {
            ...sem,
            modules: [
              ...(sem.modules || []),
              {
                id: activeModuleId, // keep same ID
                name: editedData.title,
                code: editedData.code,
                degrees: editedData.visibility,
              },
            ],
          };
        }
        return sem;
      });

      return updatedSemesters;
    });

    setActionModuleName(editedData.title);
    setShowSuccessModal(true);
  };

  const handleDeleteModule = () => {
    setActionModuleName(activeModuleData?.name || "Module");

    setSemesters((prevSemesters) =>
      prevSemesters.map((sem) => ({
        ...sem,
        modules: sem.modules
          ? sem.modules.filter((mod) => mod.id !== activeModuleId)
          : [],
      })),
    );

    // We defer clearing the active module ID until the modal is closed so UI doesn't immediately snap behind the modal
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setActiveModuleId(null);
  };

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
          <div className="w-full lg:w-60 shrink-0 lg:sticky lg:top-[28px] z-10 flex flex-col gap-2">
            <ModuleSidebar
              semesters={semesters}
              activeSemesterId={activeSemesterId}
              activeModuleId={activeModuleId}
              onSelectModule={setActiveModuleId}
              onAddModule={handleAddModule}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full flex flex-col items-start gap-5 min-w-0">
            {activeModuleData ? (
              <>
                <ModuleHeader
                  moduleName={activeModuleData?.name}
                  moduleCode={activeModuleData?.code || "N/A"}
                  semesterName={activeSemesterInfo?.name}
                  degrees={activeModuleData?.degrees || ["Bsc.(Hons) IT"]}
                  onEditSave={handleEditModule}
                  onDelete={handleDeleteModule}
                />
                
                <CategoryGrid 
                  key={activeModuleId}
                  initialCategories={mockModuleCategories[activeModuleId] || []}
                  selectedCategoryId={selectedCategory?.id}
                  onCategoryClick={setSelectedCategory} 
                />
                <FileListTable 
                  categoryName={selectedCategory ? selectedCategory.title : "All Files"} 
                  categories={mockModuleCategories[activeModuleId] || []}
                  files={selectedCategory ? (mockCategoryFiles[selectedCategory.id] || []) : mockLearningFiles} 
                />
              </>
            ) : (
              <div className="w-full p-10 flex flex-col items-center justify-center bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-slate-700 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-4 opacity-50"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <p>Select a module from the sidebar to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Full width Batch Rep Team */}
        <BatchRepTeam />

        <ModuleActionSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          moduleName={actionModuleName}
        />

        <ModuleActionSuccessModal
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          moduleName={actionModuleName}
          isDelete={true}
        />
      </div>
    </MainLayout>
  );
};

export default BatchRepLearningDashboard;

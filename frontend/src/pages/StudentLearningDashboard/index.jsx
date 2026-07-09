import React from "react";
import { Lock } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import ModuleSidebar from "../../components/learning/ModuleSidebar";
import StudentModuleHeader from "../../components/learning/StudentModuleHeader";
import StudentCategoryGrid from "../../components/learning/StudentCategoryGrid";
import StudentMaterialList from "../../components/learning/StudentMaterialList";
import { useStudentLearningDashboard } from "./useStudentLearningDashboard";

const StudentLearningDashboard = () => {
  const {
    sidebarUser, semesters, activeSemesterId, activeModuleId,
    facultyName, degreeName, batchName, moduleCategories, selectedCategory, setSelectedCategory,
    categoryFiles, isLoading, activeModuleData, handleSelectModule,
  } = useStudentLearningDashboard();

  return (
    <MainLayout
      user={sidebarUser}
      pageTitle={
        <div className="flex justify-center items-center gap-2">
          <div className="inline-flex flex-col justify-start items-start">
            <div className="justify-center text-white text-2xl font-bold font-inter leading-8">Learning</div>
          </div>
        </div>
      }
    >
      <div className="w-full relative pb-20 mt-0">
        <div className="w-full flex flex-col lg:flex-row items-start gap-6 mb-5 pt-4 lg:pt-7">
          <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-[28px] z-10 flex flex-col gap-3.5">
            <div className="w-full p-3.5 bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-white/5 flex flex-col justify-start items-start shrink-0">
              <div className="w-full flex justify-start items-center gap-2.5">
                <div className="flex flex-col justify-start items-start min-w-0">
                  <div className="flex flex-col justify-start items-start">
                    <div className="justify-center text-gray-400 text-sm font-bold font-inter leading-5 w-full">{facultyName || "Faculty"}</div>
                  </div>
                  <div className="flex flex-col justify-start items-start mt-1">
                    <div className="justify-center text-gray-400 text-sm font-normal font-inter leading-5">{degreeName || "Degree"}</div>
                  </div>
                </div>
              </div>
            </div>

            <ModuleSidebar
              semesters={semesters}
              activeSemesterId={activeSemesterId}
              activeModuleId={activeModuleId}
              onSelectModule={handleSelectModule}
              readOnly={true}
              title="Course Structure"
              className="!w-full outline-white/5 lg:!h-[calc(100vh-250px)] lg:min-h-[400px]"
            />
          </div>

          <div className="flex-1 w-full flex flex-col items-start gap-6 min-w-0 pr-0 lg:pr-2 pb-7">
            {isLoading ? (
              <div className="w-full p-10 flex items-center justify-center text-gray-400">Loading...</div>
            ) : semesters.length === 0 ? (
              <div className="w-full p-10 flex flex-col items-center justify-center gap-3 bg-slate-800 rounded-xl outline outline-1 outline-slate-700 text-gray-400">
                <Lock size={32} className="text-gray-500" />
                <p className="text-sm font-medium">No semesters available yet</p>
                <p className="text-xs text-gray-500 text-center max-w-md">
                  Your batch rep hasn't granted access to any semesters for your batch and degree. Check back later or contact your batch representative.
                </p>
              </div>
            ) : semesters.some(sem => sem.modules?.length > 0) ? (
              activeModuleData ? (
                <>
                  <StudentModuleHeader moduleName={activeModuleData?.name} moduleCode={activeModuleData?.code || "N/A"}
                    semesterName={activeSemesterInfo?.name} batchName={batchName} />
                  <StudentCategoryGrid key={activeModuleId} categories={moduleCategories}
                    selectedCategoryId={selectedCategory?.id} onCategoryClick={setSelectedCategory} />
                  {moduleCategories.length > 0 ? (
                    <StudentMaterialList categoryName={selectedCategory?.title || "Files"} files={categoryFiles} />
                  ) : (
                    <div className="w-full p-10 flex flex-col items-center justify-center bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-slate-700 text-gray-400">
                      <p>No categories available for this module yet.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full p-10 flex flex-col items-center justify-center bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-slate-700 text-gray-400">
                  <p>Select a module from the sidebar to view learning materials.</p>
                </div>
              )
            ) : (
              <div className="w-full p-10 flex flex-col items-center justify-center bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-slate-700 text-gray-400">
                <p>No modules available yet. Contact your batch rep.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentLearningDashboard;

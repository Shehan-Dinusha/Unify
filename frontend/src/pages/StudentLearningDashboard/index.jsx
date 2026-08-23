import React from "react";
import { Lock } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import ModuleSidebar from "../../components/learning/ModuleSidebar";
import StudentModuleHeader from "../../components/learning/StudentModuleHeader";
import StudentCategoryGrid from "../../components/learning/StudentCategoryGrid";
import StudentMaterialList from "../../components/learning/StudentMaterialList";
import { useStudentLearningDashboard } from "./useStudentLearningDashboard";

const ModuleLoadingSkeleton = () => (
  <div className="w-full flex flex-col items-start gap-6">
    <div className="self-stretch flex flex-col justify-start items-start gap-2.5 w-full">
      <div className="self-stretch inline-flex justify-start items-start w-full">
        <div className="flex flex-wrap justify-start items-center gap-y-1 gap-2">
          <div className="h-3 w-24 bg-white/5 animate-pulse rounded" />
          <div className="h-3 w-20 bg-white/5 animate-pulse rounded" />
          <div className="h-5 w-16 bg-white/10 animate-pulse rounded" />
        </div>
      </div>
      <div className="self-stretch pb-5 border-b-[1px] border-white/5 inline-flex flex-col justify-start items-start gap-2 w-full mt-1 sm:mt-0">
        <div className="self-stretch inline-flex justify-start items-center gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 animate-pulse shrink-0" />
          <div className="h-7 sm:h-8 w-56 bg-white/5 animate-pulse rounded" />
        </div>
        <div className="h-3 w-full max-w-[803px] bg-white/5 animate-pulse rounded" />
      </div>
    </div>

    <div className="self-stretch flex flex-col justify-start items-start gap-3.5 w-full">
      <div className="h-3 w-28 bg-white/5 animate-pulse rounded" />
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-4 sm:p-5 rounded-xl outline outline-1 outline-offset-[-0.91px] outline-white/5 bg-slate-800 w-full flex flex-col justify-between items-start"
          >
            <div className="w-full pb-3.5 flex flex-col justify-start items-start">
              <div className="w-full flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-white/5 animate-pulse shrink-0" />
                <div className="h-6 w-9 rounded-full bg-white/5 animate-pulse shrink-0" />
              </div>
            </div>
            <div className="w-full flex-1 min-h-[40px] pt-5 flex flex-col justify-end items-start gap-1">
              <div className="h-3 w-20 bg-white/5 animate-pulse rounded" />
              <div className="h-2.5 w-16 bg-white/5 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="w-full flex flex-col justify-start items-start gap-3.5">
      <div className="h-3 w-16 bg-white/5 animate-pulse rounded" />
      <div className="w-full flex flex-col justify-start items-start gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full p-3 sm:p-3.5 bg-slate-800 rounded-xl outline outline-1 outline-offset-[-0.91px] outline-white/5 flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-lg bg-white/5 animate-pulse shrink-0" />
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="h-3 w-40 bg-white/5 animate-pulse rounded" />
              <div className="h-2.5 w-24 bg-white/5 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const StudentLearningDashboard = () => {
  const {
    sidebarUser, semesters, activeSemesterId, activeModuleId,
    facultyName, degreeName, batchName, moduleCategories, selectedCategory, setSelectedCategory,
    categoryFiles, isLoading, isLoadingDetails, isLoadingFiles, activeModuleData, activeSemesterInfo, handleSelectModule,
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
            {isLoading || isLoadingDetails ? (
              <ModuleLoadingSkeleton />
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
                    <StudentMaterialList categoryName={selectedCategory?.title || "Files"} files={categoryFiles} isLoadingFiles={isLoadingFiles} />
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

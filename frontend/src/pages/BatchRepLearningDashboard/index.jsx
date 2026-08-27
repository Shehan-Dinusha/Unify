import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import ModuleSidebar from "../../components/learning/ModuleSidebar";
import ModuleHeader from "../../components/learning/ModuleHeader";
import CategoryGrid from "../../components/learning/CategoryGrid";
import FileListTable from "../../components/learning/FileListTable";
import BatchRepTeam from "../../components/learning/BatchRepTeam";
import { ModuleActionSuccessModal } from "../../components/common/ModuleActionModals";
import { useBatchRepLearning } from "./useBatchRepLearning";
import BreadcrumbHeader from "./BreadcrumbHeader";
import EmptyLearningState from "./EmptyLearningState";

const ModuleLoadingSkeleton = () => (
  <div className="w-full flex flex-col gap-5">
    <div className="w-full h-16 bg-slate-800 rounded-xl outline outline-1 outline-slate-700 px-5 py-4 flex items-center gap-4">
      <div className="h-5 w-32 bg-white/5 animate-pulse rounded" />
      <div className="h-4 w-16 bg-white/5 animate-pulse rounded" />
      <div className="flex-1" />
      <div className="h-8 w-20 bg-white/5 animate-pulse rounded-lg" />
      <div className="h-8 w-8 bg-white/5 animate-pulse rounded-lg" />
    </div>
    <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-full h-[84px] p-2.5 sm:p-3.5 rounded-xl bg-slate-800 outline outline-1 outline-slate-700 flex items-start gap-2.5 sm:gap-3.5"
        >
          <div className="w-9 h-9 rounded-lg bg-white/5 animate-pulse shrink-0" />
          <div className="flex flex-col gap-2 flex-1 pt-1">
            <div className="h-3 w-24 bg-white/5 animate-pulse rounded" />
            <div className="h-2.5 w-16 bg-white/5 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
    <div className="w-full bg-slate-800 rounded-xl outline outline-1 outline-slate-700 flex flex-col overflow-hidden">
      <div className="h-12 px-5 py-3 border-b border-gray-700 flex items-center">
        <div className="h-4 w-40 bg-white/5 animate-pulse rounded" />
      </div>
      <div className="bg-gray-800/50 flex px-5 py-3 gap-8">
        <div className="h-3 w-12 bg-white/5 animate-pulse rounded" />
        <div className="h-3 w-24 bg-white/5 animate-pulse rounded" />
        <div className="h-3 w-28 bg-white/5 animate-pulse rounded" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-full h-20 px-5 flex items-center border-t border-gray-700">
          <div className="w-80 flex items-center gap-3.5 pr-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 animate-pulse shrink-0" />
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-36 bg-white/5 animate-pulse rounded" />
              <div className="h-2.5 w-16 bg-white/5 animate-pulse rounded" />
            </div>
          </div>
          <div className="w-40 flex items-center gap-2 pr-4">
            <div className="w-6 h-6 rounded-full bg-white/5 animate-pulse shrink-0" />
            <div className="h-2.5 w-20 bg-white/5 animate-pulse rounded" />
          </div>
          <div className="flex-1">
            <div className="h-2.5 w-24 bg-white/5 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BatchRepLearningDashboard = () => {
  const {
    currentUserId,
    semesters,
    activeSemesterId,
    // eslint-disable-next-line no-unused-vars
    setActiveSemesterId,
    activeModuleId,
    setActiveModuleId,
    degreeName,
    degreeId,
    facultyName,
    selectedCategory,
    setSelectedCategory,
    moduleCategories,
    categoryFiles,
    activeModuleData,
    activeSemesterInfo,
    availableDegrees,
    isLoadingDetails,
    showSuccessModal,
    setShowSuccessModal,
    showDeleteModal,
    actionModuleName,
    sidebarUser,
    handleAddModule,
    handleEditModule,
    handleDeleteModule,
    closeDeleteModal,
    refreshCourseStructure,
    handleCategoryChanged,
    handleMaterialChanged,
    isLoadingFiles,
    optimisticDeleteFile,
    optimisticRenameFile,
    optimisticDeleteCategory,
    optimisticRenameCategory,
    optimisticCreateCategory,
    // eslint-disable-next-line no-unused-vars
    optimisticCreateModule,
    // eslint-disable-next-line no-unused-vars
    optimisticEditModule,
    // eslint-disable-next-line no-unused-vars
    optimisticDeleteModule,
    optimisticAddFile,
    optimisticUpdateVisibility,
  } = useBatchRepLearning();

  const hasAnyModule = semesters.some((sem) => sem.modules?.length > 0);

  return (
    <MainLayout
      user={sidebarUser}
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
        <BreadcrumbHeader facultyName={facultyName} degreeName={degreeName} />

        <div className="w-full flex flex-col lg:flex-row items-start gap-5 mb-5">
          <div className="w-full lg:w-60 shrink-0 lg:sticky lg:top-[28px] z-10 flex flex-col gap-2">
            <ModuleSidebar
              title="Module Structure"
              semesters={semesters}
              activeSemesterId={activeSemesterId}
              activeModuleId={activeModuleId}
              onSelectModule={setActiveModuleId}
              onAddModule={handleAddModule}
              onRefreshSemesters={refreshCourseStructure}
              onOptimisticVisibility={optimisticUpdateVisibility}
              degreeId={degreeId}
              availableDegrees={availableDegrees}
              primaryDegree={degreeName}
            />
          </div>

          <div className="flex-1 w-full flex flex-col items-start gap-5 min-w-0">
            {isLoadingDetails ? (
              <ModuleLoadingSkeleton />
            ) : activeModuleData ? (
              <>
                <ModuleHeader
                  moduleName={activeModuleData?.name}
                  moduleCode={activeModuleData?.code || "N/A"}
                  semesterName={activeSemesterInfo?.name}
                  isPublic={activeSemesterInfo?.isPublic ?? false}
                  lastUpdated={activeModuleData?.lastUpdated}
                  creatorDegreeId={activeModuleData?.creatorDegreeId}
                  userDegreeId={degreeId}
                  degrees={
                    activeModuleData?.degrees?.map((d) =>
                      typeof d === "string" ? d : d.name,
                    ) || [degreeName]
                  }
                  availableDegrees={availableDegrees}
                  primaryDegree={degreeName}
                  semesters={semesters}
                  onEditSave={handleEditModule}
                  onDelete={handleDeleteModule}
                  moduleId={activeModuleId}
                  categories={moduleCategories}
                  onMaterialUploaded={handleMaterialChanged}
                  onOptimisticAddFile={optimisticAddFile}
                />

                <CategoryGrid
                  key={activeModuleId}
                  activeModuleId={activeModuleId}
                  initialCategories={moduleCategories}
                  selectedCategoryId={selectedCategory?.id}
                  onCategoryClick={setSelectedCategory}
                  onRefresh={handleCategoryChanged}
                  isLoading={isLoadingDetails}
                  onDeleteCategory={optimisticDeleteCategory}
                  onRenameCategory={optimisticRenameCategory}
                  onCreateCategory={optimisticCreateCategory}
                />
                <FileListTable
                  activeModuleId={activeModuleId}
                  categoryId={selectedCategory?.id}
                  categoryName={
                    selectedCategory ? selectedCategory.title : "All Files"
                  }
                  categories={moduleCategories}
                  files={categoryFiles}
                  isLoadingFiles={isLoadingFiles}
                  onRefresh={handleMaterialChanged}
                  onDeleteFile={optimisticDeleteFile}
                  onRenameFile={optimisticRenameFile}
                />
              </>
            ) : (
              <EmptyLearningState hasModules={hasAnyModule} />
            )}
          </div>
        </div>

        <BatchRepTeam degreeId={degreeId} currentUserId={currentUserId} />

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

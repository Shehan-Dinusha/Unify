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

const BatchRepLearningDashboard = () => {
  const {
    currentUserId,
    semesters,
    activeSemesterId,
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
              degreeId={degreeId}
              availableDegrees={availableDegrees}
              primaryDegree={degreeName}
            />
          </div>

          <div className="flex-1 w-full flex flex-col items-start gap-5 min-w-0">
            {activeModuleData ? (
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
                />

                <CategoryGrid
                  key={activeModuleId}
                  activeModuleId={activeModuleId}
                  initialCategories={moduleCategories}
                  selectedCategoryId={selectedCategory?.id}
                  onCategoryClick={setSelectedCategory}
                  onRefresh={handleCategoryChanged}
                />
                <FileListTable
                  activeModuleId={activeModuleId}
                  categoryId={selectedCategory?.id}
                  categoryName={
                    selectedCategory ? selectedCategory.title : "All Files"
                  }
                  categories={moduleCategories}
                  files={categoryFiles}
                  onRefresh={handleMaterialChanged}
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

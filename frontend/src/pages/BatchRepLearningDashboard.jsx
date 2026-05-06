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
  mockCurrentUser,
} from "../data/mockData";
import { ModuleActionSuccessModal } from "../components/common/ModuleActionModals";
import * as learningService from "../services/learningService";
import { useToast } from "../components/common/Toast";

const BatchRepLearningDashboard = () => {
  const [semesters, setSemesters] = useState(mockSemesters);
  const [activeSemesterId, setActiveSemesterId] = useState("sem1");
  const [activeModuleId, setActiveModuleId] = useState("mod1");
  const [degreeName, setDegreeName] = useState("Bsc.(Hons) IT");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Temporary auth context since auth isn't connected yet
  const currentUserId = 1;
  const currentDegreeId = 18;

  // Real data states
  const [moduleCategories, setModuleCategories] = useState([]);
  const [categoryFiles, setCategoryFiles] = useState([]);
  const [activeModuleDetails, setActiveModuleDetails] = useState(null);
  const [availableDegrees, setAvailableDegrees] = useState([]);
  const [availableDegreesObjs, setAvailableDegreesObjs] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const toast = useToast();

  // Fetch module details and categories when activeModuleId changes
  React.useEffect(() => {
    const fetchStructure = async () => {
      try {
        const res = await learningService.getBatchRepCourseStructure(currentDegreeId);
        if (res?.data?.semesters) {
          setSemesters(res.data.semesters);
          setDegreeName(res.data.degreeName || "Bsc.(Hons) IT");
          
          // Set initial active semester and module if valid
          if (res.data.semesters.length > 0) {
            const firstSem = res.data.semesters[0];
            setActiveSemesterId(firstSem.id);
            if (firstSem.modules && firstSem.modules.length > 0) {
              setActiveModuleId(firstSem.modules[0].id);
            } else {
              setActiveModuleId(null);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch course structure", err);
        // Retains mockSemesters on failure
      }
    };
    fetchStructure();
  }, [currentDegreeId]);

  React.useEffect(() => {
    if (!activeModuleId) return;

    // Clear stale state before fetching new module details
    setActiveModuleDetails(null);
    setSelectedCategory(null);
    setCategoryFiles([]);

    const fetchModuleData = async () => {
      setIsLoadingDetails(true);
      try {
        // We handle the case where activeModuleId might be a mock ID.
        // If it fails, we fall back to finding it in mockSemesters.
        let details = null;
        try {
          details = await learningService.getModuleDetails(activeModuleId, currentDegreeId);
          setActiveModuleDetails(details?.data?.module || null);
          if (details?.data?.availableDegrees) {
            setAvailableDegreesObjs(details.data.availableDegrees);
            setAvailableDegrees(details.data.availableDegrees.map(d => d.name));
          }
        } catch (err) {
          console.warn("Failed to fetch module details from API, using local state", err);
        }

        try {
          const catsRes = await learningService.getModuleCategories(activeModuleId);
          const apiCategories = catsRes.data?.categories || [];
          setModuleCategories(apiCategories);
          if (apiCategories.length > 0) {
            setSelectedCategory(apiCategories[0]);
          } else {
            setSelectedCategory(null);
          }
        } catch (err) {
          console.warn("Failed to fetch module categories", err);
          setModuleCategories([]);
          setSelectedCategory(null);
        }
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchModuleData();
  }, [activeModuleId]);

  // Fetch materials when selectedCategory changes
  React.useEffect(() => {
    if (!activeModuleId || !selectedCategory) {
      setCategoryFiles([]);
      return;
    }

    const fetchFiles = async () => {
      try {
        const filesRes = await learningService.getMaterialsByCategory(
          activeModuleId,
          selectedCategory.id
        );
        setCategoryFiles(filesRes.data || []);
      } catch (err) {
        console.warn("Failed to fetch materials", err);
        setCategoryFiles([]);
      }
    };

    fetchFiles();
  }, [activeModuleId, selectedCategory]);

  const refreshCategories = async () => {
    if (!activeModuleId) return;
    try {
      const catsRes = await learningService.getModuleCategories(activeModuleId);
      const apiCategories = catsRes.data?.categories || [];
      setModuleCategories(apiCategories);
      if (!selectedCategory && apiCategories.length > 0) {
        setSelectedCategory(apiCategories[0]);
      }
    } catch (err) {
      console.error(err);
      setModuleCategories([]);
    }
  };

  const refreshFiles = async () => {
    if (!activeModuleId || !selectedCategory) return;
    try {
      const filesRes = await learningService.getMaterialsByCategory(
        activeModuleId,
        selectedCategory.id
      );
      setCategoryFiles(filesRes.data || []);
    } catch (err) {
      console.error(err);
      setCategoryFiles([]);
    }
  };

  // Success Modal States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionModuleName, setActionModuleName] = useState("");

  // Compute Active Module Data derived from state
  const activeSemesterInfo = semesters.find(
    (sem) =>
      sem.modules && sem.modules.some((mod) => String(mod.id) === String(activeModuleId)),
  );

  const activeModuleData = activeModuleDetails || activeSemesterInfo?.modules.find(
    (mod) => String(mod.id) === String(activeModuleId),
  );

  const handleAddModule = async (newModule) => {
    try {
      const visibilityIds = newModule.visibility.map(degreeName => {
         const degObj = availableDegreesObjs.find(d => d.name === degreeName);
         return degObj ? degObj.id : null;
      }).filter(id => id !== null);

      if (visibilityIds.length === 0) visibilityIds.push(currentDegreeId);

      const res = await learningService.createModule({
        title: newModule.title,
        code: newModule.code,
        semester: parseInt(newModule.semester, 10),
        visibility: visibilityIds,
      });
      const createdModule = res.data;

      setSemesters((prevSemesters) =>
        prevSemesters.map((sem) => {
          if (String(sem.id) === String(newModule.semester)) {
            return {
              ...sem,
              modules: [
                ...(sem.modules || []),
                {
                  id: createdModule?.id || `mod-${Date.now()}`,
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

      if (createdModule?.id) {
        setActiveModuleId(createdModule.id);
      }
      
      setActionModuleName(newModule.title);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to create module", err);
      const errorMessage = err.response?.data?.message || err.message || "Unknown error";
      toast.error("Error", `Failed to create module: ${errorMessage}`);
    }
  };

  const handleEditModule = async (editedData) => {
    try {
      const selectedSemester = semesters.find(s => s.name === editedData.semester || s.id === editedData.semester);
      const semesterId = selectedSemester ? selectedSemester.id : null;

      const visibilityIds = editedData.visibility.map(degreeName => {
         const degObj = availableDegreesObjs.find(d => d.name === degreeName);
         return degObj ? degObj.id : null;
      }).filter(id => id !== null);

      if (visibilityIds.length === 0) visibilityIds.push(currentDegreeId);

      await learningService.editModuleDetails(activeModuleId, {
        title: editedData.title,
        code: editedData.code,
        semester: semesterId,
        visibility: visibilityIds,
      });

      // Update local state
      setSemesters((prevSemesters) => {
        let updatedSemesters = prevSemesters.map((sem) => ({
          ...sem,
          modules: sem.modules
            ? sem.modules.filter((mod) => String(mod.id) !== String(activeModuleId))
            : [],
        }));

        updatedSemesters = updatedSemesters.map((sem) => {
          if (sem.name === editedData.semester || sem.id === editedData.semester) {
            return {
              ...sem,
              modules: [
                ...(sem.modules || []),
                {
                  id: activeModuleId,
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

      // Update active module details if we are viewing it
      setActiveModuleDetails((prev) => prev ? {
        ...prev,
        name: editedData.title,
        code: editedData.code,
        degrees: editedData.visibility,
        semester: selectedSemester ? { id: selectedSemester.id, name: selectedSemester.name } : prev.semester
      } : null);

      setActionModuleName(editedData.title);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to edit module", err);
      toast.error("Error", "Failed to edit module");
    }
  };

  const handleDeleteModule = async () => {
    try {
      await learningService.deleteModule(activeModuleId);
      
      setActionModuleName(activeModuleData?.name || "Module");
      setSemesters((prevSemesters) =>
        prevSemesters.map((sem) => ({
          ...sem,
          modules: sem.modules
            ? sem.modules.filter((mod) => String(mod.id) !== String(activeModuleId))
            : [],
        })),
      );
      setShowDeleteModal(true);
    } catch (err) {
      console.error("Failed to delete module", err);
      toast.error("Error", "Failed to delete module");
    }
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
          <span>{degreeName}</span>
        </div>

        {/* Dashboard Layout */}
        <div className="w-full flex flex-col lg:flex-row items-start gap-5 mb-5">
          {/* Left Column (Sticky Sidebar) */}
          <div className="w-full lg:w-60 shrink-0 lg:sticky lg:top-[28px] z-10 flex flex-col gap-2">
            <ModuleSidebar
              title={degreeName}
              semesters={semesters}
              activeSemesterId={activeSemesterId}
              activeModuleId={activeModuleId}
              onSelectModule={setActiveModuleId}
              onAddModule={handleAddModule}
              degreeId={currentDegreeId}
              availableDegrees={availableDegrees}
              primaryDegree={degreeName}
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
                  degrees={activeModuleData?.degrees?.map(d => typeof d === 'string' ? d : d.name) || [degreeName]}
                  availableDegrees={availableDegrees}
                  primaryDegree={degreeName}
                  semesters={semesters}
                  onEditSave={handleEditModule}
                  onDelete={handleDeleteModule}
                  moduleId={activeModuleId}
                  categories={moduleCategories}
                  onMaterialUploaded={refreshFiles}
                />
                
                <CategoryGrid 
                  key={activeModuleId}
                  activeModuleId={activeModuleId}
                  initialCategories={moduleCategories}
                  selectedCategoryId={selectedCategory?.id}
                  onCategoryClick={setSelectedCategory} 
                  onRefresh={refreshCategories}
                />
                <FileListTable 
                  activeModuleId={activeModuleId}
                  categoryId={selectedCategory?.id}
                  categoryName={selectedCategory ? selectedCategory.title : "All Files"} 
                  categories={moduleCategories}
                  files={categoryFiles} 
                  onRefresh={refreshFiles}
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
        <BatchRepTeam degreeId={currentDegreeId} currentUserId={currentUserId} />

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

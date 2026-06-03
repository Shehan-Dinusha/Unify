import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import ModuleSidebar from "../components/learning/ModuleSidebar";
import ModuleHeader from "../components/learning/ModuleHeader";
import CategoryGrid from "../components/learning/CategoryGrid";
import FileListTable from "../components/learning/FileListTable";
import BatchRepTeam from "../components/learning/BatchRepTeam";
import { BookIcon } from "../components/common/Icons";
import { ModuleActionSuccessModal } from "../components/common/ModuleActionModals";
import * as learningService from "../services/learningService";
import { getCurrentUser } from "../services/authService";
import { getMyProfile } from "../services/profileService";
import { useToast } from "../components/common/Toast";

const BatchRepLearningDashboard = () => {
  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id;

  const [semesters, setSemesters] = useState([]);
  const [activeSemesterId, setActiveSemesterId] = useState(null);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [degreeName, setDegreeName] = useState("");
  const [degreeId, setDegreeId] = useState(null);
  const [facultyName, setFacultyName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Real data states
  const [moduleCategories, setModuleCategories] = useState([]);
  const [categoryFiles, setCategoryFiles] = useState([]);
  const [activeModuleDetails, setActiveModuleDetails] = useState(null);
  const [availableDegrees, setAvailableDegrees] = useState([]);
  const [availableDegreesObjs, setAvailableDegreesObjs] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const toast = useToast();

  const refreshCourseStructure = async () => {
    if (!degreeId) return;
    try {
      const res = await learningService.getBatchRepCourseStructure(degreeId);
      if (res?.data?.semesters) {
        setSemesters(res.data.semesters);
        setDegreeName(res.data.degreeName || degreeName);
        if (res.data.availableDegrees) {
          setAvailableDegreesObjs(res.data.availableDegrees);
          setAvailableDegrees(res.data.availableDegrees.map((d) => d.name));
        }
      }
    } catch (err) {
      console.error("Failed to refresh course structure", err);
    }
  };

  // Fetch student profile to get degreeId, then fetch course structure
  useEffect(() => {
    const init = async () => {
      try {
        const profileRes = await getMyProfile("student");
        const fetchedDegreeId = profileRes?.degreeId;
        const fetchedDegreeName = profileRes?.degree?.name || "";
        const fetchedFacultyName = profileRes?.faculty?.name || "";
        setFacultyName(fetchedFacultyName);
        if (fetchedDegreeId) {
          setDegreeId(fetchedDegreeId);
          setDegreeName(fetchedDegreeName);

          const res =
            await learningService.getBatchRepCourseStructure(fetchedDegreeId);
          if (res?.data?.semesters) {
            setSemesters(res.data.semesters);
            if (!degreeName)
              setDegreeName(res.data.degreeName || fetchedDegreeName);
            if (res.data.availableDegrees) {
              setAvailableDegreesObjs(res.data.availableDegrees);
              setAvailableDegrees(res.data.availableDegrees.map((d) => d.name));
            }

            if (res.data.semesters.length > 0) {
              const firstSem = res.data.semesters[0];
              setActiveSemesterId(firstSem.id);
              if (firstSem.modules && firstSem.modules.length > 0) {
                setActiveModuleId(firstSem.modules[0].id);
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to initialize learning dashboard", err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!activeModuleId) return;

    // Clear stale state before fetching new module details
    setActiveModuleDetails(null);
    setSelectedCategory(null);
    setCategoryFiles([]);

    const fetchModuleData = async () => {
      setIsLoadingDetails(true);
      try {
        let details = null;
        try {
          details = await learningService.getModuleDetails(
            activeModuleId,
            degreeId,
          );
          setActiveModuleDetails(details?.data?.module || null);
          if (details?.data?.availableDegrees) {
            setAvailableDegreesObjs(details.data.availableDegrees);
            setAvailableDegrees(
              details.data.availableDegrees.map((d) => d.name),
            );
          }
        } catch (err) {
          console.warn(
            "Failed to fetch module details from API, using local state",
            err,
          );
        }

        try {
          const catsRes =
            await learningService.getModuleCategories(activeModuleId);
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
  useEffect(() => {
    if (!activeModuleId || !selectedCategory) {
      setCategoryFiles([]);
      return;
    }

    const fetchFiles = async () => {
      try {
        const filesRes = await learningService.getMaterialsByCategory(
          activeModuleId,
          selectedCategory.id,
        );
        setCategoryFiles(filesRes.data || []);
      } catch (err) {
        console.warn("Failed to fetch materials", err);
        setCategoryFiles([]);
      }
    };

    fetchFiles();
  }, [activeModuleId, selectedCategory]);

  const refreshActiveModule = async () => {
    if (!activeModuleId) return;
    try {
      const details = await learningService.getModuleDetails(
        activeModuleId,
        degreeId,
      );
      if (details?.data?.module) {
        setActiveModuleDetails(details.data.module);
      }
    } catch (err) {
      console.error("Failed to refresh module details", err);
    }
  };

  const handleMaterialChanged = async () => {
    await refreshCategories();
    await refreshActiveModule();
    await refreshFiles();
  };

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
        selectedCategory.id,
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
      sem.modules &&
      sem.modules.some((mod) => String(mod.id) === String(activeModuleId)),
  );

  const activeModuleData =
    activeModuleDetails ||
    activeSemesterInfo?.modules.find(
      (mod) => String(mod.id) === String(activeModuleId),
    );

  const handleAddModule = async (newModule) => {
    try {
      const visibilityIds = newModule.visibility
        .map((degreeName) => {
          const degObj = availableDegreesObjs.find(
            (d) => d.name === degreeName,
          );
          return degObj ? degObj.id : null;
        })
        .filter((id) => id !== null);

      if (visibilityIds.length === 0) visibilityIds.push(degreeId);

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
      const errorMessage =
        err.response?.data?.message || err.message || "Unknown error";
      toast.error("Error", `Failed to create module: ${errorMessage}`);
    }
  };

  const handleEditModule = async (editedData) => {
    try {
      const selectedSemester = semesters.find(
        (s) => s.name === editedData.semester || s.id === editedData.semester,
      );
      const semesterId = selectedSemester ? selectedSemester.id : null;

      const visibilityIds = editedData.visibility
        .map((degreeName) => {
          const degObj = availableDegreesObjs.find(
            (d) => d.name === degreeName,
          );
          return degObj ? degObj.id : null;
        })
        .filter((id) => id !== null);

      if (visibilityIds.length === 0) visibilityIds.push(degreeId);

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
            ? sem.modules.filter(
                (mod) => String(mod.id) !== String(activeModuleId),
              )
            : [],
        }));

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
      setActiveModuleDetails((prev) =>
        prev
          ? {
              ...prev,
              name: editedData.title,
              code: editedData.code,
              degrees: editedData.visibility,
              semester: selectedSemester
                ? { id: selectedSemester.id, name: selectedSemester.name }
                : prev.semester,
            }
          : null,
      );

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
            ? sem.modules.filter(
                (mod) => String(mod.id) !== String(activeModuleId),
              )
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

  const sidebarUser = (() => {
    try {
      const raw = localStorage.getItem("user");
      const role = localStorage.getItem("role");
      if (raw) {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        return {
          name: parsed.name || "Batch Rep",
          role: role || "admin",
          displayRole: parsed.displayRole || role || "Batch Rep",
        };
      }
    } catch {}
    return {
      name: currentUser?.name || "Batch Rep",
      role: "admin",
      displayRole: "Batch Rep",
    };
  })();

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
        {/* Breadcrumb Context Title spanning above grid */}
        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold font-inter leading-5 w-full mb-6 mt-2 pl-1">
          <BookIcon className="text-gray-400" />
          <span>{facultyName}</span>
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
              onRefreshSemesters={refreshCourseStructure}
              degreeId={degreeId}
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
                  onRefresh={refreshCategories}
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
            ) : semesters.some((sem) => sem.modules?.length > 0) ? (
              <div className="w-full p-10 flex flex-col items-center justify-center bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-slate-700 text-gray-400">
                <BookIcon className="mb-4 opacity-50 w-12 h-12" />
                <p>Select a module from the sidebar to view details</p>
              </div>
            ) : (
              <div className="w-full p-10 flex flex-col items-center justify-center bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-slate-700 text-gray-400">
                <BookIcon className="mb-4 opacity-50 w-12 h-12" />
                <p>Create a module first to start uploading materials</p>
              </div>
            )}
          </div>
        </div>

        {/* Full width Batch Rep Team */}
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

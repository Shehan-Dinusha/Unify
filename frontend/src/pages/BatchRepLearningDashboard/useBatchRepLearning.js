import { useState, useEffect } from "react";
import * as learningService from "../../services/learningService";
import { getCurrentUser } from "../../services/authService";
import { getMyProfile } from "../../services/profileService";
import { useToast } from "../../components/common/Toast";

export const useBatchRepLearning = () => {
  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id;
  const toast = useToast();

  const [semesters, setSemesters] = useState([]);
  const [activeSemesterId, setActiveSemesterId] = useState(null);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [degreeName, setDegreeName] = useState("");
  const [degreeId, setDegreeId] = useState(null);
  const [facultyName, setFacultyName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [moduleCategories, setModuleCategories] = useState([]);
  const [categoryFiles, setCategoryFiles] = useState([]);
  const [activeModuleDetails, setActiveModuleDetails] = useState(null);
  const [availableDegrees, setAvailableDegrees] = useState([]);
  const [availableDegreesObjs, setAvailableDegreesObjs] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionModuleName, setActionModuleName] = useState("");

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

          const res = await learningService.getBatchRepCourseStructure(fetchedDegreeId);
          if (res?.data?.semesters) {
            setSemesters(res.data.semesters);
            if (!degreeName) setDegreeName(res.data.degreeName || fetchedDegreeName);
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

    setActiveModuleDetails(null);
    setSelectedCategory(null);
    setCategoryFiles([]);

    const fetchModuleData = async () => {
      setIsLoadingDetails(true);
      try {
        try {
          const details = await learningService.getModuleDetails(activeModuleId, degreeId);
          setActiveModuleDetails(details?.data?.module || null);
          if (details?.data?.availableDegrees) {
            setAvailableDegreesObjs(details.data.availableDegrees);
            setAvailableDegrees(details.data.availableDegrees.map((d) => d.name));
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

  useEffect(() => {
    if (!activeModuleId || !selectedCategory) {
      setCategoryFiles([]);
      return;
    }

    const fetchFiles = async () => {
      try {
        const filesRes = await learningService.getMaterialsByCategory(activeModuleId, selectedCategory.id);
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
      const details = await learningService.getModuleDetails(activeModuleId, degreeId);
      if (details?.data?.module) {
        setActiveModuleDetails(details.data.module);
      }
    } catch (err) {
      console.error("Failed to refresh module details", err);
    }
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
      const filesRes = await learningService.getMaterialsByCategory(activeModuleId, selectedCategory.id);
      setCategoryFiles(filesRes.data || []);
    } catch (err) {
      console.error(err);
      setCategoryFiles([]);
    }
  };

  const handleMaterialChanged = async () => {
    await refreshCategories();
    await refreshActiveModule();
    await refreshFiles();
  };

  const activeSemesterInfo = semesters.find(
    (sem) => sem.modules && sem.modules.some((mod) => String(mod.id) === String(activeModuleId)),
  );

  const activeModuleData = activeModuleDetails ||
    activeSemesterInfo?.modules.find((mod) => String(mod.id) === String(activeModuleId));

  const handleAddModule = async (newModule) => {
    try {
      const visibilityIds = newModule.visibility
        .map((degreeName) => {
          const degObj = availableDegreesObjs.find((d) => d.name === degreeName);
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
      const errorMessage = err.response?.data?.message || err.message || "Unknown error";
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
          const degObj = availableDegreesObjs.find((d) => d.name === degreeName);
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

      setActiveModuleDetails((prev) =>
        prev ? {
          ...prev,
          name: editedData.title,
          code: editedData.code,
          degrees: editedData.visibility,
          semester: selectedSemester
            ? { id: selectedSemester.id, name: selectedSemester.name }
            : prev.semester,
        } : null,
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

  return {
    currentUser, currentUserId,
    semesters, setSemesters,
    activeSemesterId, setActiveSemesterId,
    activeModuleId, setActiveModuleId,
    degreeName,
    degreeId,
    facultyName,
    selectedCategory, setSelectedCategory,
    moduleCategories,
    categoryFiles,
    activeModuleData,
    activeSemesterInfo,
    availableDegrees,
    isLoadingDetails,
    showSuccessModal, setShowSuccessModal,
    showDeleteModal,
    actionModuleName,
    sidebarUser,
    handleAddModule,
    handleEditModule,
    handleDeleteModule,
    closeDeleteModal,
    refreshCourseStructure,
    handleMaterialChanged,
  };
};

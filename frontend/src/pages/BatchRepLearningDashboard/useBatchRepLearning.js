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
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
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
      toast.error("Error", "Failed to refresh course structure");
    }
  };

  useEffect(() => {
    setIsLoadingDetails(true);
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
        toast.error("Error", "Failed to initialize learning dashboard");
      } finally {
        setIsLoadingDetails(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!activeModuleId) return;

    setActiveModuleDetails(null);
    setSelectedCategory(null);
    setCategoryFiles([]);
    setModuleCategories([]);

    const fetchModuleData = async () => {
      setIsLoadingDetails(true);
      try {
        try {
          const details = await learningService.getModuleDetails(
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
        } catch (err) {}

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

    setIsLoadingFiles(true);
    const fetchFiles = async () => {
      try {
        const filesRes = await learningService.getMaterialsByCategory(
          activeModuleId,
          selectedCategory.id,
        );
        setCategoryFiles(filesRes.data || []);
      } catch (err) {
        setCategoryFiles([]);
      } finally {
        setIsLoadingFiles(false);
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
      toast.error("Error", "Failed to refresh module details");
    }
  };

  const refreshCategories = async () => {
    if (!activeModuleId) return;
    try {
      const catsRes = await learningService.getModuleCategories(activeModuleId);
      const apiCategories = catsRes.data?.categories || [];
      setModuleCategories(apiCategories);

      if (apiCategories.length === 0) {
        setSelectedCategory(null);
      } else if (!selectedCategory) {
        setSelectedCategory(apiCategories[0]);
      } else {
        const updatedSelected = apiCategories.find(
          (c) => c.id === selectedCategory.id,
        );
        if (updatedSelected) {
          setSelectedCategory(updatedSelected);
        } else {
          setSelectedCategory(apiCategories[0]);
        }
      }
    } catch (err) {
      toast.error("Error", "Failed to refresh categories");
      setModuleCategories([]);
    }
  };

  const refreshCategoryCounts = async () => {
    if (!activeModuleId) return;
    try {
      const catsRes = await learningService.getModuleCategories(activeModuleId);
      setModuleCategories(catsRes.data?.categories || []);
    } catch {
      // silent — non-critical
    }
  };

  const handleCategoryChanged = async () => {
    await refreshCategories();
    await refreshCourseStructure();
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
      toast.error("Error", "Failed to refresh files");
      setCategoryFiles([]);
    }
  };

  const handleMaterialChanged = async () => {
    await Promise.all([
      refreshCategoryCounts(),
      refreshFiles(),
      refreshActiveModule(),
    ]);
  };

  const optimisticDeleteFile = (fileId) => {
    setCategoryFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const optimisticRenameFile = (fileId, newName, newCategoryId) => {
    setCategoryFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? { ...f, name: newName, categoryId: newCategoryId }
          : f,
      ),
    );
  };

  const optimisticDeleteCategory = (categoryId) => {
    setModuleCategories((prev) => {
      const next = prev.filter((c) => c.id !== categoryId);
      if (selectedCategory?.id === categoryId) {
        setSelectedCategory(next.length > 0 ? next[0] : null);
      }
      return next;
    });
  };

  const optimisticRenameCategory = (categoryId, newTitle, newIconName) => {
    setModuleCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, title: newTitle, iconName: newIconName }
          : c,
      ),
    );
  };

  const optimisticCreateCategory = (tempCategory) => {
    setModuleCategories((prev) => [...prev, tempCategory]);
  };

  const optimisticCreateModule = (moduleData, semesterId) => {
    const tempId = `temp-mod-${Date.now()}`;
    setSemesters((prev) =>
      prev.map((sem) => {
        if (String(sem.id) === String(semesterId)) {
          return {
            ...sem,
            modules: [
              ...(sem.modules || []),
              {
                id: tempId,
                name: moduleData.title,
                code: moduleData.code,
                degrees: moduleData.visibility,
              },
            ],
          };
        }
        return sem;
      }),
    );
    return tempId;
  };

  const optimisticEditModule = (moduleId, updates) => {
    setSemesters((prevSemesters) => {
      let updated = prevSemesters.map((sem) => ({
        ...sem,
        modules: sem.modules
          ? sem.modules.filter((mod) => String(mod.id) !== String(moduleId))
          : [],
      }));
      updated = updated.map((sem) => {
        if (sem.name === updates.semester || sem.id === updates.semester) {
          return {
            ...sem,
            modules: [
              ...(sem.modules || []),
              {
                id: moduleId,
                name: updates.title,
                code: updates.code,
                degrees: updates.visibility,
              },
            ],
          };
        }
        return sem;
      });
      return updated;
    });
  };

  const optimisticDeleteModule = (moduleId) => {
    setSemesters((prev) =>
      prev.map((sem) => ({
        ...sem,
        modules: sem.modules
          ? sem.modules.filter((mod) => String(mod.id) !== String(moduleId))
          : [],
      })),
    );
    setActiveModuleDetails(null);
    setActiveModuleId(null);
    setSelectedCategory(null);
    setCategoryFiles([]);
  };

  const optimisticAddFile = (fileData) => {
    setCategoryFiles((prev) => [...prev, fileData]);
    setModuleCategories((prev) =>
      prev.map((c) =>
        c.id === fileData.categoryId
          ? { ...c, fileCount: (c.fileCount || 0) + 1 }
          : c,
      ),
    );
  };

  const optimisticUpdateVisibility = (semesterId, visibilityData) => {
    setSemesters((prev) =>
      prev.map((sem) =>
        String(sem.id) === String(semesterId)
          ? { ...sem, visibility: visibilityData }
          : sem,
      ),
    );
  };

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
    const tempId = optimisticCreateModule(newModule, newModule.semester);
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
              modules: (sem.modules || []).map((m) =>
                m.id === tempId ? { ...m, id: createdModule?.id || tempId } : m,
              ),
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
      setSemesters((prev) =>
        prev.map((sem) => ({
          ...sem,
          modules: (sem.modules || []).filter((m) => m.id !== tempId),
        })),
      );
      const errorMessage =
        err.response?.data?.message || err.message || "Unknown error";
      toast.error("Error", `Failed to create module: ${errorMessage}`);
    }
  };

  const handleEditModule = async (editedData) => {
    optimisticEditModule(activeModuleId, editedData);
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
      await refreshCourseStructure();
      toast.error("Error", "Failed to edit module");
    }
  };

  const handleDeleteModule = async () => {
    const moduleName = activeModuleData?.name || "Module";
    optimisticDeleteModule(activeModuleId);
    try {
      await learningService.deleteModule(activeModuleId);
      setActionModuleName(moduleName);
      setShowDeleteModal(true);
    } catch (err) {
      await refreshCourseStructure();
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
    currentUser,
    currentUserId,
    semesters,
    setSemesters,
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
    isLoadingFiles,
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
    optimisticDeleteFile,
    optimisticRenameFile,
    optimisticDeleteCategory,
    optimisticRenameCategory,
    optimisticCreateCategory,
    optimisticCreateModule,
    optimisticEditModule,
    optimisticDeleteModule,
    optimisticAddFile,
    optimisticUpdateVisibility,
  };
};

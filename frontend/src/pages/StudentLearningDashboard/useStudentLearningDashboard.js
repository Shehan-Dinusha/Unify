import { useState, useEffect } from "react";
import { getCurrentUser } from "../../services/authService";
import * as learningService from "../../services/learningService";

const CATEGORY_SUBTITLES = {
  Notes: "Slides & PDFs",
  Videos: "Class Recordings",
  "Lab Reports": "Manuals & Tasks",
  "Past Papers": "2018 - 2023",
  Additional: "External Links",
};

const enrichCategories = (categories) =>
  categories.map((cat) => ({
    ...cat,
    fileCount: cat.fileCount || 0,
    subtitle: CATEGORY_SUBTITLES[cat.title] || "Files & Docs",
  }));

export const useStudentLearningDashboard = () => {
  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id;

  const [semesters, setSemesters] = useState([]);
  const [facultyName, setFacultyName] = useState("");
  const [degreeName, setDegreeName] = useState("");
  const [batchName, setBatchName] = useState("");
  const [activeSemesterId, setActiveSemesterId] = useState(null);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [moduleCategories, setModuleCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryFiles, setCategoryFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  useEffect(() => {
    const fetchStructure = async () => {
      setIsLoading(true);
      try {
        const res = await learningService.getStudentCourseStructure(currentUserId);
        if (res?.data) {
          setSemesters(res.data.semesters || []);
          setFacultyName(res.data.facultyName || "");
          setDegreeName(res.data.degreeName || "");
          setBatchName(res.data.batchName || "");
          if (res.data.semesters?.length > 0) {
            const firstSem = res.data.semesters[0];
            setActiveSemesterId(firstSem.id);
            if (firstSem.modules?.length > 0) setActiveModuleId(firstSem.modules[0].id);
          }
        }
      } catch (err) {
        // intentionally empty
      } finally {
        setIsLoading(false);
      }
    };
    fetchStructure();
  }, [currentUserId]);

  useEffect(() => {
    if (!activeModuleId) return;
    setSelectedCategory(null);
    setCategoryFiles([]);
    setModuleCategories([]);
    let ignore = false;
    setIsLoadingDetails(true);
    const fetchCategories = async () => {
      try {
        const res = await learningService.getModuleCategories(activeModuleId);
        if (ignore) return;
        const apiCategories = res?.data?.categories || [];
        const enriched = enrichCategories(apiCategories);
        setModuleCategories(enriched);
        if (enriched.length > 0) setSelectedCategory(enriched[0]);
      } catch (err) {
        if (!ignore) setModuleCategories([]);
      } finally {
        if (!ignore) setIsLoadingDetails(false);
      }
    };
    fetchCategories();
    return () => {
      ignore = true;
    };
  }, [activeModuleId]);

  useEffect(() => {
    if (!activeModuleId || !selectedCategory) {
      setCategoryFiles([]);
      setIsLoadingFiles(false);
      return;
    }
    let ignore = false;
    setIsLoadingFiles(true);
    const fetchFiles = async () => {
      try {
        const res = await learningService.getMaterialsByCategory(activeModuleId, selectedCategory.id);
        if (ignore) return;
        setCategoryFiles(res.data || []);
      } catch (err) {
        if (!ignore) setCategoryFiles([]);
      } finally {
        if (!ignore) setIsLoadingFiles(false);
      }
    };
    fetchFiles();
    return () => {
      ignore = true;
    };
  }, [activeModuleId, selectedCategory]);

  const activeSemesterInfo = semesters.find((sem) =>
    sem.modules?.some((mod) => String(mod.id) === String(activeModuleId)),
  );

  const activeModuleData = activeSemesterInfo?.modules?.find(
    (mod) => String(mod.id) === String(activeModuleId),
  );

  const sidebarUser = (() => {
    try {
      const raw = localStorage.getItem("user");
      const role = localStorage.getItem("role");
      if (raw) {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        return { name: parsed.name || "Student", role: role || "student", displayRole: parsed.displayRole || role || "Student" };
      }
    } catch {
      // intentionally empty
    }
    return { name: currentUser?.name || "Student", role: "student", displayRole: "Student" };
  })();

  const handleSelectModule = (id) => {
    setActiveModuleId(id);
    setSelectedCategory(null);
  };

  return {
    sidebarUser, semesters, activeSemesterId, activeModuleId,
    facultyName, degreeName, batchName, moduleCategories, selectedCategory, setSelectedCategory,
    categoryFiles, isLoading, isLoadingDetails, isLoadingFiles, activeModuleData, activeSemesterInfo, handleSelectModule,
  };
};

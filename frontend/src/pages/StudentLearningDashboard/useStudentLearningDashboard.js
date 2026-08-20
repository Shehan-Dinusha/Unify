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
    const fetchCategories = async () => {
      try {
        const res = await learningService.getModuleCategories(activeModuleId);
        const apiCategories = res?.data?.categories || [];
        const enriched = enrichCategories(apiCategories);
        setModuleCategories(enriched);
        if (enriched.length > 0) setSelectedCategory(enriched[0]);
      } catch (err) {
        setModuleCategories([]);
      }
    };
    fetchCategories();
  }, [activeModuleId]);

  useEffect(() => {
    if (!activeModuleId || !selectedCategory) {
      setCategoryFiles([]);
      return;
    }
    const fetchFiles = async () => {
      try {
        const res = await learningService.getMaterialsByCategory(activeModuleId, selectedCategory.id);
        setCategoryFiles(res.data || []);
      } catch (err) {
        setCategoryFiles([]);
      }
    };
    fetchFiles();
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
    } catch {}
    return { name: currentUser?.name || "Student", role: "student", displayRole: "Student" };
  })();

  const handleSelectModule = (id) => {
    setActiveModuleId(id);
    setSelectedCategory(null);
  };

  return {
    sidebarUser, semesters, activeSemesterId, activeModuleId,
    facultyName, degreeName, batchName, moduleCategories, selectedCategory, setSelectedCategory,
    categoryFiles, isLoading, activeModuleData, activeSemesterInfo, handleSelectModule,
  };
};

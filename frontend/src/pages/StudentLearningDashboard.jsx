import React, { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import ModuleSidebar from "../components/learning/ModuleSidebar";
import StudentModuleHeader from "../components/learning/StudentModuleHeader";
import StudentCategoryGrid from "../components/learning/StudentCategoryGrid";
import StudentMaterialList from "../components/learning/StudentMaterialList";
import * as learningService from "../services/learningService";
import { getCurrentUser } from "../services/authService";

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

const StudentLearningDashboard = () => {
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

  // Fetch course structure on mount
  useEffect(() => {
    const fetchStructure = async () => {
      setIsLoading(true);
      try {
        const res =
          await learningService.getStudentCourseStructure(currentUserId);
        if (res?.data) {
          setSemesters(res.data.semesters || []);
          setFacultyName(res.data.facultyName || "");
          setDegreeName(res.data.degreeName || "");
          setBatchName(res.data.batchName || "");

          if (res.data.semesters?.length > 0) {
            const firstSem = res.data.semesters[0];
            setActiveSemesterId(firstSem.id);
            if (firstSem.modules?.length > 0) {
              setActiveModuleId(firstSem.modules[0].id);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch student course structure", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStructure();
  }, [currentUserId]);

  // Fetch module categories when activeModuleId changes
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
        if (enriched.length > 0) {
          setSelectedCategory(enriched[0]);
        }
      } catch (err) {
        console.warn("Failed to fetch module categories", err);
        setModuleCategories([]);
      }
    };
    fetchCategories();
  }, [activeModuleId]);

  // Fetch materials when selectedCategory changes
  useEffect(() => {
    if (!activeModuleId || !selectedCategory) {
      setCategoryFiles([]);
      return;
    }

    const fetchFiles = async () => {
      try {
        const res = await learningService.getMaterialsByCategory(
          activeModuleId,
          selectedCategory.id,
        );
        setCategoryFiles(res.data || []);
      } catch (err) {
        console.warn("Failed to fetch materials", err);
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

  return (
    <MainLayout
      user={sidebarUser}
      pageTitle={
        <div className="flex justify-center items-center gap-2">
          <div className="inline-flex flex-col justify-start items-start">
            <div className="justify-center text-white text-2xl font-bold font-inter leading-8">
              Learning
            </div>
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
                    <div className="justify-center text-gray-400 text-sm font-bold font-inter leading-5 w-full">
                      {facultyName || "Faculty"}
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-start mt-1">
                    <div className="justify-center text-gray-400 text-sm font-normal font-inter leading-5">
                      {degreeName || "Degree"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ModuleSidebar
              semesters={semesters}
              activeSemesterId={activeSemesterId}
              activeModuleId={activeModuleId}
              onSelectModule={(id) => {
                setActiveModuleId(id);
                setSelectedCategory(null);
              }}
              readOnly={true}
              title="Course Structure"
              className="!w-full outline-white/5 lg:!h-[calc(100vh-250px)] lg:min-h-[400px]"
            />
          </div>

          <div className="flex-1 w-full flex flex-col items-start gap-6 min-w-0 pr-0 lg:pr-2 pb-7">
            {isLoading ? (
              <div className="w-full p-10 flex items-center justify-center text-gray-400">
                Loading...
              </div>
            ) : semesters.length === 0 ? (
              <div className="w-full p-10 flex flex-col items-center justify-center gap-3 bg-slate-800 rounded-xl outline outline-1 outline-slate-700 text-gray-400">
                <Lock size={32} className="text-gray-500" />
                <p className="text-sm font-medium">
                  No semesters available yet
                </p>
                <p className="text-xs text-gray-500 text-center max-w-md">
                  Your batch rep hasn't granted access to any semesters for your
                  batch and degree. Check back later or contact your batch
                  representative.
                </p>
              </div>
            ) : semesters.some(sem => sem.modules?.length > 0) ? (
              activeModuleData ? (
                <>
                  <StudentModuleHeader
                    moduleName={activeModuleData?.name}
                    moduleCode={activeModuleData?.code || "N/A"}
                    semesterName={activeSemesterInfo?.name}
                    batchName={batchName}
                  />

                  <StudentCategoryGrid
                    key={activeModuleId}
                    categories={moduleCategories}
                    selectedCategoryId={selectedCategory?.id}
                    onCategoryClick={setSelectedCategory}
                  />

                  {moduleCategories.length > 0 ? (
                    <StudentMaterialList
                      categoryName={selectedCategory?.title || "Files"}
                      files={categoryFiles}
                    />
                  ) : (
                    <div className="w-full p-10 flex flex-col items-center justify-center bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-slate-700 text-gray-400">
                      <p>No categories available for this module yet.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full p-10 flex flex-col items-center justify-center bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-slate-700 text-gray-400">
                  <p>
                    Select a module from the sidebar to view learning materials.
                  </p>
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

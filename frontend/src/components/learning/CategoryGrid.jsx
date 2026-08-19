import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Play,
  Plus,
  BookOpen,
  Layers,
  Target,
  MoreVertical,
  Edit2,
  Trash2,
  FlaskConical,
  PenTool,
  ClipboardList,
  MonitorPlay,
  HelpCircle,
  Users,
  MoreHorizontal,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import CategoryModal from "./CategoryModal";
import * as learningService from "../../services/learningService";
import { useToast } from "../common/Toast";
import Card from "../common/Card";

// Helper to get actual icon component from name
const getIconFromName = (name) => {
  const icons = {
    FileText,
    Play,
    BookOpen,
    FlaskConical,
    PenTool,
    ClipboardList,
    MonitorPlay,
    HelpCircle,
    Users,
    MoreHorizontal,
    Layers,
    Target, // for initial
  };
  return icons[name] || FileText;
};

// Helper for generic color/bg mapping based on icon or just a generic one
const getColorClass = (idx) => {
  const colors = [
    { color: "text-blue-400", bg: "bg-blue-900/40" },
    { color: "text-red-400", bg: "bg-red-900/40" },
    { color: "text-purple-400", bg: "bg-purple-900/40" },
    { color: "text-teal-400", bg: "bg-teal-900/40" },
    { color: "text-orange-400", bg: "bg-orange-900/40" },
  ];
  return colors[idx % colors.length];
};

/**
 * Reusable Card component for Categories
 */
const CategoryCard = ({
  category,
  onEdit,
  onDelete,
  onClick,
  isSelected,
  colorIdx,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const { color, bg } = getColorClass(colorIdx);
  const Icon = getIconFromName(category.iconName);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`relative w-full h-[84px] p-2.5 sm:p-3.5 rounded-xl shadow-sm outline flex items-start gap-2.5 sm:gap-3.5 transition-all group cursor-pointer ${
        isSelected
          ? "bg-slate-700 outline-2 outline-blue-500"
          : "bg-slate-800 outline-1 outline-slate-700 hover:bg-slate-700/50"
      }`}
      onClick={onClick}
    >
      <div
        className={`p-2.5 rounded-lg flex items-center justify-center shrink-0 ${bg}`}
      >
        <Icon size={20} className={color} />
      </div>
      <div className="flex flex-col gap-1 overflow-hidden flex-1">
        <h4 className="text-white text-sm font-bold font-inter leading-5 truncate w-full pr-6">
          {category.title}
        </h4>
        <p className="text-gray-400 text-xs font-normal font-inter leading-5">
          {category.fileCount} Files
        </p>
      </div>

      {/* Dots Menu */}
      <div className="absolute top-3.5 right-3.5" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className={`p-1 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 transition-colors ${showMenu ? "opacity-100" : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"}`}
        >
          <MoreVertical size={16} />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-32 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-1 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                onEdit(category);
              }}
              className="w-full px-3 py-2 flex items-center gap-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700 transition-colors text-left"
            >
              <Edit2 size={14} />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                onDelete(category);
              }}
              className="w-full px-3 py-2 flex items-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors text-left"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Placeholder card for adding new categories
 */
const AddCategoryPlaceholder = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full h-[84px] p-3.5 rounded-xl outline-[1.5px] outline-dashed outline-gray-600 flex flex-col justify-center items-center hover:bg-white/5 transition-colors gap-2"
  >
    <div className="w-8 h-8 bg-gray-700 rounded-full flex justify-center items-center shrink-0">
      <Plus size={18} className="text-gray-400" />
    </div>
    <span className="text-gray-400 text-xs font-normal font-inter leading-5">
      Add Category
    </span>
  </button>
);

const CategoryGrid = ({
  onCategoryClick,
  initialCategories = [],
  selectedCategoryId,
  activeModuleId,
  onRefresh,
  isLoading = false,
  onDeleteCategory,
  onRenameCategory,
  onCreateCategory,
}) => {
  const [categories, setCategories] = useState(initialCategories);
  const toast = useToast();

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenCreate = () => {
    setModalMode("create");
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setModalMode("edit");
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      onDeleteCategory?.(categoryToDelete.id);
      await learningService.deleteModuleCategory(categoryToDelete.id);
      setCategoryToDelete(null);
      onRefresh?.();
    } catch (err) {
      toast.error("Error", "Failed to delete category");
      onRefresh?.();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      if (modalMode === "create") {
        if (!activeModuleId) {
          throw new Error("No active module selected");
        }
        const tempId = `temp-${Date.now()}`;
        onCreateCategory?.({
          id: tempId,
          title: categoryData.title,
          iconName: categoryData.iconName,
          fileCount: 0,
        });
        await learningService.createModuleCategory(activeModuleId, {
          title: categoryData.title,
          iconName: categoryData.iconName,
        });
      } else {
        onRenameCategory?.(categoryData.id, categoryData.title, categoryData.iconName);
        await learningService.updateModuleCategory(categoryData.id, {
          title: categoryData.title,
          iconName: categoryData.iconName,
        });
      }
      onRefresh?.();
      setIsModalOpen(false);
    } catch (err) {
      onRefresh?.();
      throw err;
    }
  };

  return (
    <>
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div
              key={`skeleton-${i}`}
              className="w-full h-[84px] p-2.5 sm:p-3.5 rounded-xl bg-slate-800 outline outline-1 outline-slate-700 flex items-start gap-2.5 sm:gap-3.5"
            >
              <div className="w-9 h-9 rounded-lg bg-white/5 animate-pulse shrink-0" />
              <div className="flex flex-col gap-2 flex-1 pt-1">
                <div className="h-3 w-24 bg-white/5 animate-pulse rounded" />
                <div className="h-2.5 w-16 bg-white/5 animate-pulse rounded" />
              </div>
            </div>
          ))
        ) : (
          <>
            {categories.map((cat, idx) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                colorIdx={idx}
                isSelected={cat.id === selectedCategoryId}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onClick={() => onCategoryClick?.(cat)}
              />
            ))}

            {Array.from({ length: Math.max(0, 8 - categories.length) }).map(
              (_, idx) => (
                <AddCategoryPlaceholder
                  key={`placeholder-${idx}`}
                  onClick={handleOpenCreate}
                />
              ),
            )}
          </>
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        mode={modalMode}
        initialData={editingCategory}
      />

      {categoryToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-dark-1/80 backdrop-blur-md transition-all duration-300">
          <Card
            variant="card"
            padding="p-0"
            className="w-96 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 flex flex-col items-center w-full">
              <div className="w-16 h-16 mb-6 bg-red-500/10 rounded-full outline outline-1 outline-red-500/20 flex justify-center items-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-white text-xl font-bold font-inter leading-5 mb-4 text-center">
                Delete this category?
              </h2>
              <div className="text-center mb-8">
                <span className="text-slate-400 text-sm font-normal font-inter leading-5">
                  Are you sure you want to delete{" "}
                  <span className="text-white font-bold">{categoryToDelete.title}</span>
                  {categoryToDelete.fileCount > 0 && (
                    <>
                      {" "}and its{" "}
                      <span className="text-white font-bold">
                        {categoryToDelete.fileCount} {categoryToDelete.fileCount === 1 ? "file" : "files"}
                      </span>
                    </>
                  )}
                  ?
                  <br />
                </span>
                <span className="text-slate-400 text-sm font-bold font-inter leading-5">
                  This action cannot be undone.
                </span>
              </div>
              <div className="w-full flex justify-center gap-3">
                <button
                  onClick={() => setCategoryToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 h-12 bg-gray-800 hover:bg-gray-700 rounded-2xl outline outline-1 outline-blue-500/20 flex justify-center items-center text-neutral-100 text-sm font-bold font-inter leading-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 h-12 bg-red-500 hover:bg-red-600 rounded-2xl flex justify-center items-center text-white text-sm font-bold font-inter leading-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Category"
                  )}
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default CategoryGrid;

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
} from "lucide-react";
import CategoryModal from "./CategoryModal";
import * as learningService from "../../services/learningService";
import { useToast } from "../common/Toast";

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
                onDelete(category.id);
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
}) => {
  const [categories, setCategories] = useState(initialCategories);
  const toast = useToast();

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [editingCategory, setEditingCategory] = useState(null);

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

  const handleDelete = async (id) => {
    try {
      await learningService.deleteModuleCategory(id);
      onRefresh?.();
    } catch (err) {
      console.error("Failed to delete category", err);
      toast.error("Error", "Failed to delete category");
    }
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      if (modalMode === "create") {
        if (!activeModuleId) {
          toast.error("Error", "No active module selected");
          return;
        }
        await learningService.createModuleCategory(activeModuleId, {
          title: categoryData.title,
          iconName: categoryData.iconName,
        });
      } else {
        await learningService.updateModuleCategory(categoryData.id, {
          title: categoryData.title,
          iconName: categoryData.iconName,
        });
      }
      onRefresh?.();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save category", err);
      toast.error("Error", "Failed to save category");
    }
  };

  return (
    <>
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
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

        {/* Placeholders (up to 8 total items) */}
        {Array.from({ length: Math.max(0, 8 - categories.length) }).map(
          (_, idx) => (
            <AddCategoryPlaceholder
              key={`placeholder-${idx}`}
              onClick={handleOpenCreate}
            />
          ),
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        mode={modalMode}
        initialData={editingCategory}
      />
    </>
  );
};

export default CategoryGrid;

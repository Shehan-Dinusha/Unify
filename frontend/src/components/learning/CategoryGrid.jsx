import { FileText, Play, Plus, BookOpen, Layers, Target } from "lucide-react";
import Button from "../common/Button";

/**
 * Reusable Card component for Categories
 */
const CategoryCard = ({
  icon: Icon,
  title,
  fileCount,
  colorClass,
  iconBgClass,
}) => (
  <button className="w-full h-[84px] p-3.5 bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-slate-700 flex items-start gap-3.5 hover:bg-slate-700/50 transition-colors text-left group">
    <div
      className={`p-2.5 rounded-lg flex items-center justify-center shrink-0 ${iconBgClass}`}
    >
      <Icon size={20} className={colorClass} />
    </div>
    <div className="flex flex-col gap-1 overflow-hidden">
      <h4 className="text-white text-sm font-bold font-inter leading-5 truncate w-full">
        {title}
      </h4>
      <p className="text-gray-400 text-xs font-normal font-inter leading-5">
        {fileCount} Files
      </p>
    </div>
  </button>
);

/**
 * Placeholder card for adding new categories
 */
const AddCategoryPlaceholder = () => (
  <button className="w-full h-[84px] p-3.5 rounded-xl outline-[1.5px] outline-dashed outline-gray-600 flex flex-col justify-center items-center hover:bg-white/5 transition-colors gap-2">
    <div className="w-8 h-8 bg-gray-700 rounded-full flex justify-center items-center shrink-0">
      <Plus size={18} className="text-gray-400" />
    </div>
    <span className="text-gray-400 text-xs font-normal font-inter leading-5">
      Add Category
    </span>
  </button>
);

const CategoryGrid = () => {
  const categories = [
    {
      title: "Notes",
      fileCount: 12,
      icon: FileText,
      colorClass: "text-blue-400",
      bgClass: "bg-blue-900/40",
    },
    {
      title: "Videos",
      fileCount: 8,
      icon: Play,
      colorClass: "text-red-400",
      bgClass: "bg-red-900/40",
    },
    {
      title: "Additional",
      fileCount: 5,
      icon: Layers,
      colorClass: "text-purple-400",
      bgClass: "bg-purple-900/40",
    },
    {
      title: "Past Papers",
      fileCount: 10,
      icon: Target,
      colorClass: "text-teal-400",
      bgClass: "bg-teal-900/40",
    },
    {
      title: "Lab Reports",
      fileCount: 4,
      icon: BookOpen,
      colorClass: "text-orange-400",
      bgClass: "bg-orange-900/40",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {categories.map((cat, idx) => (
        <CategoryCard
          key={idx}
          title={cat.title}
          fileCount={cat.fileCount}
          icon={cat.icon}
          colorClass={cat.colorClass}
          iconBgClass={cat.bgClass}
        />
      ))}

      {/* Placeholders */}
      <AddCategoryPlaceholder />
      <AddCategoryPlaceholder />
      <AddCategoryPlaceholder />
    </div>
  );
};

export default CategoryGrid;

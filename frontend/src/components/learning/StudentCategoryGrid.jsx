import React from "react";
import { Folder } from "lucide-react";

/**
 * Helper for category colors based on index
 */
const getCategoryColor = (idx) => {
  const colors = [
    { text: "text-yellow-400", bg: "bg-slate-800" },
    { text: "text-blue-400", bg: "bg-slate-800" },
    { text: "text-purple-400", bg: "bg-slate-800" },
    { text: "text-emerald-400", bg: "bg-slate-800" },
    { text: "text-orange-400", bg: "bg-slate-800" },
  ];
  return colors[idx % colors.length];
};

/**
 * Vertical folder card for categories
 */
const StudentCategoryCard = ({ category, idx, isSelected, onClick }) => {
  const { text, bg } = getCategoryColor(idx);

  return (
    <div
      onClick={onClick}
      className={`p-4 sm:p-5 rounded-xl outline outline-1 outline-offset-[-0.91px] flex flex-col justify-between items-start cursor-pointer hover:bg-slate-700/50 transition-colors w-full ${
        isSelected ? "outline-blue-500 bg-slate-700" : "outline-white/5 " + bg
      }`}
    >
      <div className="w-full pb-3.5 flex flex-col justify-start items-start">
        <div className="w-full flex justify-between items-start">
          <Folder
            size={40}
            className={text}
            strokeWidth={1}
            fill="currentColor"
          />
          <div className="px-2.5 py-1 bg-white/10 rounded-full outline outline-1 outline-offset-[-0.91px] outline-white/5 flex flex-col justify-start items-start">
            <div className="justify-center text-gray-400 text-xs font-normal font-inter leading-5">
              {category.fileCount}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex-1 min-h-[40px] pt-5 flex flex-col justify-end items-start">
        <div className="w-full flex flex-col justify-start items-start gap-1">
          <div className="w-full flex flex-col justify-start items-start">
            <div className="w-full justify-start text-white text-sm font-bold font-inter leading-5 truncate">
              {category.title}
            </div>
          </div>
          <div className="w-full flex flex-col justify-start items-start">
            <div className="w-full justify-start text-gray-400 text-xs font-normal font-inter leading-5 truncate">
              {category.subtitle || "Files & Docs"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Renders a grid of student category cards
 */
const StudentCategoryGrid = ({
  categories = [],
  selectedCategoryId,
  onCategoryClick,
}) => {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-3.5 w-full">
      <div className="self-stretch justify-start text-gray-400 text-xs font-bold font-inter leading-5 uppercase">
        CATEGORIES
      </div>
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {categories.map((cat, idx) => (
          <StudentCategoryCard
            key={cat.id}
            category={cat}
            idx={idx}
            isSelected={cat.id === selectedCategoryId}
            onClick={() => onCategoryClick?.(cat)}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentCategoryGrid;

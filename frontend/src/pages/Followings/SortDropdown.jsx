import React from 'react';
import { ChevronDown } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'asc', label: 'Name (A-Z)' },
  { value: 'desc', label: 'Name (Z-A)' },
];

const SortDropdown = ({ sortOrder, isOpen, onToggle, onChange }) => {
  const currentLabel = SORT_OPTIONS.find((o) => o.value === sortOrder)?.label || 'Name (A-Z)';

  return (
    <div className="flex items-center justify-between w-full md:w-auto gap-2 md:mb-2 relative mt-2 md:mt-0">
      <span className="text-gray-400 text-sm font-normal font-inter leading-5 whitespace-nowrap">Sort by:</span>
      <button
        onClick={onToggle}
        className="h-9 px-4 flex items-center justify-between bg-white/5 rounded-2xl border border-white/10 w-full md:w-48 cursor-pointer hover:bg-white/10 transition-colors"
      >
        <span className="text-white text-xs md:text-xs font-bold font-inter leading-5 truncate mr-2">{currentLabel}</span>
        <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-11 right-0 w-full md:w-48 bg-[#1C2333] border border-white/10 rounded-2xl shadow-xl z-20 overflow-hidden flex flex-col">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`text-left px-4 py-3 text-sm font-inter hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 ${
                sortOrder === opt.value ? 'text-blue-500' : 'text-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;

import { ChevronDown } from "lucide-react";
import Button from "../../components/common/Button";

const ReviewFilterBar = ({
  tabs, activeTab, onTabChange,
  sortOptions, sortBy, onSortChange,
  isSortOpen, onToggleSort,
}) => (
  <div className="w-full py-2 flex items-center justify-between mt-2 mb-2 gap-2 sm:gap-4">
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 sm:flex-auto">
      {tabs.map((tab) => (
        <Button
          size="small"
          variant={activeTab === tab ? "primary" : "secondary"}
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`h-9 px-4 rounded-2xl flex justify-center items-center font-bold text-sm whitespace-nowrap min-w-max transition-all ${
            activeTab !== tab
              ? "bg-gray-800 text-gray-400 border border-transparent hover:bg-white/5"
              : "text-white"
          }`}
        >
          {tab}
        </Button>
      ))}
    </div>

    <div className="flex items-center gap-2 shrink-0">
      <span className="hidden sm:inline-block text-gray-400 text-sm font-normal font-inter">
        Sort by:
      </span>
      <div className="relative">
        <div
          className="w-10 sm:w-36 h-9 sm:h-9 bg-white/5 sm:rounded-2xl rounded-xl outline outline-1 outline-white/10 shadow-[inner_0px_2px_4px_1px_rgba(0,0,0,0.05)] flex items-center justify-center sm:justify-between px-0 sm:px-4 cursor-pointer hover:bg-white/10 transition-colors"
          onClick={onToggleSort}
        >
          <span className="hidden sm:block text-white text-xs font-bold font-inter">
            {sortBy}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${isSortOpen ? "rotate-180" : ""}`}
          />
        </div>

        {isSortOpen && (
          <div className="absolute top-full mt-2 right-0 sm:left-0 w-36 bg-gray-800 rounded-xl border border-white/10 shadow-lg overflow-hidden z-20">
            {sortOptions.map((option) => (
              <div
                key={option}
                className={`px-4 py-2.5 text-xs font-inter cursor-pointer transition-colors ${
                  sortBy === option
                    ? "text-white font-bold bg-white/10"
                    : "text-gray-400 hover:bg-white/5"
                }`}
                onClick={() => onSortChange(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ReviewFilterBar;

import { ChevronDown } from "lucide-react";
import { CoffeeIcon, HouseIcon, InfoCircleIcon } from "../../components/common/Icons";
import Button from "../../components/common/Button";
import { tabs, sortOptions } from "./useMyReviewHistory";

const tabIcon = {
  Boarding: <HouseIcon />,
  "Food/Cafe": <CoffeeIcon />,
  Services: <InfoCircleIcon />,
};

const ReviewFilterBar = ({
  activeTab, onTabChange,
  sortBy, onSortChange,
  isSortOpen, onToggleSort,
}) => (
  <div className="w-full py-2 flex items-center justify-between gap-2 sm:gap-4 mb-6 sm:mb-8">
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 sm:flex-auto">
      {tabs.map((tab) => (
        <Button
          size="small"
          variant={activeTab === tab ? "primary" : "secondary"}
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`h-9 whitespace-nowrap min-w-[112px] flex justify-center items-center transition-all ${
            activeTab !== tab
              ? "bg-dark-4 text-text-secondary border border-white/10 hover:bg-white/5"
              : "border border-transparent"
          }`}
        >
          {tab === "All Reviews" ? "All Reviews" : (
            <div className="flex items-center gap-1.5">
              {tabIcon[tab]}
              {tab}
            </div>
          )}
        </Button>
      ))}
    </div>

    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
      <span className="hidden sm:inline-block text-gray-400 text-sm font-bold font-inter">Sort by:</span>
      <div className="relative">
        <div
          className="w-10 sm:w-40 h-9 sm:h-11 bg-white/5 sm:rounded-2xl rounded-xl outline outline-1 outline-white/10 shadow-[inner_0px_2px_4px_1px_rgba(0,0,0,0.05)] flex items-center justify-center sm:justify-between px-0 sm:px-4 cursor-pointer hover:bg-white/10 transition-colors"
          onClick={onToggleSort}
        >
          <span className="hidden sm:block text-white text-sm font-inter whitespace-nowrap overflow-hidden text-ellipsis">{sortBy}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
        </div>

        {isSortOpen && (
          <div className="absolute top-full mt-2 w-40 sm:w-40 right-0 bg-gray-800 rounded-xl outline outline-1 outline-white/10 shadow-lg overflow-hidden z-20">
            {sortOptions.map((option) => (
              <div
                key={option}
                className={`px-4 py-2.5 text-sm font-inter cursor-pointer transition-colors ${
                  sortBy === option
                    ? "text-white font-bold bg-white/10"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
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

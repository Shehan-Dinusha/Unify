import { Search, RotateCcw } from "lucide-react";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import { reasonOptions, dateOptions } from "./useSuspendedUsers";

const SuspendedFilterBar = ({
  searchQuery, onSearchChange,
  reasonFilter, onReasonChange,
  dateFilter, onDateChange,
  onReset,
}) => (
  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-md mb-lg">
    <div className="flex-1">
      <Input icon={Search} placeholder="Search by name, email or ID..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} />
    </div>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-md">
      <div className="w-full sm:w-48">
        <Select options={reasonOptions} value={reasonFilter} onChange={(e) => onReasonChange(e.target.value)} />
      </div>
      <div className="w-full sm:w-52">
        <Select options={dateOptions} value={dateFilter} onChange={(e) => onDateChange(e.target.value)} />
      </div>
      <button onClick={onReset} className="flex items-center gap-xs text-body-small-bold text-state-error hover:text-state-error/80 transition-colors whitespace-nowrap">
        <RotateCcw size={14} />
        Reset Filters
      </button>
    </div>
  </div>
);

export default SuspendedFilterBar;

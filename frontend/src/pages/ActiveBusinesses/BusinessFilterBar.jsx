import { RotateCcw } from "lucide-react";
import Select from "../../components/common/Select";

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "Self Employee", label: "Self Employee" },
  { value: "Boarding", label: "Boarding" },
  { value: "Food & Cafe", label: "Food & Cafe" },
  { value: "Clubs & Society", label: "Clubs & Society" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "Active", label: "• Active" },
  { value: "Suspended", label: "• Suspended" },
];

const BusinessFilterBar = ({
  activeFilter, onActiveFilterChange,
  categoryFilter, onCategoryFilterChange,
  statusFilter, onStatusFilterChange,
  onReset,
}) => (
  <div className="flex flex-wrap items-center gap-md mb-md">
    <button
      onClick={() => onActiveFilterChange("All Businesses")}
      className={`px-lg py-sm rounded-xl text-body-small-bold font-inter border transition-all ${
        activeFilter === "All Businesses"
          ? "bg-primary-blue/20 text-primary-blue border-primary-blue/50"
          : "border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/5"
      }`}
    >
      All Businesses
    </button>

    <div className="w-full md:w-64">
      <Select options={categoryOptions} value={categoryFilter} onChange={(e) => onCategoryFilterChange(e.target.value)} />
    </div>

    <div className="w-full md:w-40">
      <Select options={statusOptions} value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)} />
    </div>

    <div className="hidden md:block flex-1" />

    <button onClick={onReset} className="flex items-center gap-xs text-body-small-bold text-state-error hover:text-state-error/80 transition-colors">
      <RotateCcw size={14} />
      Reset Filters
    </button>
  </div>
);

export default BusinessFilterBar;

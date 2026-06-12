import React from 'react';
import { RotateCcw } from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { Search } from 'lucide-react';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'Pending Review', label: '● Pending Review' },
  { value: 'Resolved', label: '● Resolved' },
  { value: 'In Progress', label: '● In Progress' },
  { value: 'Withdrawn', label: '● Withdrawn' },
  { value: 'Dismissed', label: '● Dismissed' },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'inappropriate', label: '⚠️ Inappropriate' },
  { value: 'spam', label: '📩 Spam' },
  { value: 'harassment', label: '🚫 Harassment' },
  { value: 'misinformation', label: '📰 Misinformation' },
];

const ReportFilterBar = ({ searchQuery, onSearchChange, activeFilter, onFilterChange, categoryFilter, onCategoryChange, statusFilter, onStatusChange, onReset }) => (
  <>
    <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-md mb-lg">
      <div>
        <h2 className="text-heading-small text-text-primary">My Submitted Reports</h2>
        <p className="text-body-small text-text-secondary mt-xs">Track the status of your reports submitted to the administration.</p>
      </div>
      <div className="w-full md:w-72">
        <Input icon={Search} placeholder="Search by title or ID...." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} />
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-md mb-md">
      <button
        onClick={() => { onFilterChange('All Reports'); onStatusChange('all'); onCategoryChange('all'); }}
        className={`px-lg py-sm rounded-xl text-body-small-bold font-inter border transition-all ${activeFilter === 'All Reports'
          ? 'bg-primary-blue/20 text-primary-blue border-primary-blue/50'
          : 'border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/5'
        }`}
      >
        All Reports
      </button>

      <div className="w-full md:w-52">
        <Select options={categoryOptions} value={categoryFilter} onChange={(e) => onCategoryChange(e.target.value)} />
      </div>

      <div className="w-full md:w-44">
        <Select options={statusOptions} value={statusFilter} onChange={(e) => onStatusChange(e.target.value)} />
      </div>

      <div className="hidden md:block flex-1" />

      <button onClick={onReset} className="flex items-center gap-xs text-body-small-bold text-state-error hover:text-state-error/80 transition-colors">
        <RotateCcw size={14} />
        Reset Filters
      </button>
    </div>
  </>
);

export default ReportFilterBar;

import React from 'react';
import { RotateCcw } from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { Search } from 'lucide-react';

const facultyOptions = [
  { value: 'all', label: 'All Faculties' },
  { value: 'it', label: 'Information Technology' },
  { value: 'eng', label: 'Engineering' },
  { value: 'arch', label: 'Architecture' },
  { value: 'bus', label: 'Business' },
  { value: 'med', label: 'Medicine' },
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: '● Active' },
  { value: 'suspended', label: '● Suspended' },
];

const StudentFilterBar = ({ searchQuery, onSearchChange, activeFilter, onFilterChange, facultyFilter, onFacultyChange, statusFilter, onStatusChange, onReset }) => (
  <>
    <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-md mb-lg">
      <div>
        <h2 className="text-heading-small text-text-primary">Student Directory</h2>
        <p className="text-body-small text-text-secondary mt-xs">Manage and monitor elite student profiles.</p>
      </div>
      <div className="w-full md:w-72">
        <Input icon={Search} placeholder="Search by name, index or NIC...." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} />
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-md mb-md">
      <button
        onClick={() => onFilterChange('All Students')}
        className={`px-lg py-sm rounded-xl text-body-small-bold font-inter border transition-all ${activeFilter === 'All Students'
          ? 'bg-primary-blue/20 text-primary-blue border-primary-blue/50'
          : 'border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/5'
        }`}
      >
        All Students
      </button>

      <div className="w-full md:w-64">
        <Select options={facultyOptions} value={facultyFilter} onChange={(e) => onFacultyChange(e.target.value)} />
      </div>

      <div className="w-full md:w-40">
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

export default StudentFilterBar;

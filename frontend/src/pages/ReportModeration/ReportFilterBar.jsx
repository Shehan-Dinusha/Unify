import React from 'react';
import Select from '../../components/common/Select';
import { RotateCcw } from 'lucide-react';

const ReportFilterBar = ({ filterType, setFilterType, filterStatus, setFilterStatus, typeOptions, statusOptions, onReset }) => (
    <div className="flex flex-wrap items-center gap-md">
        <div className="w-full md:w-48">
            <Select options={typeOptions} value={filterType} onChange={(e) => setFilterType(e.target.value)} />
        </div>
        <div className="w-full md:w-40">
            <Select options={statusOptions} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} />
        </div>
        <div className="hidden md:block flex-1" />
        <button onClick={onReset} className="flex items-center gap-xs text-body-small-bold text-state-error hover:text-state-error/80 transition-colors">
            <RotateCcw size={14} /> Reset Filters
        </button>
    </div>
);

export default ReportFilterBar;

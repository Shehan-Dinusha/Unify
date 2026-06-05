import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import StatusDropdown, { ALL_PRODUCT_STATUSES, ALL_EVENT_STATUSES, PRODUCT_STATUSES, EVENT_STATUSES } from './StatusDropdown';

const BulkActionBar = ({ orders, type, filterStatus, setFilterStatus, bulkFrom, setBulkFrom, bulkTo, setBulkTo, applyBulk }) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const ALL_STATUSES = type === 'club-event' ? ALL_EVENT_STATUSES : ALL_PRODUCT_STATUSES;
  const bulkStatuses = type === 'club-event' ? EVENT_STATUSES : PRODUCT_STATUSES;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <button
          onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
          className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
        >
          {filterStatus === 'All Statuses' ? 'Select Status' : filterStatus}
          <ChevronDown className={`w-4 h-4 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isStatusDropdownOpen && (
          <div className="absolute left-0 top-full mt-2 w-52 z-50 bg-[#1A2F45]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            {['All Statuses', ...ALL_STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => { setFilterStatus(s); setIsStatusDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-white/10 transition-colors flex items-center justify-between ${s === filterStatus ? 'text-primary-blue bg-white/5' : 'text-white/80'}`}
              >
                {s}
                {s === filterStatus && <Check className="w-3 h-3" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-[#1A2F45]/80 rounded-xl px-3 sm:px-4 py-3 sm:py-2 text-sm w-full xl:w-auto">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-text-secondary text-[11px] font-medium shrink-0">Bulk Status:</span>
          <StatusDropdown value={bulkFrom} onChange={setBulkFrom} options={ALL_STATUSES} align="left" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto mt-1 sm:mt-0">
          <span className="text-text-secondary text-[11px] shrink-0">To:</span>
          <StatusDropdown value={bulkTo} onChange={setBulkTo} options={bulkStatuses} align="left" />
          <button
            onClick={applyBulk}
            className="bg-white text-dark-1 hover:bg-white/90 px-3 sm:px-4 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all shrink-0"
          >
            <span className="sm:hidden">Apply</span>
            <span className="hidden sm:inline">Apply to All</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionBar;

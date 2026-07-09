import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SuspendedPagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mb-lg">
      <p className="text-body-extra-small text-text-secondary font-inter">
        Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
      </p>
      <div className="flex items-center gap-sm">
        <button
          onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
          disabled={pagination.page <= 1}
          className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:bg-white/10 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
          .map((p, idx, arr) => (
            <React.Fragment key={p}>
              {idx > 0 && arr[idx - 1] !== p - 1 && (
                <span className="text-text-tertiary text-xs px-1">…</span>
              )}
              <button
                onClick={() => onPageChange(p)}
                className={`w-9 h-9 rounded-lg text-body-extra-small-bold font-inter flex items-center justify-center transition-all ${
                  p === pagination.page
                    ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/25"
                    : "bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10 hover:text-text-primary"
                }`}
              >
                {p}
              </button>
            </React.Fragment>
          ))}
        <button
          onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
          disabled={pagination.page >= pagination.totalPages}
          className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:bg-white/10 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default SuspendedPagination;

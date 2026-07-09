import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationBar = ({ currentPage, totalPages, totalCount, startItem, endItem, onPageChange }) => (
  <div className="hidden md:flex flex-col sm:flex-row items-center justify-between gap-md mb-lg px-sm">
    <p className="text-body-small text-text-secondary">
      Showing {startItem}–{endItem} of {totalCount} businesses
    </p>
    <div className="flex items-center gap-sm">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-xs px-md py-sm rounded-xl text-body-small-bold border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} /> Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
        .reduce((acc, p, idx, arr) => {
          if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
          acc.push(p);
          return acc;
        }, [])
        .map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-sm text-text-secondary">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-lg text-body-small-bold transition-all ${
                currentPage === p
                  ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/25"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5 border border-white/10"
              }`}
            >
              {p}
            </button>
          )
        )}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-xs px-md py-sm rounded-xl text-body-small-bold border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  </div>
);

export default PaginationBar;

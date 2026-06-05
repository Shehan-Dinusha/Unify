import { ChevronLeft, ChevronRight } from "lucide-react";

const MobilePagination = ({ currentPage, totalPages, onPageChange }) => (
  totalPages > 1 ? (
    <div className="flex items-center justify-center gap-md mt-md mb-lg md:hidden">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-md py-sm rounded-xl text-body-small-bold border border-white/10 text-text-secondary disabled:opacity-30"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-body-small text-text-secondary">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-md py-sm rounded-xl text-body-small-bold border border-white/10 text-text-secondary disabled:opacity-30"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  ) : null
);

export default MobilePagination;

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAvatarUrl } from '../../utils/formatters';

const StudentTable = ({ students, loading, error, currentPage, totalPages, totalCount, pageLimit, onPageChange }) => {
  const startItem = (currentPage - 1) * pageLimit + 1;
  const endItem = Math.min(currentPage * pageLimit, totalCount);

  if (error) return null;

  // inject navigate indirectly
  const handleViewProfile = (id) => {
    window.location.href = `/student-management/${id}`;
  };

  return (
    <>
      <div className="relative overflow-hidden border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm mb-md hidden md:block">
        <div className="grid gap-md px-lg py-md border-b border-white/10" style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.2fr' }}>
          <span className="text-body-small-bold text-text-secondary">Student Name</span>
          <span className="text-body-small-bold text-text-secondary">Faculty</span>
          <span className="text-body-small-bold text-text-secondary">Status</span>
          <span className="text-body-small-bold text-text-secondary">Last Active</span>
          <span className="text-body-small-bold text-text-secondary text-right">Actions</span>
        </div>

        {loading && (
          <div className="px-lg py-xl text-center text-text-secondary text-body-small">Loading students...</div>
        )}

        {!loading && !error && students.map((student, idx) => (
          <div
            key={student.id}
            className={`grid gap-md px-lg py-md items-center hover:bg-white/5 transition-colors ${idx < students.length - 1 ? 'border-b border-white/5' : ''}`}
            style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.2fr' }}
          >
            <div className="flex items-center gap-md min-w-0">
              <img src={getAvatarUrl(student.avatar, student.name)} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0" />
              <div className="min-w-0">
                <p className="text-body-medium-bold text-text-primary truncate">{student.name}</p>
                <p className="text-body-extra-small text-text-secondary truncate">{student.email}</p>
              </div>
            </div>
            <span className="text-body-small text-text-secondary truncate">{student.faculty}</span>
            <div>
              <span className={`inline-flex items-center gap-xs text-body-small-bold px-sm py-xs rounded-lg ${student.status === 'Active'
                ? 'text-state-success bg-state-success/10 border border-state-success/30'
                : 'text-state-error bg-state-error/10 border border-state-error/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-state-success' : 'bg-state-error'}`} />
                {student.status}
              </span>
            </div>
            <span className="text-body-small text-text-secondary">{student.lastActive}</span>
            <div className="flex items-center justify-end">
              <button
                onClick={() => handleViewProfile(student.id)}
                className="px-md py-xs rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue hover:shadow-lg hover:shadow-primary-blue/25 transition-all duration-200"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}

        {!loading && !error && students.length === 0 && (
          <div className="px-lg py-xl text-center text-text-secondary text-body-small">No students found matching your filters.</div>
        )}
      </div>

      {!loading && !error && totalCount > 0 && (
        <div className="hidden md:flex flex-col sm:flex-row items-center justify-between gap-md mb-lg px-sm">
          <p className="text-body-small text-text-secondary">Showing {startItem}–{endItem} of {totalCount} students</p>
          <div className="flex items-center gap-sm">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-xs px-md py-sm rounded-xl text-body-small-bold border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-sm text-text-secondary">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`w-9 h-9 rounded-lg text-body-small-bold transition-all ${currentPage === p
                      ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/25'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5 border border-white/10'
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
      )}
    </>
  );
};

export default StudentTable;

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../components/common/Card';
import { getAvatarUrl } from '../../utils/formatters';

const StudentMobileCards = ({ students, loading, error, currentPage, totalPages, totalCount, pageLimit, onPageChange }) => {
  if (loading || error) return null;

  const handleViewProfile = (id) => {
    window.location.href = `/student-management/${id}`;
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-md md:hidden mb-lg">
        {students.map((student) => (
          <Card key={student.id} variant="container" className="hover:bg-white/5 transition-colors">
            <div className="flex flex-col gap-md">
              <div className="flex items-center gap-md">
                <img src={getAvatarUrl(student.avatar, student.name)} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-body-medium-bold text-text-primary truncate">{student.name}</p>
                  <p className="text-body-extra-small text-text-secondary truncate">{student.email}</p>
                </div>
                <span className={`inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg shrink-0 ${student.status === 'Active'
                  ? 'text-state-success bg-state-success/10 border border-state-success/30'
                  : 'text-state-error bg-state-error/10 border border-state-error/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-state-success' : 'bg-state-error'}`} />
                  {student.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-small text-text-secondary">{student.faculty}</span>
                <span className="text-body-extra-small text-text-secondary">{student.lastActive}</span>
              </div>
              <button
                onClick={() => handleViewProfile(student.id)}
                className="w-full py-sm rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue transition-all duration-200 text-center"
              >
                View Profile
              </button>
            </div>
          </Card>
        ))}
      </div>

      {!loading && !error && totalCount > pageLimit && (
        <div className="flex items-center justify-center gap-md mb-lg md:hidden">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-md py-sm rounded-xl text-body-small-bold border border-white/10 text-text-secondary disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-body-small text-text-secondary">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-md py-sm rounded-xl text-body-small-bold border border-white/10 text-text-secondary disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </>
  );
};

export default StudentMobileCards;

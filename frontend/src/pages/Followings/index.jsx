import React from 'react';
import { Loader2 } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import LoadMoreButton from '../../components/common/LoadMoreButton';
import { useFollowings } from './useFollowings';
import FollowingCard from './FollowingCard';
import SortDropdown from './SortDropdown';
import NotFound from '../NotFound';

const getSidebarUser = () => {
  try {
    const raw = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    if (raw) {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return { name: parsed.name || 'User', role: role || 'student', displayRole: parsed.displayRole || role || 'Student' };
    }
  } catch (e) {}
  return { name: 'User', role: 'student', displayRole: 'Student' };
};

const Followings = () => {
  const {
    followings, totalFollowings, isLoading, isLoadingMore, hasMore, error, errorStatus,
    sortOrder, isSortDropdownOpen, setIsSortDropdownOpen,
    handleLoadMore, handleSortChange, handleUnfollow,
  } = useFollowings();

  if (errorStatus) return <NotFound status={errorStatus} />;

  return (
    <MainLayout user={getSidebarUser()} pageTitle="Profile">
      <div className="flex flex-col h-full mx-auto w-full relative max-w-[1000px] px-4 md:px-0">
        <div className="w-64 h-64 md:w-96 md:h-96 absolute right-[-50px] md:right-[-200px] top-[200px] md:top-[400px] bg-purple-800/20 rounded-full blur-3xl pointer-events-none z-[-1]" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-8 border-b border-blue-500/20 w-full pt-4 md:pt-4 mb-6 gap-4 md:gap-0">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-3">
              <h1 className="text-white text-2xl md:text-3xl font-bold font-inter leading-8 md:leading-9">Following</h1>
              <div className="px-3 py-1 bg-blue-600/10 rounded-full flex items-center justify-center">
                <span className="text-blue-500 text-xs md:text-sm font-bold font-lexend leading-4 md:leading-5">
                  {isLoading ? '...' : totalFollowings}
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm md:text-base font-normal font-inter leading-5 w-full max-w-[600px]">
              Manage the organizations you follow and stay updated with their latest activities.
            </p>
          </div>

          <SortDropdown
            sortOrder={sortOrder}
            isOpen={isSortDropdownOpen}
            onToggle={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            onChange={handleSortChange}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-8">
            <p className="text-red-400 text-sm font-inter">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-slate-400 font-inter">Loading followings...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-10 w-full flex-1">
            {followings.length > 0 ? (
              followings.map((following) => (
                <FollowingCard key={following.id} following={following} onUnfollow={handleUnfollow} />
              ))
            ) : (
              <div className="w-full text-center py-12 text-slate-400 bg-white/5 rounded-2xl border border-white/10 px-4">
                You aren't following anyone yet.
              </div>
            )}
          </div>
        )}

        {hasMore && followings.length > 0 && !isLoading && (
          <div className="pb-12 flex justify-center w-full">
            {isLoadingMore ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            ) : (
              <LoadMoreButton visibleCount={followings.length} totalCount={totalFollowings} onClick={handleLoadMore} itemName="Followings" />
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Followings;

import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import { useNotification } from './useNotification';
import NotificationCard from './NotificationCard';

const Notification = () => {
  const {
    FILTERS, activeFilter, notifications, loading, error,
    searchInputRef, showSearch, setShowSearch, searchQuery, setSearchQuery,
    unreadCount, user, fetchNotifications,
    handleFilterChange, handleMarkRead, handleNavigateToPost,
  } = useNotification();

  const headerRight = (
    <div className="flex items-center gap-2">
      {showSearch && (
        <div className="flex items-center bg-dark-2 border border-primary-blue/30 rounded-full px-4 py-1.5 animate-in slide-in-from-right-4 duration-200">
          <Search size={16} className="text-text-secondary mr-2 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-text-secondary outline-none w-48 sm:w-64"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="ml-1 text-text-secondary hover:text-white transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
      )}
      <button
        onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchQuery(''); }}
        className={`p-2 flex items-center justify-center shrink-0 rounded-full transition-colors ${
          showSearch ? 'bg-primary-blue/20 text-primary-blue' : 'hover:bg-white/5'
        }`}
      >
        {showSearch ? <X size={20} className="text-primary-blue" /> : <img src="/icon_search.svg" alt="Search" className="w-6 h-6 opacity-70" />}
      </button>
    </div>
  );

  return (
    <MainLayout user={user} pageTitle="Notifications" headerRight={headerRight}>
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto px-2 sm:px-0">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-body-small font-semibold transition-all duration-150 whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-primary-blue text-white'
                  : 'bg-white/5 text-text-secondary hover:bg-white/10 border border-white/10'
              }`}
            >
              {filter}
              {filter === 'Unread' && unreadCount > 0 && (
                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[11px] font-bold ${
                  activeFilter === filter ? 'bg-white text-primary-blue' : 'bg-primary-blue text-white'
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
              <p className="text-text-secondary animate-pulse">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="bg-state-error/10 border border-state-error/20 rounded-2xl p-6 text-center">
              <p className="text-state-error font-semibold">{error}</p>
              <button onClick={() => fetchNotifications()} className="mt-4 text-sm text-text-secondary hover:text-white underline">
                Try again
              </button>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
                onNavigate={handleNavigateToPost}
              />
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <span className="text-heading-medium opacity-50">📭</span>
              </div>
              <p className="text-body-medium text-text-secondary">No notifications found.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Notification;

import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { EmptyChatList } from '../../components/chat/EmptyChatState';
import ConversationItem from './ConversationItem';

const TABS = ['All', 'Unread'];

const ConversationList = ({
  activeChatId,
  onSelectContact,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  conversations,
  loading,
  totalUnread,
  tabFilteredList,
  searchInputRef,
  formatChatTime,
  isConnected,
}) => {
  const hasConversations = conversations.length > 0;

  return (
    <div
      className={`w-full md:w-[320px] flex-shrink-0 flex flex-col bg-dark-1/70 backdrop-blur-2xl border-r border-white/10 transition-all duration-300 ${
        activeChatId ? 'hidden md:flex' : 'flex'
      }`}
    >
      <div className="px-md pt-sm pb-1 flex-shrink-0 flex items-center justify-between">
        <div className="flex-1" />
        {isConnected && <div className="w-2 h-2 rounded-full bg-state-success shadow-[0_0_8px_rgba(74,222,128,0.5)]" title="Connected" />}
      </div>

      <div className="px-md pb-2 flex-shrink-0">
        <div className="relative group">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary-blue transition-colors"
          />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or start a new chat"
            className="w-full bg-white/5 rounded-full py-2 pl-9 pr-md text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:bg-white/8 transition-all"
          />
        </div>
      </div>

      <div className="px-md pb-2 flex items-center gap-sm flex-shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1 px-md py-1 rounded-full text-[12px] font-semibold transition-all ${
              activeTab === tab
                ? 'bg-primary-blue/20 text-primary-blue border border-primary-blue/30'
                : 'bg-white/5 text-text-tertiary hover:bg-white/10 hover:text-text-primary border border-transparent'
            }`}
          >
            {tab}
            {tab === 'Unread' && totalUnread > 0 && (
              <span className="bg-primary-blue text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                {totalUnread}
              </span>
            )}
          </button>
        ))}
      </div>

      {searchQuery.trim().length === 0 && conversations.length > 0 && (
        <div className="px-md pb-1 flex-shrink-0">
          <span className="text-[11px] font-bold text-primary-blue/60 uppercase tracking-widest">
            {activeTab === 'All' ? 'Recent' : activeTab}
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-xl gap-3">
            <Loader2 className="w-6 h-6 text-primary-blue animate-spin" />
            <p className="text-body-extra-small text-text-tertiary">Loading chats...</p>
          </div>
        ) : !hasConversations && !searchQuery ? (
          <EmptyChatList
            onStartChat={() => searchInputRef.current?.focus()}
          />
        ) : tabFilteredList.length === 0 && searchQuery ? (
          <div className="p-xl text-center flex flex-col items-center opacity-50 mt-lg">
            <Search size={28} className="mb-sm text-text-tertiary" />
            <p className="text-body-small italic text-text-tertiary">
              No results found
            </p>
          </div>
        ) : (
          tabFilteredList.map((chat) => (
            <ConversationItem
              key={chat.id}
              chat={chat}
              isActive={activeChatId === chat.id}
              onSelect={onSelectContact}
              formatTime={formatChatTime}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;

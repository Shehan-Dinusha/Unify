import React from 'react';
import { CheckCheck } from 'lucide-react';

const ConversationItem = ({ chat, isActive, onSelect, formatTime }) => {
  const otherUser = chat.otherUser || {};
  const avatarUrl =
    otherUser.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${otherUser.name || 'U'}`;

  return (
    <button
      onClick={() => onSelect(chat)}
      className={`w-full flex items-center gap-3 px-md py-3 transition-all relative ${
        isActive
          ? 'bg-primary-blue/15 border-r-2 border-primary-blue'
          : 'hover:bg-white/5 border-r-2 border-transparent'
      }`}
    >
      <div className="relative flex-shrink-0">
        <img
          src={avatarUrl}
          alt={otherUser.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {otherUser.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary-blue rounded-full border-2 border-dark-1" />
        )}
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[14px] font-semibold text-text-primary truncate">
            {otherUser.name}
          </span>
          <span
            className={`text-[11px] flex-shrink-0 ml-2 ${
              (chat.unreadCount || 0) > 0
                ? 'text-primary-blue font-medium'
                : 'text-text-tertiary'
            }`}
          >
            {formatTime(chat.lastMessageAt)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p
            className={`text-[12px] truncate pr-2 flex items-center gap-1 ${
              chat.isSuggested
                ? 'italic opacity-50 text-text-tertiary'
                : 'text-text-tertiary'
            }`}
          >
            {!chat.isSuggested &&
              !(chat.unreadCount > 0) &&
              chat.status === 'delivered' && (
                <CheckCheck
                  size={12}
                  className="flex-shrink-0 text-text-tertiary/60"
                />
              )}
            {!chat.isSuggested &&
              !(chat.unreadCount > 0) &&
              chat.status === 'seen' && (
                <CheckCheck
                  size={12}
                  className="flex-shrink-0 text-primary-blue"
                />
              )}
            {chat.lastMessageText || 'No messages yet'}
          </p>
          {(chat.unreadCount || 0) > 0 && (
            <span className="min-w-[20px] h-5 bg-primary-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 flex-shrink-0">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;

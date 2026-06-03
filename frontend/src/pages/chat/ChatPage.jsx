import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { ShieldAlert } from 'lucide-react';
import ChatWindow from '../../components/chat/ChatWindow';
import { EmptyInbox } from '../../components/chat/EmptyChatState';
import useChatPage from './useChatPage';
import ConversationList from './ConversationList';

const ChatPage = () => {
  const {
    user,
    activeChatId,
    allMessages,
    messagesLoading,
    typingUsers,
    activeChat,
    loading,
    conversations,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    totalUnread,
    tabFilteredList,
    handleSelectContact,
    handleStartTyping,
    handleStopTyping,
    handleSendMessage,
    handleDeleteConversation,
    handleDeleteMessage,
    handleLoadOlderMessages,
    handleBack,
    searchInputRef,
    formatChatTime,
    currentUser,
    isConnected,
  } = useChatPage();

  const isAuthorized =
    user.role === 'student' || user.role === 'club';
  if (!isAuthorized) {
    return (
      <MainLayout user={user} pageTitle="Messages" noPadding>
        <div className="flex flex-col items-center justify-center h-full text-center p-xl">
          <div className="w-20 h-20 bg-state-error/10 rounded-full flex items-center justify-center mb-lg">
            <ShieldAlert size={40} className="text-state-error" />
          </div>
          <h2 className="text-heading-small text-text-primary mb-sm">
            Access Restricted
          </h2>
          <p className="text-body-medium text-text-secondary max-w-md">
            The real-time chat feature is currently only available for students
            and club representatives.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user} pageTitle="Messages">
      <div className="flex h-[calc(100%+32px)] md:h-[calc(100%+48px)] -mx-3.5 -my-4 md:-m-lg overflow-hidden relative bg-dark-1/40 backdrop-blur-md">
        <ConversationList
          activeChatId={activeChatId}
          onSelectContact={handleSelectContact}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          conversations={conversations}
          loading={loading}
          totalUnread={totalUnread}
          tabFilteredList={tabFilteredList}
          searchInputRef={searchInputRef}
          formatChatTime={formatChatTime}
          isConnected={isConnected}
        />

        <div
          className={`flex-1 h-full overflow-hidden transition-all duration-300 ${
            activeChatId ? 'flex' : 'hidden md:flex'
          }`}
        >
          {activeChatId && activeChat ? (
            <ChatWindow
              activeChat={{
                id: activeChat.id,
                name: activeChat.otherUser?.name || 'User',
                avatar:
                  activeChat.otherUser?.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${activeChat.otherUser?.name || 'U'}`,
                isOnline: activeChat.otherUser?.isOnline || false,
                role: activeChat.otherUser?.role || '',
                lastActive: activeChat.otherUser?.lastActive,
              }}
              messages={allMessages[activeChatId] || []}
              messagesLoading={messagesLoading}
              currentUserId={currentUser?.id}
              onSendMessage={handleSendMessage}
              onDeleteConversation={() =>
                handleDeleteConversation(activeChatId)
              }
              onDeleteMessage={(msgId) =>
                handleDeleteMessage(activeChatId, msgId)
              }
              onBack={handleBack}
              onLoadOlder={() => handleLoadOlderMessages(activeChatId)}
              isTyping={!!typingUsers[activeChatId]}
              typingUserName={typingUsers[activeChatId]?.userName}
              onStartTyping={handleStartTyping}
              onStopTyping={handleStopTyping}
            />
          ) : (
            <div className="h-full bg-dark-1/20 backdrop-blur-md w-full">
              <EmptyInbox />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;

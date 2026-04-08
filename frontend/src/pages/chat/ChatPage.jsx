import React, { useState, useEffect, useMemo } from "react";
import MainLayout from "../../components/layout/MainLayout";
import {
  Search, CheckCheck, Check,
  ShieldAlert
} from "lucide-react";
import { mockConversations, mockMessages } from "../../data/mockChatData";
import { mockVerified } from "../../data/mockData";
import ChatWindow from "../../components/chat/ChatWindow";
import { EmptyInbox, EmptyChatList } from "../../components/chat/EmptyChatState";
import { useChatSocket } from "../../hooks/useChatSocket";

const TABS = ["All", "Unread"];

const ChatPage = () => {
  const [user] = useState({ name: "Alex Johnson", role: "student" });
  const [activeChatId, setActiveChatId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [allMessages, setAllMessages] = useState(mockMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const { sendMessage, lastMessage } = useChatSocket(user.name);
  const searchInputRef = React.useRef(null);

  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchVisible]);

  useEffect(() => {
    if (lastMessage) {
      const { convId, ...msg } = lastMessage;
      setAllMessages((prev) => ({
        ...prev,
        [convId]: [...(prev[convId] || []), msg],
      }));
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, lastMessage: msg.text, time: "Now" } : c
        )
      );
    }
  }, [lastMessage]);

  // ------- derived lists -------
  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unread || 0), 0),
    [conversations]
  );

  const displayList = useMemo(() => {
    const activeResults = conversations.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (searchQuery.trim().length > 0) {
      const globalResults = mockVerified
        .filter(
          (v) =>
            v.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !conversations.some((c) => c.name === v.name)
        )
        .map((v) => ({
          id: `new-${v.id}`,
          name: v.name,
          lastMessage: "Start a new conversation",
          time: "",
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${v.name}`,
          isOnline: true,
          role: v.type === "Club" ? "Club Admin" : "Batch Rep",
          isSuggested: true,
          unread: 0,
        }));
      return [...activeResults, ...globalResults];
    }

    return activeResults;
  }, [conversations, searchQuery]);

  const tabFilteredList = useMemo(() => {
    if (activeTab === "Unread") return displayList.filter((c) => c.unread > 0);
    if (activeTab === "Favorites") return displayList.filter((c) => c.isPinned);
    return displayList;
  }, [displayList, activeTab]);

  const activeChat = useMemo(() => {
    const listMatch = displayList.find((c) => c.id === activeChatId);
    if (listMatch) return listMatch;
    return conversations.find((c) => c.id === activeChatId);
  }, [activeChatId, displayList, conversations]);

  // Sync selection with tab filtering (WhatsApp behavior)
  useEffect(() => {
    if (activeChatId && activeTab !== "All") {
      const isVisible = tabFilteredList.some((c) => c.id === activeChatId);
      if (!isVisible) {
        setActiveChatId(null);
      }
    }
  }, [activeTab, tabFilteredList, activeChatId]);

  // ------- handlers -------
  const handleSendMessage = (text, attachments = []) => {
    if (!activeChatId) return;
    if (!text.trim() && attachments.length === 0) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      sender: "Me",
      text,
      attachments,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: "Today",
      isMe: true,
    };
    sendMessage({ convId: activeChatId, text, attachments, receiverName: activeChat.name });
    setAllMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage],
    }));
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, lastMessage: text ? text : "Sent an attachment", time: "Now", status: "delivered" }
          : c
      )
    );
  };

  const handleDeleteConversation = (id) => {
    setActiveChatId(null);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setAllMessages((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleDeleteMessage = (convId, msgId) => {
    setAllMessages((prev) => ({
      ...prev,
      [convId]: prev[convId].filter((m) => m.id !== msgId),
    }));
  };

  const handleSelectContact = (contact) => {
    if (contact.isSuggested) {
      const newId = `conv-${Date.now()}`;
      const newConv = {
        ...contact,
        id: newId,
        isSuggested: false,
        lastMessage: "New conversation started",
        unread: 0,
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveChatId(newId);
      setSearchQuery("");
    } else {
      // clear unread when opening
      setConversations((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, unread: 0 } : c))
      );
      setActiveChatId(contact.id);
    }
  };

  const handleBack = () => setActiveChatId(null);

  // ------- auth guard -------
  const isAuthorized = user.role === "student" || user.role === "club";
  if (!isAuthorized) {
    return (
      <MainLayout user={user} pageTitle="Messages" noPadding>
        <div className="flex flex-col items-center justify-center h-full text-center p-xl">
          <div className="w-20 h-20 bg-state-error/10 rounded-full flex items-center justify-center mb-lg">
            <ShieldAlert size={40} className="text-state-error" />
          </div>
          <h2 className="text-heading-small text-text-primary mb-sm">Access Restricted</h2>
          <p className="text-body-medium text-text-secondary max-w-md">
            The real-time chat feature is currently only available for students and club representatives.
          </p>
        </div>
      </MainLayout>
    );
  }

  const hasConversations = conversations.length > 0;

  return (
    <MainLayout user={user} pageTitle="Messages" noPadding>
      <div className="flex h-full overflow-hidden relative border border-white/10 rounded-2xl md:rounded-3xl bg-dark-1/40 backdrop-blur-md shadow-custom">

        {/* ── Left Panel ── */}
        <div className={`
          w-full md:w-[320px] flex-shrink-0 flex flex-col bg-dark-1/70 backdrop-blur-2xl border-r border-white/10 transition-all duration-300
          ${activeChatId ? "hidden md:flex" : "flex"}
        `}>

          {/* Header */}
          <div className="px-md pt-md pb-2 flex-shrink-0">
            <h2 className="text-[20px] font-bold text-text-primary tracking-tight">Chats</h2>
          </div>

          {/* Search */}
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

          {/* Filter Tabs */}
          <div className="px-md pb-2 flex items-center gap-sm flex-shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1 px-md py-1 rounded-full text-[12px] font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-primary-blue/20 text-primary-blue border border-primary-blue/30"
                    : "bg-white/5 text-text-tertiary hover:bg-white/10 hover:text-text-primary border border-transparent"
                }`}
              >
                {tab}
                {tab === "Unread" && totalUnread > 0 && (
                  <span className="bg-primary-blue text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                    {totalUnread}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Section label */}
          {searchQuery.trim().length === 0 && conversations.length > 0 && (
            <div className="px-md pb-1 flex-shrink-0">
              <span className="text-[11px] font-bold text-primary-blue/60 uppercase tracking-widest">
                {activeTab === "All" ? "Recent" : activeTab}
              </span>
            </div>
          )}

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {!hasConversations && !searchQuery ? (
              <EmptyChatList onStartChat={() => searchInputRef.current?.focus()} />
            ) : tabFilteredList.length === 0 && searchQuery ? (
              <div className="p-xl text-center flex flex-col items-center opacity-50 mt-lg">
                <Search size={28} className="mb-sm text-text-tertiary" />
                <p className="text-body-small italic text-text-tertiary">No results found</p>
              </div>
            ) : (
              tabFilteredList.map((chat) => {
                const isActive = activeChatId === chat.id;
                return (
                  <button
                    key={chat.id}
                    onClick={() => handleSelectContact(chat)}
                    className={`w-full flex items-center gap-3 px-md py-3 transition-all relative ${
                      isActive
                        ? "bg-primary-blue/15 border-r-2 border-primary-blue"
                        : "hover:bg-white/5 border-r-2 border-transparent"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {chat.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary-blue rounded-full border-2 border-dark-1" />
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[14px] font-semibold text-text-primary truncate">
                          {chat.name}
                        </span>
                        <span
                          className={`text-[11px] flex-shrink-0 ml-2 ${
                            chat.unread > 0
                              ? "text-primary-blue font-medium"
                              : "text-text-tertiary"
                          }`}
                        >
                          {chat.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-[12px] truncate pr-2 flex items-center gap-1 ${
                            chat.isSuggested ? "italic opacity-50 text-text-tertiary" : "text-text-tertiary"
                          }`}
                        >
                          {!chat.isSuggested && !chat.unread && chat.status === "delivered" && (
                            <CheckCheck size={12} className="flex-shrink-0 text-text-tertiary/60" />
                          )}
                          {!chat.isSuggested && !chat.unread && chat.status === "seen" && (
                            <CheckCheck size={12} className="flex-shrink-0 text-primary-blue" />
                          )}
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <span className="min-w-[20px] h-5 bg-primary-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 flex-shrink-0">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className={`
          flex-1 h-full overflow-hidden transition-all duration-300
          ${activeChatId ? "flex" : "hidden md:flex"}
        `}>
          {activeChatId ? (
            <ChatWindow
              activeChat={activeChat}
              messages={allMessages[activeChatId] || []}
              onSendMessage={handleSendMessage}
              onDeleteConversation={() => handleDeleteConversation(activeChatId)}
              onDeleteMessage={(msgId) => handleDeleteMessage(activeChatId, msgId)}
              onBack={handleBack}
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

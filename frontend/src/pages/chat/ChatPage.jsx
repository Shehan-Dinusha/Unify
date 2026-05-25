import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import {
  Search, CheckCheck, ShieldAlert, Loader2
} from "lucide-react";
import ChatWindow from "../../components/chat/ChatWindow";
import { EmptyInbox, EmptyChatList } from "../../components/chat/EmptyChatState";
import { useChatSocket } from "../../hooks/useChatSocket";
import { getCurrentUser } from "../../services/authService";
import * as chatService from "../../services/chatService";
import { useChat } from "../../context/ChatContext";

const TABS = ["All", "Unread"];

const ChatPage = () => {
  // Use real logged-in user
  const currentUser = getCurrentUser();
  const user = currentUser
    ? { name: currentUser.name, role: currentUser.role?.toLowerCase() }
    : { name: "User", role: "student" };

  const [activeChatId, setActiveChatId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [allMessages, setAllMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState({}); // { conversationId: { userId, userName } }

  const {
    socket, isConnected, joinRoom, leaveRoom, sendMessage,
    markRead, deleteMessage, startTyping, stopTyping
  } = useChatSocket();
  const { refreshUnreadCount } = useChat();

  const location = useLocation();
  const searchInputRef = useRef(null);
  const prevChatIdRef = useRef(null);
  const searchTimerRef = useRef(null);

  // Merge API data with existing conversations, preserving any added from navigation state
  const mergeConversations = (incoming) => {
    if (!incoming) return;
    setConversations((prev) => {
      const map = new Map();
      for (const c of prev) map.set(c.id, c);
      for (const c of incoming) map.set(c.id, c);
      return Array.from(map.values());
    });
  };

  // ── Auto-select conversation from navigation state ─────────────────────
  useEffect(() => {
    if (location.state?.activeConversationId) {
      setActiveChatId(location.state.activeConversationId);
      if (location.state?.newConversation) {
        setConversations((prev) => {
          const exists = prev.some(
            (c) => c.id === location.state.newConversation.id,
          );
          return exists ? prev : [location.state.newConversation, ...prev];
        });
      }
    }
  }, [location.state?.activeConversationId]);

  // ── Fetch conversations on mount ────────────────────────────────────────
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await chatService.getConversations();
        if (res.success) {
          mergeConversations(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Sync state when socket reconnects to catch any missed presence events
  useEffect(() => {
    if (isConnected && !loading) {
      chatService.getConversations().then((res) => {
        if (res.success) mergeConversations(res.data);
      });
    }
  }, [isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Socket event listeners ──────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    // New message received in a room
    const handleReceive = ({ message, conversationId }) => {
      setAllMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), message],
      }));

      // Update conversation list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                lastMessageText: message.text || "Sent an attachment",
                lastMessageAt: message.createdAt,
                status: "delivered",
                // Increment unread only if this chat isn't active
                unreadCount:
                  activeChatId === conversationId
                    ? 0
                    : (c.unreadCount || 0) + 1,
              }
            : c,
        ),
      );

      // If this is the active chat, mark as read immediately
      if (activeChatId === conversationId) {
        markRead(conversationId);
      }
    };

    // Conversation list update for chats not currently open
    const handleNewConvMessage = ({ conversationId, lastMessageText, lastMessageAt }) => {
      setConversations((prev) => {
        const exists = prev.some((c) => c.id === conversationId);
        if (exists) {
          return prev.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessageText,
                  lastMessageAt,
                  unreadCount:
                    activeChatId === conversationId
                      ? 0
                      : (c.unreadCount || 0) + 1,
                }
              : c,
          );
        }
        // New conversation — refetch list
        chatService.getConversations().then((res) => {
          if (res.success) mergeConversations(res.data);
        });
        return prev;
      });
    };

    // Read receipt
    const handleReadReceipt = ({ conversationId, readBy }) => {
      if (readBy !== currentUser?.id) {
        // The other user read our messages — update tick status
        setAllMessages((prev) => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).map((m) =>
            m.senderId === currentUser?.id ? { ...m, isRead: true } : m,
          ),
        }));
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId ? { ...c, status: "seen" } : c,
          ),
        );
      }
    };

    // Message deleted
    const handleMessageDeleted = ({ conversationId, messageId }) => {
      setAllMessages((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).filter(
          (m) => m.id !== messageId,
        ),
      }));
    };

    // Typing indicators
    const handleTyping = ({ conversationId, userId, userName }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [conversationId]: { userId, userName },
      }));
    };

    const handleStopTyping = ({ conversationId }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[conversationId];
        return next;
      });
    };

    // Presence broadcast
    const handlePresence = ({ userId, isOnline, lastActive }) => {
      setConversations((prev) =>
        prev.map((c) =>
          Number(c.otherUser?.id) === Number(userId)
            ? { ...c, otherUser: { ...c.otherUser, isOnline, lastActive } }
            : c
        )
      );
    };

    // Conversation updated (e.g. after message deletion)
    const handleConversationUpdated = ({ conversationId, lastMessageText, lastMessageAt }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, lastMessageText, lastMessageAt }
            : c
        )
      );
    };

    socket.on("chat:receive", handleReceive);
    socket.on("chat:new_conversation_message", handleNewConvMessage);
    socket.on("chat:read_receipt", handleReadReceipt);
    socket.on("chat:message_deleted", handleMessageDeleted);
    socket.on("chat:conversation_updated", handleConversationUpdated);
    socket.on("chat:user_typing", handleTyping);
    socket.on("chat:user_stop_typing", handleStopTyping);
    socket.on("user:presence", handlePresence);

    return () => {
      socket.off("chat:receive", handleReceive);
      socket.off("chat:new_conversation_message", handleNewConvMessage);
      socket.off("chat:read_receipt", handleReadReceipt);
      socket.off("chat:message_deleted", handleMessageDeleted);
      socket.off("chat:conversation_updated", handleConversationUpdated);
      socket.off("chat:user_typing", handleTyping);
      socket.off("chat:user_stop_typing", handleStopTyping);
      socket.off("user:presence", handlePresence);
    };
  }, [socket, activeChatId, currentUser?.id]);

  // ── Search users (debounced) ────────────────────────────────────────────
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await chatService.searchChatUsers(searchQuery);
        if (res.success) {
          // Filter out users who already have a conversation
          const existingUserIds = conversations.map((c) => c.otherUser?.id);
          const filtered = (res.data || []).filter(
            (u) => !existingUserIds.includes(u.id),
          );
          setSearchResults(filtered);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300);

    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery, conversations]);

  // ── Derived lists ────────────────────────────────────────────────────────
  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0),
    [conversations],
  );

  const displayList = useMemo(() => {
    // Filter existing conversations by search
    const filtered = conversations.filter((c) =>
      c.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // If searching, append suggested new contacts
    if (searchQuery.trim().length >= 2 && searchResults.length > 0) {
      const suggestions = searchResults.map((u) => ({
        id: `new-${u.id}`,
        targetUserId: u.id,
        otherUser: u,
        lastMessageText: "Start a new conversation",
        lastMessageAt: "",
        unreadCount: 0,
        isSuggested: true,
      }));
      return [...filtered, ...suggestions];
    }

    return filtered;
  }, [conversations, searchQuery, searchResults]);

  const tabFilteredList = useMemo(() => {
    if (activeTab === "Unread")
      return displayList.filter((c) => (c.unreadCount || 0) > 0);
    return displayList;
  }, [displayList, activeTab]);

  const activeChat = useMemo(() => {
    return displayList.find((c) => c.id === activeChatId) || null;
  }, [activeChatId, displayList]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSelectContact = useCallback(
    async (contact) => {
      if (contact.isSuggested) {
        // Create new conversation via API
        try {
          const res = await chatService.createConversation(contact.targetUserId);
          if (res.success) {
            const newConv = res.data;
            setConversations((prev) => [newConv, ...prev]);
            setActiveChatId(newConv.id);
            setSearchQuery("");
            setSearchResults([]);
          }
        } catch (err) {
          console.error("Create conversation error:", err);
        }
      } else {
        // Clear unread for this conversation
        setConversations((prev) =>
          prev.map((c) =>
            c.id === contact.id ? { ...c, unreadCount: 0 } : c,
          ),
        );
        setActiveChatId(contact.id);
      }
    },
    [],
  );

  const handleStartTyping = useCallback(() => {
    if (activeChatId) startTyping(activeChatId);
  }, [activeChatId, startTyping]);

  const handleStopTyping = useCallback(() => {
    if (activeChatId) stopTyping(activeChatId);
  }, [activeChatId, stopTyping]);

  // Join/leave rooms when active chat changes
  useEffect(() => {
    if (prevChatIdRef.current && prevChatIdRef.current !== activeChatId) {
      leaveRoom(prevChatIdRef.current);
    }

    if (activeChatId && typeof activeChatId === "number") {
      joinRoom(activeChatId);
      markRead(activeChatId);

      // Fetch messages if not already loaded
      if (!allMessages[activeChatId]) {
        setMessagesLoading(true);
        chatService
          .getMessages(activeChatId)
          .then((res) => {
            if (res.success) {
              setAllMessages((prev) => ({
                ...prev,
                [activeChatId]: res.data.messages || [],
              }));
            }
          })
          .catch((err) => console.error("Fetch messages error:", err))
          .finally(() => setMessagesLoading(false));
      }
    }

    prevChatIdRef.current = activeChatId;
  }, [activeChatId, joinRoom, leaveRoom, markRead]);

  // ── Re-join room when socket connects after activeChatId was already set ──
  useEffect(() => {
    if (isConnected && activeChatId && typeof activeChatId === "number") {
      joinRoom(activeChatId);
    }
  }, [isConnected, activeChatId, joinRoom]);

  const handleSendMessage = useCallback(
    (text, attachments = []) => {
      if (!activeChatId) return;
      if (!text.trim() && attachments.length === 0) return;

      sendMessage({
        conversationId: activeChatId,
        text,
        attachments:
          attachments.length > 0
            ? attachments.map((a) => ({
                key: a.key,
                name: a.name,
                type: a.type,
                url: a.url,
                isImage: a.isImage,
              }))
            : undefined,
      });
    },
    [activeChatId, sendMessage],
  );

  const handleDeleteConversation = useCallback(
    async (id) => {
      try {
        await chatService.deleteConversation(id);
        setActiveChatId(null);
        setConversations((prev) => prev.filter((c) => c.id !== id));
        setAllMessages((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      } catch (err) {
        console.error("Delete conversation error:", err);
      }
    },
    [],
  );

  const handleDeleteMessage = useCallback(
    (convId, msgId) => {
      deleteMessage(convId, msgId);
    },
    [deleteMessage],
  );

  const handleLoadOlderMessages = useCallback(
    async (conversationId) => {
      const msgs = allMessages[conversationId];
      if (!msgs || msgs.length === 0) return;

      const oldestId = msgs[0].id;
      try {
        const res = await chatService.getMessages(conversationId, oldestId);
        if (res.success && res.data.messages?.length > 0) {
          setAllMessages((prev) => ({
            ...prev,
            [conversationId]: [
              ...res.data.messages,
              ...(prev[conversationId] || []),
            ],
          }));
          return res.data.hasMore;
        }
        return false;
      } catch (err) {
        console.error("Load older messages error:", err);
        return false;
      }
    },
    [allMessages],
  );

  const handleBack = () => setActiveChatId(null);

  // ── Auth guard ──────────────────────────────────────────────────────────
  const isAuthorized =
    user.role === "student" || user.role === "club";
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

  const hasConversations = conversations.length > 0;

  // ── Format time for conversation list ───────────────────────────────────
  const formatChatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <MainLayout user={user} pageTitle="Messages">
      <div className="flex h-[calc(100%+32px)] md:h-[calc(100%+48px)] -mx-3.5 -my-4 md:-m-lg overflow-hidden relative bg-dark-1/40 backdrop-blur-md">
        {/* ── Left Panel ── */}
        <div
          className={`
          w-full md:w-[320px] flex-shrink-0 flex flex-col bg-dark-1/70 backdrop-blur-2xl border-r border-white/10 transition-all duration-300
          ${activeChatId ? "hidden md:flex" : "flex"}
        `}
        >
          {/* Sidebar Header - Compact */}
          <div className="px-md pt-sm pb-1 flex-shrink-0 flex items-center justify-between">
            {/* Connection Indicator moved here, heading removed */}
            <div className="flex-1" />
            {isConnected && (
              <div className="w-2 h-2 rounded-full bg-state-success shadow-[0_0_8px_rgba(74,222,128,0.5)]" title="Connected" />
            )}
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
              tabFilteredList.map((chat) => {
                const isActive = activeChatId === chat.id;
                const otherUser = chat.otherUser || {};
                const avatarUrl =
                  otherUser.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${otherUser.name || "U"}`;

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
                        src={avatarUrl}
                        alt={otherUser.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {otherUser.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary-blue rounded-full border-2 border-dark-1" />
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[14px] font-semibold text-text-primary truncate">
                          {otherUser.name}
                        </span>
                        <span
                          className={`text-[11px] flex-shrink-0 ml-2 ${
                            (chat.unreadCount || 0) > 0
                              ? "text-primary-blue font-medium"
                              : "text-text-tertiary"
                          }`}
                        >
                          {formatChatTime(chat.lastMessageAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-[12px] truncate pr-2 flex items-center gap-1 ${
                            chat.isSuggested
                              ? "italic opacity-50 text-text-tertiary"
                              : "text-text-tertiary"
                          }`}
                        >
                          {!chat.isSuggested &&
                            !(chat.unreadCount > 0) &&
                            chat.status === "delivered" && (
                              <CheckCheck
                                size={12}
                                className="flex-shrink-0 text-text-tertiary/60"
                              />
                            )}
                          {!chat.isSuggested &&
                            !(chat.unreadCount > 0) &&
                            chat.status === "seen" && (
                              <CheckCheck
                                size={12}
                                className="flex-shrink-0 text-primary-blue"
                              />
                            )}
                          {chat.lastMessageText || "No messages yet"}
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
              })
            )}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div
          className={`
          flex-1 h-full overflow-hidden transition-all duration-300
          ${activeChatId ? "flex" : "hidden md:flex"}
        `}
        >
          {activeChatId && activeChat ? (
            <ChatWindow
              activeChat={{
                id: activeChat.id,
                name: activeChat.otherUser?.name || "User",
                avatar:
                  activeChat.otherUser?.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${activeChat.otherUser?.name || "U"}`,
                isOnline: activeChat.otherUser?.isOnline || false,
                role: activeChat.otherUser?.role || "",
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

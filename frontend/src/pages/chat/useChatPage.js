import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useChatSocket } from '../../hooks/useChatSocket';
import { getCurrentUser } from '../../services/authService';
import * as chatService from '../../services/chatService';
import { useChat } from '../../context/ChatContext';

const useChatPage = () => {
  const currentUser = getCurrentUser();
  const user = currentUser
    ? { name: currentUser.name, role: currentUser.role?.toLowerCase() }
    : { name: 'User', role: 'student' };

  const [activeChatId, setActiveChatId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [allMessages, setAllMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});

  const {
    socket, isConnected, joinRoom, leaveRoom, sendMessage,
    markRead, deleteMessage, startTyping, stopTyping,
  } = useChatSocket();
  const { refreshUnreadCount } = useChat();

  const location = useLocation();
  const searchInputRef = useRef(null);
  const prevChatIdRef = useRef(null);
  const searchTimerRef = useRef(null);

  const mergeConversations = (incoming) => {
    if (!incoming) return;
    setConversations((prev) => {
      const map = new Map();
      for (const c of prev) map.set(c.id, c);
      for (const c of incoming) map.set(c.id, c);
      return Array.from(map.values());
    });
  };

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

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await chatService.getConversations();
        if (res.success) {
          mergeConversations(res.data);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (isConnected && !loading) {
      chatService.getConversations().then((res) => {
        if (res.success) mergeConversations(res.data);
      });
    }
  }, [isConnected]);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = ({ message, conversationId }) => {
      setAllMessages((prev) => {
        const existing = prev[conversationId] || [];
        const optimisticIdx = existing.findIndex(
          (m) =>
            typeof m.id === 'string' &&
            m.id.startsWith('temp-') &&
            m.senderId === message.senderId &&
            (m.text || null) === (message.text || null),
        );
        if (optimisticIdx !== -1) {
          const updated = [...existing];
          updated[optimisticIdx] = message;
          return { ...prev, [conversationId]: updated };
        }
        return {
          ...prev,
          [conversationId]: [...existing, message],
        };
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                lastMessageText: message.text || 'Sent an attachment',
                lastMessageAt: message.createdAt,
                status: 'delivered',
                unreadCount:
                  activeChatId === conversationId
                    ? 0
                    : (c.unreadCount || 0) + 1,
              }
            : c,
        ),
      );

      if (activeChatId === conversationId) {
        markRead(conversationId);
      }
    };

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
        chatService.getConversations().then((res) => {
          if (res.success) mergeConversations(res.data);
        });
        return prev;
      });
    };

    const handleReadReceipt = ({ conversationId, readBy }) => {
      if (readBy !== currentUser?.id) {
        setAllMessages((prev) => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).map((m) =>
            m.senderId === currentUser?.id ? { ...m, isRead: true } : m,
          ),
        }));
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId ? { ...c, status: 'seen' } : c,
          ),
        );
      }
    };

    const handleMessageDeleted = ({ conversationId, messageId }) => {
      setAllMessages((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).filter(
          (m) => m.id !== messageId,
        ),
      }));
    };

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

    const handlePresence = ({ userId, isOnline, lastActive }) => {
      setConversations((prev) =>
        prev.map((c) =>
          Number(c.otherUser?.id) === Number(userId)
            ? { ...c, otherUser: { ...c.otherUser, isOnline, lastActive } }
            : c,
        ),
      );
    };

    const handleConversationUpdated = ({ conversationId, lastMessageText, lastMessageAt }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, lastMessageText, lastMessageAt }
            : c,
        ),
      );
    };

    socket.on('chat:receive', handleReceive);
    socket.on('chat:new_conversation_message', handleNewConvMessage);
    socket.on('chat:read_receipt', handleReadReceipt);
    socket.on('chat:message_deleted', handleMessageDeleted);
    socket.on('chat:conversation_updated', handleConversationUpdated);
    socket.on('chat:user_typing', handleTyping);
    socket.on('chat:user_stop_typing', handleStopTyping);
    socket.on('user:presence', handlePresence);

    return () => {
      socket.off('chat:receive', handleReceive);
      socket.off('chat:new_conversation_message', handleNewConvMessage);
      socket.off('chat:read_receipt', handleReadReceipt);
      socket.off('chat:message_deleted', handleMessageDeleted);
      socket.off('chat:conversation_updated', handleConversationUpdated);
      socket.off('chat:user_typing', handleTyping);
      socket.off('chat:user_stop_typing', handleStopTyping);
      socket.off('user:presence', handlePresence);
    };
  }, [socket, activeChatId, currentUser?.id]);

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
          const existingUserIds = conversations.map((c) => c.otherUser?.id);
          const filtered = (res.data || []).filter(
            (u) => !existingUserIds.includes(u.id),
          );
          setSearchResults(filtered);
        }
      } catch (err) {
      }
    }, 300);

    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery, conversations]);

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0),
    [conversations],
  );

  const displayList = useMemo(() => {
    const filtered = conversations.filter((c) =>
      c.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (searchQuery.trim().length >= 2 && searchResults.length > 0) {
      const suggestions = searchResults.map((u) => ({
        id: `new-${u.id}`,
        targetUserId: u.id,
        otherUser: u,
        lastMessageText: 'Start a new conversation',
        lastMessageAt: '',
        unreadCount: 0,
        isSuggested: true,
      }));
      return [...filtered, ...suggestions];
    }

    return filtered;
  }, [conversations, searchQuery, searchResults]);

  const tabFilteredList = useMemo(() => {
    if (activeTab === 'Unread')
      return displayList.filter((c) => (c.unreadCount || 0) > 0);
    return displayList;
  }, [displayList, activeTab]);

  const activeChat = useMemo(() => {
    return displayList.find((c) => c.id === activeChatId) || null;
  }, [activeChatId, displayList]);

  const handleSelectContact = useCallback(
    async (contact) => {
      if (contact.isSuggested) {
        try {
          const res = await chatService.createConversation(contact.targetUserId);
          if (res.success) {
            const newConv = res.data;
            setConversations((prev) => [newConv, ...prev]);
            setActiveChatId(newConv.id);
            setSearchQuery('');
            setSearchResults([]);
          }
        } catch (err) {
        }
      } else {
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

  useEffect(() => {
    if (prevChatIdRef.current && prevChatIdRef.current !== activeChatId) {
      leaveRoom(prevChatIdRef.current);
    }

    if (activeChatId && typeof activeChatId === 'number') {
      joinRoom(activeChatId);
      markRead(activeChatId);

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
          .catch((err) => undefined)
          .finally(() => setMessagesLoading(false));
      }
    }

    prevChatIdRef.current = activeChatId;
  }, [activeChatId, joinRoom, leaveRoom, markRead]);

  useEffect(() => {
    if (isConnected && activeChatId && typeof activeChatId === 'number') {
      joinRoom(activeChatId);
    }
  }, [isConnected, activeChatId, joinRoom]);

  const handleSendMessage = useCallback(
    (text, attachments = []) => {
      if (!activeChatId) return;
      if (!text.trim() && attachments.length === 0) return;

      const optimisticMsg = {
        id: `temp-${Date.now()}`,
        conversationId: activeChatId,
        senderId: currentUser?.id,
        senderName: currentUser?.name || 'You',
        text: text.trim() || null,
        attachments: attachments.length > 0
          ? attachments.map((a) => ({
              key: a.key, name: a.name, type: a.type, url: a.url, isImage: a.isImage,
            }))
          : null,
        isRead: true,
        createdAt: new Date().toISOString(),
      };

      setAllMessages((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), optimisticMsg],
      }));

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
    [activeChatId, sendMessage, currentUser],
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
        return false;
      }
    },
    [allMessages],
  );

  const handleBack = () => setActiveChatId(null);

  const formatChatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return {
    currentUser,
    user,
    activeChatId,
    setActiveChatId,
    conversations,
    setConversations,
    allMessages,
    setAllMessages,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    activeTab,
    setActiveTab,
    loading,
    messagesLoading,
    typingUsers,
    isConnected,
    totalUnread,
    displayList,
    tabFilteredList,
    activeChat,
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
  };
};

export default useChatPage;

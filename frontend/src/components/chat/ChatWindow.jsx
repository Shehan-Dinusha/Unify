import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import {
  Search, Trash2, X, CheckCheck, Smile, Paperclip, Send, FileText, ChevronLeft, Loader2, Download, ChevronUp, ChevronDown
} from "lucide-react";
import { EmptyInbox } from "./EmptyChatState";
import * as chatService from "../../services/chatService";
import EmojiPicker from 'emoji-picker-react';

// ─── ChatInput (inline for tight integration) ───────────────────────────────
const ChatInput = ({ onSendMessage, onStartTyping, onStopTyping }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState([]); // { id, name, type, url (blob), isImage, file (raw File) }
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef(null);
  const typingTimerRef = useRef(null);

  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Cleanup typing timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  const canSend = message.trim() || attachments.length > 0;

  const handleSend = async () => {
    if (!canSend || uploading) return;

    // Stop typing when sending
    onStopTyping?.();
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    let uploadedAttachments = undefined;

    // If there are file attachments, upload them to S3 first
    if (attachments.length > 0) {
      const rawFiles = attachments.map((a) => a.file).filter(Boolean);
      if (rawFiles.length > 0) {
        try {
          setUploading(true);
          const res = await chatService.uploadChatAttachments(rawFiles);
          if (res.success && res.data) {
            uploadedAttachments = res.data; // Array of { key, name, type, size, isImage }
          }
        } catch (err) {
          console.error("File upload failed:", err);
          setUploading(false);
          return;
        } finally {
          setUploading(false);
        }
      }
    }

    onSendMessage(message.trim(), uploadedAttachments || []);
    setMessage("");
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }

    // Emit typing events (debounced)
    onStartTyping?.();
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      onStopTyping?.();
    }, 1500);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    textareaRef.current?.focus();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - attachments.length); // Max 5
    const newAttachments = files.map((f) => {
      const isImage = f.type.startsWith("image/");
      return {
        id: `${Date.now()}-${Math.random()}`,
        name: f.name,
        type: f.type,
        url: URL.createObjectURL(f),
        isImage,
        file: f, // Keep raw File for S3 upload
      };
    });
    setAttachments((prev) => [...prev, ...newAttachments].slice(0, 5));
    e.target.value = "";
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex-shrink-0 bg-dark-1/80 backdrop-blur-xl border-t border-white/5 relative">

      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="flex gap-1.5 md:gap-2 px-2 md:px-3 pt-2 pb-1 flex-wrap bg-dark-2/40">
          {attachments.map((a) => (
            <div key={a.id} className="relative flex items-center gap-1.5 bg-dark-3 border border-white/10 rounded-xl px-2 py-1.5 max-w-[140px] md:max-w-[160px] shadow-lg animate-in zoom-in-95 duration-200">
              {a.isImage ? (
                <img src={a.url} className="w-7 h-7 md:w-8 md:h-8 rounded-lg object-cover flex-shrink-0" alt={a.name} />
              ) : (
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary-blue/20 flex items-center justify-center flex-shrink-0">
                  <FileText size={15} className="text-primary-blue" />
                </div>
              )}
              <span className="text-[10px] md:text-[11px] text-text-secondary truncate font-medium">{a.name}</span>
              <button onClick={() => removeAttachment(a.id)} className="ml-1 flex-shrink-0 text-text-tertiary hover:text-state-error transition-colors p-1 hover:bg-white/5 rounded-full">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-full left-3 mb-2 shadow-2xl z-50 animate-in slide-in-from-bottom-2 duration-200"
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" lazyLoadEmojis={true} />
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2">
        {/* Attachment */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-white/8 transition-all flex-shrink-0 mb-0.5"
        >
          <Paperclip size={18} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.pptx"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Emoji Toggle */}
        <button
          onClick={() => setShowEmojiPicker((v) => !v)}
          className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 mb-0.5 ${
            showEmojiPicker
              ? "bg-primary-blue/20 text-primary-blue"
              : "text-text-tertiary hover:text-text-primary hover:bg-white/8"
          }`}
        >
          <Smile size={18} />
        </button>

        {/* Text Input */}
        <div className="flex-1 bg-white/5 border border-white/8 rounded-2xl px-2.5 md:px-3 py-2 min-h-[38px] max-h-[120px]">
          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="w-full bg-transparent text-[13px] md:text-[14px] text-text-primary placeholder:text-text-tertiary resize-none focus:outline-none leading-5"
            style={{ height: "22px" }}
          />
        </div>

        {/* Send — only visible when there's content */}
        {canSend && (
          <button
            onClick={handleSend}
            disabled={uploading}
            className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary-blue hover:bg-primary-blue/90 text-white flex items-center justify-center shadow-lg active:scale-90 transition-all flex-shrink-0 mb-0.5 animate-in zoom-in-75 duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} className="ml-0.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};


// ─── Typing Bubble ───────────────────────────────────────────────────────────
const TypingBubble = ({ name }) => (
  <div className="flex items-end gap-2 mt-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="w-7 h-7" />
    <div className="bg-dark-2 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 bg-text-tertiary rounded-full"
          style={{
            animation: "typingBounce 1.4s infinite ease-in-out",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </div>
  </div>
);

// Keyframes for typing animation (injected once)
if (typeof document !== "undefined" && !document.getElementById("typing-keyframes")) {
  const style = document.createElement("style");
  style.id = "typing-keyframes";
  style.textContent = `
    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-4px); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

// ─── Helper: format "last seen" ──────────────────────────────────────────────
const formatLastSeen = (date) => {
  if (!date) return "Offline";
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Last seen just now";
  if (diffMin < 60) return `Last seen ${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Last seen ${diffHours}h ago`;
  return `Last seen ${then.toLocaleDateString([], { month: "short", day: "numeric" })}`;
};

// ─── ChatWindow ──────────────────────────────────────────────────────────────
const renderHighlightedText = (text, query) => {
  if (!query || !text) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="bg-primary-blue text-white rounded-sm px-0.5 font-medium">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

const ChatWindow = ({
  activeChat,
  messages,
  messagesLoading,
  currentUserId,
  onSendMessage,
  onDeleteConversation,
  onDeleteMessage,
  onBack,
  onLoadOlder,
  isTyping,
  typingUserName,
  onStartTyping,
  onStopTyping,
}) => {
  const scrollRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [searchMatchIndex, setSearchMatchIndex] = useState(-1);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: null, id: null });
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Determine if a message is "mine" based on currentUserId
  const enrichedMessages = useMemo(() => {
    return (messages || []).map((msg) => ({
      ...msg,
      isMe: msg.senderId === currentUserId,
      time:
        msg.time ||
        (msg.createdAt
          ? new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : ""),
    }));
  }, [messages, currentUserId]);

  const matchedMessageIds = useMemo(() => {
    if (!chatSearchQuery) return [];
    const query = chatSearchQuery.toLowerCase();
    return enrichedMessages
      .filter((msg) => (msg.text || "").toLowerCase().includes(query))
      .map((msg) => msg.id);
  }, [enrichedMessages, chatSearchQuery]);

  useEffect(() => {
    if (chatSearchQuery && matchedMessageIds.length > 0) {
      setSearchMatchIndex(matchedMessageIds.length - 1);
    } else {
      setSearchMatchIndex(-1);
    }
  }, [chatSearchQuery, matchedMessageIds.length]);

  useEffect(() => {
    if (searchMatchIndex >= 0 && searchMatchIndex < matchedMessageIds.length) {
      const msgId = matchedMessageIds[searchMatchIndex];
      const el = document.getElementById(`msg-${msgId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [searchMatchIndex, matchedMessageIds]);

  const handleNextMatch = () => {
    setSearchMatchIndex((prev) => (prev < matchedMessageIds.length - 1 ? prev + 1 : 0));
  };

  const handlePrevMatch = () => {
    setSearchMatchIndex((prev) => (prev > 0 ? prev - 1 : matchedMessageIds.length - 1));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) handlePrevMatch();
      else handleNextMatch();
    }
  };

  // Annotate each message with grouping info
  const groupedMessages = useMemo(() => {
    return enrichedMessages.map((msg, idx) => {
      const prev = enrichedMessages[idx - 1];
      const next = enrichedMessages[idx + 1];
      const isFirstInGroup = !prev || prev.senderId !== msg.senderId;
      const isLastInGroup = !next || next.senderId !== msg.senderId;
      return { ...msg, isFirstInGroup, isLastInGroup };
    });
  }, [enrichedMessages]);

  // Auto-scroll to bottom when new messages arrive (only if not searching)
  useEffect(() => {
    if (scrollRef.current && !isSearchOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSearchOpen]);

  // Load older messages on scroll to top
  const handleScroll = useCallback(async () => {
    if (!scrollRef.current || loadingOlder || !hasMore || !onLoadOlder) return;
    if (scrollRef.current.scrollTop < 100) {
      const prevHeight = scrollRef.current.scrollHeight;
      setLoadingOlder(true);
      const moreAvailable = await onLoadOlder();
      setHasMore(!!moreAvailable);
      setLoadingOlder(false);
      // Preserve scroll position
      if (scrollRef.current) {
        const newHeight = scrollRef.current.scrollHeight;
        scrollRef.current.scrollTop = newHeight - prevHeight;
      }
    }
  }, [loadingOlder, hasMore, onLoadOlder]);

  const handleConfirmDelete = () => {
    if (deleteConfirm.type === "message") onDeleteMessage(deleteConfirm.id);
    else if (deleteConfirm.type === "conversation") onDeleteConversation();
    setDeleteConfirm({ isOpen: false, type: null, id: null });
  };

  if (!activeChat) {
    return (
      <div className="flex-1 h-full overflow-hidden">
        <EmptyInbox />
      </div>
    );
  }

  // Format date for grouping
  const getDateLabel = (dateStr) => {
    if (!dateStr) return "Today";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">

      {/* ── Header ── */}
      <div className="px-4 py-2.5 bg-dark-1/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          {/* Mobile Back Button */}
          <button
            onClick={onBack}
            className="md:hidden p-1 -ml-1 text-text-tertiary hover:text-text-primary hover:bg-white/5 rounded-lg transition-all"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Avatar */}
          <div className="relative">
            <img
              src={activeChat.avatar}
              alt={activeChat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {activeChat.isOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-state-success rounded-full border-2 border-dark-1" />
            )}
          </div>
          {/* Name + status */}
          <div>
            <h3 className="text-[15px] font-semibold text-text-primary leading-tight">
              {activeChat.name}
            </h3>
            <p className="text-[11px] font-medium leading-none mt-0.5">
              {isTyping ? (
                <span className="text-primary-blue animate-pulse">typing...</span>
              ) : activeChat.isOnline ? (
                <span className="text-state-success">Active now</span>
              ) : (
                <span className="text-text-tertiary">{formatLastSeen(activeChat.lastActive)}</span>
              )}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">

          {isSearchOpen ? (
            <div className="flex items-center bg-white/8 border border-white/10 rounded-xl px-3 py-1.5 gap-2 animate-in slide-in-from-right-3 duration-200">
              <input
                autoFocus
                type="text"
                value={chatSearchQuery}
                onChange={(e) => setChatSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Find in chat..."
                className="bg-transparent text-[13px] text-text-primary outline-none w-32"
              />
              {chatSearchQuery && (
                <span className="text-[11px] text-text-tertiary tabular-nums whitespace-nowrap">
                  {matchedMessageIds.length > 0 ? `${searchMatchIndex + 1}/${matchedMessageIds.length}` : '0/0'}
                </span>
              )}
              <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                <button 
                  onClick={handlePrevMatch} 
                  disabled={matchedMessageIds.length === 0} 
                  className="text-text-tertiary hover:text-text-primary disabled:opacity-30 transition-colors"
                >
                  <ChevronUp size={16} />
                </button>
                <button 
                  onClick={handleNextMatch} 
                  disabled={matchedMessageIds.length === 0} 
                  className="text-text-tertiary hover:text-text-primary disabled:opacity-30 transition-colors"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
              <button
                onClick={() => { setIsSearchOpen(false); setChatSearchQuery(""); }}
                className="text-text-tertiary hover:text-text-primary ml-1 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-white/8 transition-all"
            >
              <Search size={19} strokeWidth={1.5} />
            </button>
          )}

          <button
            onClick={() => setDeleteConfirm({ isOpen: true, type: "conversation", id: null })}
            className="w-9 h-9 rounded-full flex items-center justify-center text-text-tertiary hover:text-state-error hover:bg-state-error/10 transition-all"
          >
            <Trash2 size={19} strokeWidth={1.5} />
          </button>


        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-0.5 scrollbar-hide"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(43,140,238,0.04) 0%, transparent 70%)",
        }}
      >
        {/* Loading older */}
        {loadingOlder && (
          <div className="flex justify-center py-2">
            <Loader2 className="w-5 h-5 text-primary-blue animate-spin" />
          </div>
        )}

        {/* Loading state for initial fetch */}
        {messagesLoading ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-3">
            <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
            <p className="text-body-extra-small text-text-tertiary">Loading messages...</p>
          </div>
        ) : (
          <>
            {/* Date pill */}
            {groupedMessages.length > 0 && (
              <div className="flex justify-center my-3">
                <span className="px-4 py-1 bg-dark-2/70 backdrop-blur-md rounded-full text-[11px] text-text-tertiary font-medium border border-white/5 uppercase tracking-widest">
                  {getDateLabel(groupedMessages[0]?.createdAt)}
                </span>
              </div>
            )}

            {groupedMessages.map((msg) => {
              const isMe = msg.isMe;
              const isActiveMatch = chatSearchQuery && matchedMessageIds[searchMatchIndex] === msg.id;

              // Bubble shape: tail on last bubble of a group
              const myBubbleClass = `bg-primary-blue text-white ${
                msg.isLastInGroup ? "rounded-bl-2xl rounded-br-sm rounded-tl-2xl rounded-tr-2xl" : "rounded-2xl"
              } ${msg.isFirstInGroup && !msg.isLastInGroup ? "rounded-tr-2xl" : ""} ${isActiveMatch ? "ring-2 ring-white/50 ring-offset-1 ring-offset-dark-1" : ""}`;

              const theirBubbleClass = `bg-dark-2 text-text-soft border border-white/5 ${
                msg.isLastInGroup ? "rounded-br-2xl rounded-bl-sm rounded-tr-2xl rounded-tl-2xl" : "rounded-2xl"
              } ${msg.isFirstInGroup && !msg.isLastInGroup ? "rounded-tl-2xl" : ""} ${isActiveMatch ? "ring-2 ring-primary-blue/50 ring-offset-1 ring-offset-dark-1" : ""}`;

              return (
                <div
                  key={msg.id}
                  id={`msg-${msg.id}`}
                  className={`flex items-end gap-2 group ${isMe ? "flex-row-reverse" : "flex-row"} ${
                    msg.isFirstInGroup ? "mt-3" : "mt-0.5"
                  } ${isActiveMatch ? "scroll-mt-24 transition-all duration-300" : ""}`}
                >
                  {/* Avatar placeholder for non-me (maintains alignment) */}
                  {!isMe && (
                    <div className="w-7 flex-shrink-0 flex items-end self-end">
                      {msg.isLastInGroup ? (
                        <img
                          src={activeChat.avatar}
                          className="w-7 h-7 rounded-full object-cover"
                          alt="Avatar"
                        />
                      ) : (
                        <div className="w-7 h-7" />
                      )}
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
                    {/* Sender name label (first in group, others only) */}
                    {!isMe && msg.isFirstInGroup && (
                      <span className="text-[11px] font-semibold text-primary-blue mb-1 ml-1">
                        {msg.senderName || activeChat.name}
                      </span>
                    )}

                    <div className="relative flex items-end gap-1 group/msg">
                      {/* Delete for my messages */}
                      {isMe && (
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, type: "message", id: msg.id })}
                          className="opacity-0 group-hover/msg:opacity-100 p-1 text-text-tertiary hover:text-state-error transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}

                      {/* Bubble */}
                      <div className={`px-3 py-2 text-[14px] leading-[1.45] shadow-sm ${isMe ? myBubbleClass : theirBubbleClass}`}>
                        {/* Attachments rendering */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="flex flex-col gap-2 mb-2">
                            {msg.attachments.map((att, attIdx) => (
                              <div key={att.id || attIdx}>
                                {att.isImage ? (
                                  <div className="relative group overflow-hidden rounded-xl border border-white/10">
                                    <img
                                      src={att.url}
                                      alt={att.name}
                                      className="max-w-full h-auto object-cover max-h-[300px]"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                       <a
                                          href={att.url}
                                          download={att.name}
                                          className="p-2 bg-dark-1/80 rounded-full text-white hover:scale-110 transition-transform"
                                          onClick={(e) => e.stopPropagation()}
                                       >
                                          <FileText size={20} />
                                       </a>
                                    </div>
                                  </div>
                                ) : (
                                  <a
                                    href={att.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 bg-black/20 hover:bg-black/30 rounded-xl border border-white/5 transition-all group/att"
                                  >
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                      <FileText size={20} className="text-white/80" />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-2">
                                      <p className="text-[13px] font-semibold text-white truncate">{att.name}</p>
                                      <p className="text-[10px] text-white/50">Document</p>
                                    </div>
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {msg.text && <span>{isSearchOpen ? renderHighlightedText(msg.text, chatSearchQuery) : msg.text}</span>}

                        {/* Timestamp + tick inside bubble */}
                        <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-end"}`}>
                          <span className={`text-[10px] leading-none ${isMe ? "text-white/60" : "text-text-tertiary/70"}`}>
                            {msg.time}
                          </span>
                          {isMe && (
                            <CheckCheck
                              size={12}
                              className={msg.isRead ? "text-primary-blue" : "text-white/60"}
                            />
                          )}
                        </div>
                      </div>

                      {/* Delete for others' messages */}
                      {!isMe && (
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, type: "message", id: msg.id })}
                          className="opacity-0 group-hover/msg:opacity-100 p-1 text-text-tertiary hover:text-state-error transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing bubble */}
            {isTyping && <TypingBubble name={typingUserName} />}
          </>
        )}
      </div>

      {/* ── Input ── */}
      <ChatInput
        onSendMessage={onSendMessage}
        onStartTyping={onStartTyping}
        onStopTyping={onStopTyping}
      />

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirm.isOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-lg animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-dark-1/60 backdrop-blur-md cursor-default"
            onClick={() => setDeleteConfirm({ isOpen: false, type: null, id: null })}
          />
          <div className="relative bg-dark-2 border border-white/10 rounded-[28px] p-xl shadow-2xl max-w-[320px] w-full text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-state-error/10 rounded-full flex items-center justify-center mb-xl mx-auto">
              <Trash2 className="text-state-error" size={24} />
            </div>
            <h4 className="text-body-large-bold text-text-primary mb-sm">
              Delete {deleteConfirm.type === "message" ? "Message?" : "Conversation?"}
            </h4>
            <p className="text-body-extra-small text-text-tertiary mb-2xl leading-relaxed">
              This action cannot be undone.
            </p>
            <div className="flex gap-md">
              <button
                onClick={() => setDeleteConfirm({ isOpen: false, type: null, id: null })}
                className="flex-1 py-md bg-white/5 hover:bg-white/10 text-text-primary text-body-small-bold rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-md bg-state-error hover:bg-red-500 text-white text-body-small-bold rounded-2xl transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;

import React, { useState } from "react";
import { Plus, Send, Smile } from "lucide-react";

const ChatInput = ({ onSendMessage, receiverName }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-md bg-dark-1/80 backdrop-blur-xl border-t border-white/5 flex items-center gap-md">
      <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
        <Plus size={20} className="text-text-secondary" />
      </button>

      <div className="flex-1 relative group">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Type a message to ${receiverName}...`}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-md px-lg text-body-medium text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary-blue/50 focus:ring-4 focus:ring-primary-blue/5 transition-all pr-12"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-sm text-text-tertiary hover:text-text-primary transition-colors">
          <Smile size={20} />
        </button>
      </div>

      <button
        onClick={handleSend}
        disabled={!message.trim()}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          message.trim()
            ? "bg-primary-blue text-text-primary shadow-custom scale-100 hover:scale-105 active:scale-95"
            : "bg-white/5 text-text-tertiary scale-95 opacity-50 cursor-not-allowed"
        }`}
      >
        <Send size={18} />
      </button>
    </div>
  );
};

export default ChatInput;

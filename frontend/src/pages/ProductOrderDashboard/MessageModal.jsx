import React from 'react';
import { Send } from 'lucide-react';

const MessageModal = ({ open, onClose, buyerCount, messageText, setMessageText, onSend }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0B1220]/80 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-[480px] bg-[#0F1C2E] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-bold">Send Message</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 text-text-secondary hover:text-white transition-colors">✕</button>
        </div>
        <div className="p-6">
          <div className="bg-primary-blue/10 border border-primary-blue/20 rounded-xl p-3 mb-5 flex gap-3 text-sm text-primary-blue">
            <div className="mt-0.5"><Send className="w-4 h-4" /></div>
            <p className="leading-snug">Your message will be broadcast to <strong className="font-extrabold">{buyerCount}</strong> {buyerCount === 1 ? 'buyer' : 'buyers'} currently matching your selected status filter.</p>
          </div>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Write important updates, announcements, or pickup instructions..."
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-text-tertiary focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue resize-none"
          />
        </div>
        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-text-secondary hover:text-white transition-colors">Cancel</button>
          <button
            onClick={onSend}
            disabled={!messageText.trim()}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary-blue text-white hover:bg-primary-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_10px_rgba(43,140,238,0.2)]"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;

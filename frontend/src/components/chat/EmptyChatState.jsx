import React from "react";
import { MessageSquare } from "lucide-react";

export const EmptyChatList = ({ _onStartChat }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-lg py-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-xl border border-white/10 shadow-inner group">
      <div className="w-12 h-12 bg-dark-3 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500 font-bold">
        <MessageSquare size={24} className="text-text-tertiary opacity-40 group-hover:text-primary-blue group-hover:opacity-100 transition-all" />
      </div>
    </div>
    
    <h3 className="text-body-large-bold text-text-primary mb-xs tracking-tight">No active conversations</h3>
    <p className="text-body-extra-small text-text-tertiary max-w-[240px] leading-relaxed mx-auto">
      You&apos;re all caught up! Start a new chat to connect with others.
    </p>
  </div>
);

export const EmptyInbox = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-3xl max-w-2xl mx-auto animate-in fade-in zoom-in duration-700">
    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-xl relative group">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-primary-blue/10 rounded-3xl blur-2xl opacity-50" />
      
      <div className="relative w-12 h-12 bg-dark-2 rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 duration-500">
        <MessageSquare size={24} className="text-primary-blue opacity-80" />
      </div>
    </div>
    
    <p className="text-body-medium text-text-tertiary max-w-[480px] leading-relaxed mt-md">
      Connect with your classmates, join club discussions, or reach out to professors directly here.
    </p>
    
    <div className="mt-2xl flex items-center gap-md text-body-extra-small text-text-tertiary opacity-40 font-medium uppercase tracking-[0.2em]">
       <div className="h-px w-8 bg-white/10" />
       Secure messaging powered by Unify
       <div className="h-px w-8 bg-white/10" />
    </div>
  </div>
);

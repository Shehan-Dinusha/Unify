import React, { useState } from "react";
import { Search, X, Check, Globe, GraduationCap, Building2 } from "lucide-react";
import { mockVerified } from "../../data/mockData";

const NewChatModal = ({ isOpen, onClose, onSelectContact }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const filteredContacts = mockVerified.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All" || contact.type === activeTab;
    return matchesSearch && matchesTab;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-md animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-dark-1/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-dark-2 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col h-[600px] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-lg border-b border-white/5 flex items-center justify-between bg-dark-1/50 backdrop-blur-xl">
          <div className="flex flex-col">
            <h2 className="text-body-large-bold text-text-primary">New Message</h2>
            <p className="text-body-extra-small text-text-tertiary">Select a person or club to start chatting.</p>
          </div>
          <button onClick={onClose} className="p-sm hover:bg-white/5 rounded-full text-text-tertiary hover:text-text-primary transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="p-md flex flex-col gap-md">
          <div className="relative group">
            <Search size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary-blue transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, department, or society..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-md pl-11 pr-md text-body-medium text-text-primary focus:outline-none focus:border-primary-blue/40 focus:ring-4 focus:ring-primary-blue/5 transition-all"
            />
          </div>

          <div className="flex bg-white/5 p-xs rounded-2xl border border-white/10">
            {["All", "Club", "Batch Rep"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-sm rounded-xl text-body-extra-small-bold transition-all ${
                  activeTab === tab 
                    ? "bg-primary-blue text-text-primary shadow-custom" 
                    : "text-text-tertiary hover:text-text-primary"
                }`}
              >
                {tab}s
              </button>
            ))}
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto px-md pb-md custom-scrollbar">
          <div className="flex flex-col gap-sm">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div 
                  key={contact.id}
                  onClick={() => onSelectContact(contact)}
                  className="w-full p-md rounded-2xl flex items-center gap-md hover:bg-white/5 cursor-pointer group transition-all border border-transparent hover:border-white/5"
                >
                  <div className="relative">
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`} 
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-primary-blue transition-all" 
                      alt={contact.name} 
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-blue rounded-full border-2 border-dark-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Check size={10} className="text-text-primary" />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-xs">
                    <div className="flex items-center gap-sm">
                      <h4 className="text-body-medium-bold text-text-primary">{contact.name}</h4>
                    </div>
                    <div className="flex items-center gap-md text-body-extra-small text-text-tertiary">
                      {contact.type === "Club" ? (
                        <div className="flex items-center gap-1">
                          <Building2 size={12} />
                          <span>Society</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <GraduationCap size={12} />
                          <span> {contact.degree || "Batch Representative"}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 italic opacity-60">
                        <Globe size={11} />
                        <span>Verified {contact.verifiedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-4xl text-center opacity-60">
                <Search size={48} className="mb-md text-text-tertiary" />
                <p className="text-body-medium">No results for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-md bg-dark-1/30 border-t border-white/5 flex items-center justify-center">
            <p className="text-body-extra-small text-text-tertiary italic">Searching through all verified {activeTab.toLowerCase()} accounts.</p>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;

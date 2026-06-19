import React from 'react';
import { FileText, MessageSquare, UserCircle } from 'lucide-react';

export const reportTypes = [
  { id: 'post', label: 'Post', description: 'Report a specific post on the feed', icon: FileText },
  { id: 'comment', label: 'Comment', description: 'Report a comment on a discussion', icon: MessageSquare },
  { id: 'user', label: 'User Profile', description: 'Report a fake or abusive account', icon: UserCircle },
];

const ReportTypeSelector = ({ selectedType, setSelectedType, error }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-6 rounded-full bg-primary-blue flex items-center justify-center flex-shrink-0">
        <span className="text-white text-[12px] font-bold">1</span>
      </div>
      <h3 className="text-base sm:text-lg font-bold text-white font-inter">
        What are you reporting? <span className="text-state-error text-xs font-normal ml-1">*Required</span>
      </h3>
    </div>
    {error && <p className="text-state-error text-[10px] mb-2 px-1">{error}</p>}
    <div className="flex flex-col gap-2.5">
      {reportTypes.map((type) => {
        const IconComp = type.icon;
        const isSelected = selectedType === type.id;
        return (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all duration-200 text-left ${
              isSelected ? 'border-primary-blue/60 bg-primary-blue/10' : 'border-white/10 bg-white/5 hover:bg-white/[0.07] hover:border-white/20'
            }`}
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary-blue/20' : 'bg-white/10'}`}>
              <IconComp size={18} className={isSelected ? 'text-primary-blue' : 'text-text-secondary'} />
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <span className="text-sm sm:text-base font-bold text-white font-inter">{type.label}</span>
              <span className="text-[11px] sm:text-xs text-text-secondary font-inter mt-0.5">{type.description}</span>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-primary-blue' : 'border-white/30'}`}>
              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary-blue" />}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

export default ReportTypeSelector;

import React from 'react';
import { Image as ImageIcon, FileText } from 'lucide-react';
import Card from '../../components/common/Card';

const EvidenceAttachments = ({ evidence }) => {
  if (!evidence || evidence.length === 0) return null;

  return (
    <Card variant="card" padding="p-6">
      <h3 className="text-lg font-bold text-white font-inter mb-4">Evidence & Attachments</h3>
      <div className="flex flex-wrap gap-4">
        {evidence.map((ev, i) => (
          <a key={i} href={ev.url} target="_blank" rel="noopener noreferrer" className="relative w-[110px] h-[110px] rounded-xl overflow-hidden group cursor-pointer border border-white/10 hover:border-white/30 transition-all flex-shrink-0" title={`View ${ev.name}`}>
            {ev.type === 'image' ? (
              <>
                <img src={ev.url} alt="evidence" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=200'; }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="bg-white/20 p-1.5 rounded mb-2 backdrop-blur-sm">
                    <ImageIcon size={16} className="text-white" />
                  </div>
                  <span className="text-[10px] text-white font-inter truncate w-full text-center drop-shadow-md">{ev.name}</span>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center p-2 hover:bg-white/10 transition-colors">
                <FileText size={24} className="text-state-error/80 mb-2" />
                <span className="text-[10px] text-white font-inter truncate w-full text-center">{ev.name}</span>
              </div>
            )}
          </a>
        ))}
      </div>
    </Card>
  );
};

export default EvidenceAttachments;

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const PRODUCT_STATUSES = ['Seller Confirmed', 'Ready for Pickup', 'Order Completed'];
export const EVENT_STATUSES = ['ATTENDED', 'CANCELLED'];
export const ALL_PRODUCT_STATUSES = ['Order Placed', 'Seller Confirmed', 'Ready for Pickup', 'Order Completed'];
export const ALL_EVENT_STATUSES = ['PENDING', 'CONFIRMED', 'ATTENDED', 'CANCELLED'];

export const statusStyle = {
  'Order Placed': { dot: 'bg-primary-blue', badge: 'bg-primary-blue/15 text-primary-blue border border-primary-blue/20' },
  'Seller Confirmed': { dot: 'bg-purple-400', badge: 'bg-purple-400/15 text-purple-400 border border-purple-400/20' },
  'Ready for Pickup': { dot: 'bg-state-success', badge: 'bg-state-success/15 text-state-success border border-state-success/20' },
  'Order Completed': { dot: 'bg-white/30', badge: 'bg-white/8 text-text-secondary border border-white/10' },
  'PENDING': { dot: 'bg-yellow-400', badge: 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/20' },
  'CONFIRMED': { dot: 'bg-primary-blue', badge: 'bg-primary-blue/15 text-primary-blue border border-primary-blue/20' },
  'ATTENDED': { dot: 'bg-state-success', badge: 'bg-state-success/15 text-state-success border border-state-success/20' },
  'CANCELLED': { dot: 'bg-state-error', badge: 'bg-state-error/15 text-state-error border border-state-error/20' },
};

const StatusDropdown = ({ value, onChange, type, options: customOptions, align = 'right' }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const style = statusStyle[value] || { badge: 'bg-white/8 text-text-secondary border border-white/10' };
  const options = customOptions || (type === 'club-event' ? EVENT_STATUSES : PRODUCT_STATUSES);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${style.badge}`}
      >
        {value}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-1 z-50 bg-[#1A2F45] border border-white/10 rounded-xl overflow-hidden shadow-xl w-44`}>
          {options.map((s) => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-white/5 transition-colors flex items-center gap-2 ${s === value ? 'text-primary-blue' : 'text-text-secondary'}`}
            >
              {s === value && <Check className="w-3 h-3 shrink-0" />}
              {s !== value && <div className="w-3 h-3 shrink-0" />}
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;

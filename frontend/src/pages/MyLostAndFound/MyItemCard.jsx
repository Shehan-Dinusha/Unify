import { useState } from "react";
import { MapPin, CheckCircle, Pencil, Trash2 } from "lucide-react";

const MyItemCard = ({ item, onResolve, onEdit, onDelete, isResolved }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const startSlide = () => {
    if (!item.images || item.images.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev === item.images.length - 1 ? 0 : prev + 1));
    }, 1000);
    setIntervalId(id);
  };

  const stopSlide = () => {
    if (intervalId) clearInterval(intervalId);
    setCurrentIndex(0);
  };

  return (
    <div className="group rounded-2xl overflow-hidden bg-dark-2 border border-white/5 hover:border-primary-blue/30 transition-all duration-200">
      <div
        className="relative w-full h-40 sm:h-48 bg-dark-1/50 overflow-hidden"
        onMouseEnter={startSlide}
        onMouseLeave={stopSlide}
      >
        <img
          src={item.images && item.images.length > 0 ? item.images[currentIndex] : "https://placehold.co/400x300"}
          alt={item.title}
          className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-all duration-500"
        />
        <span className={`absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md ${
          isResolved
            ? "bg-primary-blue text-white"
            : item.type === "lost"
              ? "bg-state-error text-white"
              : "bg-state-success text-white"
        }`}>
          {isResolved ? "Resolved" : item.type}
        </span>
      </div>

      <div className="p-3 sm:p-4 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <h3 className="text-body-medium-bold text-text-primary leading-snug truncate">{item.title}</h3>
          <span className="text-[12px] text-text-tertiary whitespace-nowrap shrink-0">{item.time}</span>
        </div>

        <div className="flex items-center gap-1.5 text-text-tertiary">
          <MapPin size={13} className="shrink-0" />
          <span className="text-[12px] truncate">{item.location}</span>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
          {!isResolved ? (
            <button onClick={() => onResolve(item.id)} className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-lg transition-colors text-[12px] font-semibold">
              <CheckCircle size={14} />
              Resolve
            </button>
          ) : (
            <span className="flex items-center gap-1.5 text-primary-blue text-[12px] font-semibold px-3 py-1.5">
              <CheckCircle size={14} />
              Resolved
            </span>
          )}

          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(item.id)} className="p-2 rounded-lg text-text-tertiary hover:text-primary-blue hover:bg-white/5 transition-colors">
              <Pencil size={15} />
            </button>
            <button onClick={() => onDelete(item.id)} className="p-2 rounded-lg text-text-tertiary hover:text-state-error hover:bg-state-error/10 transition-colors">
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyItemCard;

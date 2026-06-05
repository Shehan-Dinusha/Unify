import { useState } from "react";
import { MapPin } from "lucide-react";

const ItemCard = ({ item, onSelect }) => {
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
    <div
      onClick={() => onSelect?.(item.id)}
      className="group rounded-2xl overflow-hidden bg-dark-2 border border-white/5 hover:border-primary-blue/30 transition-all duration-200 cursor-pointer"
    >
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
          item.type === "lost" ? "bg-state-error text-white" : "bg-state-success text-white"
        }`}>
          {item.type}
        </span>
      </div>

      <div className="p-3 sm:p-4 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-text-tertiary">
          <MapPin size={13} />
          <span className="text-[12px]">{item.location}</span>
        </div>
        <h3 className="text-body-medium-bold text-text-primary leading-snug">{item.title}</h3>
        <span className="text-[12px] text-text-tertiary">{item.time}</span>
      </div>
    </div>
  );
};

export default ItemCard;

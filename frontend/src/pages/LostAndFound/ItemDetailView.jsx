import { useState } from "react";
import {
  MapPin, Clock, Calendar, Lightbulb,
  Bookmark, Flag, FileText, CheckCircle,
} from "lucide-react";

const ItemDetailView = ({ item, matches, onSelectMatch }) => {
  const isLost = item.type === "lost";
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto px-2 sm:px-0">
      <div className="h-0" />

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-5">
        <div className="flex flex-col gap-5">
          <div className="relative rounded-2xl overflow-hidden bg-white/5">
            <img
              src={item.images && item.images.length > 0 ? item.images[activeImage] : "https://placehold.co/800x600"}
              alt={item.title}
              className="w-full h-[280px] sm:h-[340px] object-cover"
            />
            <span className={`absolute top-4 left-4 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg ${
              isLost ? "bg-state-error text-white" : "bg-state-success text-white"
            }`}>
              <CheckCircle size={13} />
              {item.type}
            </span>
          </div>

          {item.images && item.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {item.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setActiveImage(index)}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer border ${
                    activeImage === index ? "border-primary-blue" : "border-white/10"
                  }`}
                />
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-dark-2 p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-text-primary">
              <FileText size={16} className="text-primary-blue" />
              <span className="text-body-medium-bold">Full Description</span>
            </div>
            <p className="text-body-small text-text-secondary leading-relaxed">{item.description}</p>
          </div>

          {matches && matches.length > 0 && (
            <div className="rounded-2xl border border-primary-blue/30 bg-primary-blue/5 p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-text-primary">
                <Lightbulb size={18} className="text-primary-blue" />
                <span className="text-body-medium-bold">Potential Matches</span>
              </div>
              <p className="text-[12px] text-text-secondary -mt-2">
                Our algorithm found these potential matches based on description, location, and time.
              </p>
              <div className="flex flex-col gap-3">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    onClick={() => onSelectMatch?.(match.id)}
                    className="bg-dark-3 rounded-xl p-3 border border-white/5 flex gap-3 cursor-pointer hover:border-primary-blue/50 transition-colors"
                  >
                    <img src={match.images?.[0] || "https://placehold.co/100x100"} alt={match.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-body-small-bold text-text-primary line-clamp-1">{match.title}</span>
                        <span className="text-[10px] font-bold text-primary-blue bg-primary-blue/10 px-2 py-0.5 rounded-md shrink-0">
                          {Math.round(match.score * 100)}% Match
                        </span>
                      </div>
                      <span className="text-[11px] text-text-tertiary mt-1 flex items-center gap-1">
                        <MapPin size={10} /> <span className="truncate">{match.location}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-white/10 bg-dark-2 p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h1 className="text-heading-small text-text-primary">{item.title}</h1>
                <span className="text-body-extra-small text-text-tertiary">Post ID: {item.postId}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 mt-1">
                <button className="text-text-tertiary hover:text-text-primary transition-colors"><Bookmark size={18} /></button>
                <button className="text-text-tertiary hover:text-state-error transition-colors"><Flag size={18} /></button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">{isLost ? "Date Lost" : "Date Found"}</span>
                <div className="flex items-center gap-2 text-text-primary">
                  <Calendar size={14} className="text-primary-blue" />
                  <span className="text-body-small">{item.date}</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Time</span>
                <div className="flex items-center gap-2 text-text-primary">
                  <Clock size={14} className="text-primary-blue" />
                  <span className="text-body-small">{item.timeOfDay}</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Location</span>
                <div className="flex items-center gap-2 text-text-primary">
                  <MapPin size={14} className="text-primary-blue" />
                  <span className="text-body-small">{item.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto rounded-2xl border border-white/10 bg-dark-2 p-3.5 flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
              {isLost ? "Lost By" : "Found By"}
            </span>
            <div className="flex items-center gap-3">
              <img
                src={
                  !item.postedBy.avatar || item.postedBy.avatar.includes("placehold") || item.postedBy.avatar.includes("dicebear")
                    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(item.postedBy.name || "User")}&background=2666F1&color=fff`
                    : item.postedBy.avatar
                }
                alt={item.postedBy.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-body-small-bold text-text-primary">{item.postedBy.name}</span>
                <span className="text-body-extra-small text-text-tertiary">{item.postedBy.degree}</span>
              </div>
            </div>
          </div>

          <button className="w-full py-3.5 rounded-xl text-white text-body-medium-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 bg-primary-blue hover:brightness-110">
            <CheckCircle size={18} />
            {isLost ? "I Found This" : "Claim This Item"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailView;

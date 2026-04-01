import React, { useState } from "react";
import { Search, CornerUpLeft } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import { mockNotifications } from "../data/mockData";

/* --- Helper Components --- */

// Avatar for Reply
const ReplyAvatar = ({ avatar }) => (
  <div className="relative w-10 h-10 shrink-0">
    <img src={avatar} alt="Reply" className="w-full h-full rounded-full object-cover" />
    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-blue rounded-full border-2 border-dark-1 flex items-center justify-center">
      <CornerUpLeft size={10} className="text-white" />
    </div>
  </div>
);

// Stacked Avatars for Like
const LikeAvatars = ({ avatars }) => (
  <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
    <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center relative">
       {/* If we strictly follow the design, it's just two mini avatars overlapping inside the circle or just the circle */}
       {avatars && avatars[0] && (
         <img src={avatars[0]} className="absolute -top-1 -left-1 w-6 h-6 rounded-full border-2 border-dark-1 object-cover z-10" alt="Like 1"/>
       )}
       {avatars && avatars[1] && (
         <img src={avatars[1]} className="absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-dark-1 object-cover" alt="Like 2"/>
       )}
    </div>
  </div>
);

// Match Icon for Lost & Found
const MatchIcon = () => (
  <div className="w-10 h-10 shrink-0 rounded-full bg-[#2D2A4A] flex items-center justify-center">
    <Search size={18} className="text-[#A78BFA]" />
  </div>
);

/* --- Main Notification Card --- */
const NotificationCard = ({ notification }) => {
  const { type, title, content, time, isUnread, avatar, avatars, image } = notification;

  // Render correct icon/avatar
  const renderIcon = () => {
    switch (type) {
      case "reply":
        return <ReplyAvatar avatar={avatar} />;
      case "like":
        return <LikeAvatars avatars={avatars} />;
      case "match":
        return <MatchIcon />;
      default:
        return <div className="w-10 h-10 bg-white/10 rounded-full" />;
    }
  };

  // Format title (Make names blue for replies if we loosely split)
  const renderTitle = () => {
    if (type === "reply") {
      const words = title.split(" ");
      if (words.length >= 2) {
        return (
          <>
            <span className="text-primary-blue">{words[0]} {words[1]}</span>{" "}
            <span className="text-text-primary">{words.slice(2).join(" ")}</span>
          </>
        );
      }
    }
    return <span className="text-text-primary">{title}</span>;
  };

  return (
    <Card
      variant="container"
      padding="p-0"
      className={`transition-all duration-300 ${
        isUnread
          ? "!bg-[#162743] !border-primary-blue/30 cursor-pointer"
          : "hover:!bg-white/10 hover:!border-white/15 cursor-pointer"
      }`}
    >
      <div className="flex items-start gap-4 p-5 sm:p-6 w-full h-full relative">
        {/* Icon Area */}
        {renderIcon()}

        {/* Content Area */}
        <div className="flex-1 flex flex-col gap-1.5 pt-0.5">
          <h3 className="text-body-small-bold sm:text-body-medium-bold">
            {renderTitle()}
          </h3>
          <p className={`text-body-small ${type === "reply" ? "text-text-secondary italic" : "text-text-secondary"}`}>
            {content}
          </p>
          <span className="text-[12px] text-text-tertiary mt-1">{time}</span>
        </div>

        {/* Right Area (Unread Dot or Thumbnail) */}
        <div className="flex flex-col items-end gap-2 shrink-0 h-full">
          {isUnread && <div className="w-2.5 h-2.5 rounded-full bg-primary-blue mt-2" />}
          {image && (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-white/10 mt-auto mb-auto">
              <img src={image} alt="Match thumbnail" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

/* --- Page --- */
const FILTERS = ["All", "Unread", "Lost & Found"];

const Notification = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const unreadCount = mockNotifications.filter((n) => n.isUnread).length;

  const filteredNotifications = mockNotifications.filter((n) => {
    if (activeFilter === "Unread") return n.isUnread;
    if (activeFilter === "Lost & Found") return n.type === "match";
    return true;
  });

  const user = { name: "Alex Johnson", role: "student" };

  return (
    <MainLayout user={user} pageTitle="Notifications">
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto px-2 sm:px-0">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-body-small font-semibold transition-all duration-150 whitespace-nowrap ${
                activeFilter === filter
                  ? "bg-primary-blue text-white"
                  : "bg-white/5 text-text-secondary hover:bg-white/10 border border-white/10"
              }`}
            >
              {filter}
              {/* Badge for Unread */}
              {filter === "Unread" && unreadCount > 0 && (
                <span
                  className={`w-5 h-5 flex items-center justify-center rounded-full text-[11px] font-bold ${
                    activeFilter === filter
                      ? "bg-white text-primary-blue"
                      : "bg-primary-blue text-white"
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <span className="text-heading-medium opacity-50">📭</span>
              </div>
              <p className="text-body-medium text-text-secondary">No notifications found.</p>
            </div>
          )}
        </div>
        
      </div>
    </MainLayout>
  );
};

export default Notification;

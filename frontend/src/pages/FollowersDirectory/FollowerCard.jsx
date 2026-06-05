import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import Avatar from "../../components/common/Avatar";
import * as chatService from "../../services/chatService";

const FollowerCard = ({ follower }) => {
  const navigate = useNavigate();

  const handleMessage = async () => {
    try {
      const res = await chatService.createConversation(follower.id);
      if (res.success) navigate("/messages", { state: { activeConversationId: res.data.id, newConversation: res.data } });
    } catch (e) { console.error("Failed to start chat", e); }
  };

  return (
    <div className="w-full h-20 px-4 py-4 relative bg-white/5 rounded-2xl flex justify-between items-center border border-white/20 hover:bg-white/10 transition-colors">
      <div className="flex justify-start items-center gap-4">
        <Avatar className="w-10 h-10 relative rounded-full shadow-[0px_0px_0px_2px_rgba(28,35,51,1.00),_0px_0px_0px_4px_rgba(43,108,238,0.20)] object-cover"
          src={follower.avatar} alt={follower.name} />
        <div className="flex flex-col justify-start items-start overflow-hidden">
          <div className="text-white text-sm font-bold font-inter leading-5 truncate">{follower.name}</div>
        </div>
      </div>
      <button onClick={handleMessage}
        className="w-12 h-10 bg-blue-600/10 hover:bg-blue-600/20 transition-colors rounded-full flex justify-center items-center group cursor-pointer border-none outline-none"
        aria-label={`Message ${follower.name}`}>
        <MessageSquare className="w-5 h-5 text-blue-500 group-hover:text-blue-400" />
      </button>
    </div>
  );
};

export default FollowerCard;

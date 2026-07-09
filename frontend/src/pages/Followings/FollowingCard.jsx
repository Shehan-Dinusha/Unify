import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, UserCheck, UserPlus } from 'lucide-react';
import Button from '../../components/common/Button';
import * as chatService from '../../services/chatService';
import { unfollowOrganization } from '../../services/followerService';
import Avatar from '../../components/common/Avatar';

const FollowingCard = ({ following, onUnfollow }) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(true);

  const handleViewProfile = () => {
    navigate(`/profile/${following.id}`);
  };

  const handleMessage = async (e) => {
    e.stopPropagation();
    try {
      const res = await chatService.createConversation(following.id);
      if (res.success) {
        navigate('/messages', {
          state: {
            activeConversationId: res.data.id,
            newConversation: res.data,
          },
        });
      }
    } catch (e) {
    }
  };

  const handleFollowClick = async (e) => {
    e.stopPropagation();
    const prev = isFollowing;
    setIsFollowing(!prev);
    try {
      await unfollowOrganization(following.id);
      if (prev) {
        onUnfollow(following.id);
      }
    } catch {
      setIsFollowing(prev);
    }
  };

  return (
    <div className="w-full min-h-24 md:h-24 p-4 relative bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/20 flex flex-row items-center justify-between gap-2 md:gap-4 group">
      <div onClick={handleViewProfile} className="flex items-center gap-3 md:gap-4 flex-1 overflow-hidden min-w-0 cursor-pointer">
        <div className="w-12 h-12 md:w-16 md:h-16 min-w-[48px] md:min-w-[64px] bg-gray-800 rounded-full border border-gray-800 flex items-center justify-center overflow-hidden shrink-0">
          <Avatar className="w-full h-full object-cover" src={following.avatar} alt={following.name} />
        </div>
        <div className="flex flex-col justify-center items-start overflow-hidden w-full">
          <div className="flex items-center gap-3 mb-1 w-full">
            <h3 className="text-white text-sm md:text-base font-bold font-inter leading-4 md:leading-5 md:truncate w-full line-clamp-2 md:line-clamp-none max-w-[160px] sm:max-w-[200px] md:max-w-xs">
              {following.name}
            </h3>
          </div>
          <p className="hidden md:block text-gray-400 text-sm font-normal font-inter leading-5 w-full line-clamp-2 md:truncate">
            {following.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 shrink-0">
        <button
          onClick={handleMessage}
          className="w-11 h-11 md:w-10 md:h-10 bg-blue-600/10 hover:bg-blue-600/20 transition-colors rounded-full flex justify-center items-center group/btn cursor-pointer border-none outline-none"
          aria-label={`Message ${following.name}`}
        >
          <MessageSquare className="w-5 h-5 text-blue-500 group-hover/btn:text-blue-400" />
        </button>

        <div className="hidden md:block">
          <Button onClick={handleFollowClick} variant={isFollowing ? 'secondary' : 'primary'} size="small" icon={isFollowing ? UserCheck : UserPlus} className="!h-9 !px-4 !rounded-2xl gap-2">
            <span className="text-base font-bold font-inter leading-5">{isFollowing ? 'Following' : 'Follow'}</span>
          </Button>
        </div>

        <div className="md:hidden">
          <Button onClick={handleFollowClick} variant={isFollowing ? 'secondary' : 'primary'} iconOnly={true} icon={isFollowing ? UserCheck : UserPlus} size="medium" className="!w-11 !h-11 !p-0 !min-w-[44px] shrink-0" aria-label={isFollowing ? 'Unfollow' : 'Follow'} />
        </div>
      </div>
    </div>
  );
};

export default FollowingCard;

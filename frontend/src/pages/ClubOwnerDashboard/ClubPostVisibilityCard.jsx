import React from 'react';
import ClubPostCard from '../../components/club/ClubPostCard';
import { Eye, EyeOff } from 'lucide-react';

const ClubPostVisibilityCard = ({ clubPosts, setClubPosts, navigate, orderService }) => {
  if (clubPosts.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base">Your Posts</h3>
        </div>
        <p className="text-text-secondary text-xs text-center py-8">No posts yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base">Your Posts</h3>
        <span className="text-text-secondary text-xs">
          {clubPosts.filter((p) => p.isVisible).length} of {clubPosts.length} visible in feed
        </span>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {clubPosts.map((post) => {
          const isInFeed = post.isVisible;
          return (
            <div key={`${post.postType}-${post.id}`} className="relative group">
              {post.postType === 'club-product' && post.unconfirmedOrderCount > 0 && (
                <div className="absolute -top-3 left-4 z-20 flex items-center gap-2 rounded-full bg-primary-blue px-3 py-1.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(43,140,238,0.45)] pointer-events-none">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  {post.unconfirmedOrderCount} new {post.unconfirmedOrderCount === 1 ? 'order' : 'orders'}
                </div>
              )}
              <div
                className={`transition-all duration-300 ${
                  isInFeed ? 'opacity-100' : 'opacity-40 grayscale-[30%] pointer-events-none'
                }`}
              >
                <ClubPostCard
                  post={post}
                  isOwner={true}
                  hideActions={true}
                  onCardClick={() =>
                    navigate(`/club-owner/product-orders/${post.postType}/${post.id}`)
                  }
                />
              </div>

              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center gap-3 px-3 py-2 bg-[#0B1220]/75 backdrop-blur-md rounded-full shadow-lg border border-white/10 transition-all hover:bg-[#0B1220]/90 pointer-events-auto">
                  <div className="flex items-center gap-2 pr-2 border-r border-white/10">
                    {isInFeed ? (
                      <Eye className="w-4 h-4 text-state-success" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-white/50" />
                    )}
                    <span className={`text-xs font-semibold ${isInFeed ? 'text-white' : 'text-white/60'}`}>
                      {isInFeed ? 'Live' : 'Hidden'}
                    </span>
                  </div>

                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        const res = await orderService.togglePostVisibility(post.postType, post.id);
                        if (res.success) {
                          setClubPosts((prev) =>
                            prev.map((p) =>
                              p.id === post.id && p.postType === post.postType
                                ? { ...p, isVisible: res.isVisible }
                                : p,
                            ),
                          );
                        }
                      } catch (err) {
                      }
                    }}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${
                      isInFeed ? 'bg-state-success' : 'bg-white/20'
                    } focus:outline-none shrink-0`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${
                        isInFeed ? 'translate-x-[18px]' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClubPostVisibilityCard;

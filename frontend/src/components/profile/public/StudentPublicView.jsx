import React, { useState } from "react";
import ProfileHeader from "../ProfileHeader";
import AboutSection from "../AboutSection";
import RecentPostsSection from "./RecentPostsSection";
import Card from "../../common/Card";
import FollowersListModal from "../modals/FollowersListModal";

/**
 * StudentPublicView — read-only public view for a student profile.
 */
const StudentPublicView = ({ profile }) => {
  const [followersModalType, setFollowersModalType] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-x-lg md:gap-y-md items-start text-start">
      {/* Left — Profile Card */}
      <div className="md:row-span-1 flex flex-col gap-4">
        <ProfileHeader profile={profile} isPublic={true} />
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-md">
          {[
            { label: "Followers", value: profile?.followerCount || 0, type: "followers" },
            { label: "Following", value: profile?.followingCount || 0, type: "followings" },
          ].map((stat, idx) => (
            <Card
              key={idx}
              variant="container"
              padding="p-4 md:p-md"
              className="flex flex-col items-center justify-center text-center gap-1 md:gap-xs cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setFollowersModalType(stat.type)}
            >
              <span className="text-xl md:text-heading-small text-text-primary font-bold block leading-none">
                {stat.value}
              </span>
              <span className="text-[11px] md:text-body-small text-text-secondary">
                {stat.label}
              </span>
            </Card>
          ))}
        </div>
      </div>

      {/* Right — Top Sections (Details) */}
      <div className="flex flex-col gap-4 md:gap-md">
        {/* Quick Info */}
        {(profile?.batch || profile?.faculty) && (
          <Card variant="container" padding="p-4 md:p-lg">
            <h3 className="text-base md:text-body-large-bold text-text-primary mb-3 md:mb-md">
              Details
            </h3>
            <div className="flex flex-col gap-2.5 md:gap-sm">
              {profile.batch && (
                <div className="flex items-center gap-sm">
                  <span className="text-[12px] md:text-body-small text-text-secondary w-20 md:w-24 flex-shrink-0">
                    Batch
                  </span>
                  <span className="text-[12px] md:text-body-small-bold text-text-primary font-bold">
                    {profile.batch}
                  </span>
                </div>
              )}
              {profile.faculty && (
                <div className="flex items-center gap-sm">
                  <span className="text-[12px] md:text-body-small text-text-secondary w-20 md:w-24 flex-shrink-0">
                    Faculty
                  </span>
                  <span className="text-[12px] md:text-body-small-bold text-text-primary font-bold">
                    {profile.faculty}
                  </span>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Row — Full Width Sections */}
      <div className="md:col-span-2 mt-4 md:mt-lg flex flex-col gap-4 md:gap-md">
        {/* Recent Post Feed */}
        <RecentPostsSection posts={profile?.posts} />
      </div>

      {followersModalType && (
        <FollowersListModal
          userId={profile?.id}
          type={followersModalType}
          onClose={() => setFollowersModalType(null)}
        />
      )}
    </div>
  );
};

export default StudentPublicView;

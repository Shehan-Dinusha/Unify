import React, { useState } from "react";
import ProfileHeader from "../ProfileHeader";
import AboutSection from "../AboutSection";
import Card from "../../common/Card";
import Button from "../../common/Button";
import { UserCheck, UserPlus, Users } from "lucide-react";
import RecentPostsSection from "./RecentPostsSection";
import { unfollowOrganization } from "../../../services/followerService";
import { getCurrentUser } from "../../../services/authService";

/**
 * ClubPublicView — public-facing view for club_society profiles.
 * Note: Reviews and Following stat are not shown for clubs.
 *   - Clubs cannot receive reviews.
 *   - Clubs do not follow other accounts.
 */
const ClubPublicView = ({ profile }) => {
  const [isFollowing, setIsFollowing] = useState(profile?.isFollowing || false);
  const [followerCount, setFollowerCount] = useState(profile?.followerCount || 0);

  const currentUser = getCurrentUser();
  const isStudent = currentUser?.role?.toLowerCase() === "student";

  const handleToggleFollow = async () => {
    const wasFollowing = isFollowing;

    // Optimistic update — instant UI feedback
    setIsFollowing(!wasFollowing);
    setFollowerCount((prev) => (wasFollowing ? prev - 1 : prev + 1));

    try {
      await unfollowOrganization(profile.id);
    } catch (err) {
      // Revert on failure
      setIsFollowing(wasFollowing);
      setFollowerCount((prev) => (wasFollowing ? prev + 1 : prev - 1));
      console.error("Failed to toggle follow status:", err);
      alert(err.response?.data?.message || "Failed to toggle follow");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-x-lg md:gap-y-md items-start text-start">
      {/* Left — Profile Card */}
      <div className="md:row-span-1">
        <ProfileHeader profile={profile} isPublic={true} />
      </div>

      {/* Right — Top Sections */}
      <div className="flex flex-col gap-4 md:gap-md">
        {/* Social Action Bar — unified card */}
        <Card variant="container" padding="p-3 md:p-4">
          <div className="flex flex-row items-center justify-between gap-4">
            {/* Followers Stat */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary-blue/10 flex items-center justify-center shrink-0">
                <Users size={16} className="text-primary-blue" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-base md:text-lg text-text-primary font-bold leading-tight">
                  {followerCount}
                </span>
                <span className="text-[10px] md:text-[11px] text-text-secondary uppercase tracking-wider font-medium">
                  Followers
                </span>
              </div>
            </div>

            {/* Follow / Following Button */}
            {isStudent && (
              <Button
                onClick={handleToggleFollow}
                variant={isFollowing ? "outline" : "primary"}
                className="rounded-xl text-[12px] md:text-[13px] font-bold whitespace-nowrap px-4 md:px-5 py-2 md:py-2.5 shrink-0"
                icon={isFollowing ? UserCheck : UserPlus}
              >
                {isFollowing ? "Following" : "Follow Club"}
              </Button>
            )}
          </div>
        </Card>

        {/* About */}
        <AboutSection
          description={
            profile?.description ||
            "A community for book lovers and writers. Join us for monthly readings and discussions."
          }
        />
      </div>

      {/* Bottom Row — Full Width Sections */}
      <div className="md:col-span-2 mt-4 md:mt-lg flex flex-col gap-4 md:gap-md">
        {/* Recent Post Feed */}
        <RecentPostsSection posts={profile?.posts} />
      </div>
    </div>
  );
};

export default ClubPublicView;

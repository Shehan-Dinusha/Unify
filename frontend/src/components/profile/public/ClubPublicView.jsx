import React, { useState } from "react";
import ProfileHeader from "../ProfileHeader";
import AboutSection from "../AboutSection";
import Card from "../../common/Card";
import Button from "../../common/Button";
import { UserCheck, UserPlus } from "lucide-react";
import RecentPostsSection from "./RecentPostsSection";
import FollowersListModal from "../modals/FollowersListModal";
import { unfollowOrganization } from "../../../services/followerService";
import { getCurrentUser } from "../../../services/authService";

/**
 * ClubPublicView — public-facing view for club_society profiles.
 * Note: Reviews and Following stat are not shown for clubs.
 *   - Clubs cannot receive reviews.
 *   - Clubs do not follow other accounts.
 */
const ClubPublicView = ({ profile }) => {
  const [followersModalType, setFollowersModalType] = useState(null);
  const [isFollowing, setIsFollowing] = useState(profile?.isFollowing || false);
  const [followerCount, setFollowerCount] = useState(profile?.followerCount || 0);

  const currentUser = getCurrentUser();
  const isStudent = currentUser?.role?.toLowerCase() === "student";

  const handleToggleFollow = async () => {
    try {
      await unfollowOrganization(profile.id);
      setIsFollowing(!isFollowing);
      setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("Failed to toggle follow status:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to toggle follow";
      alert(msg);
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
        {/* About */}
        <AboutSection
          description={
            profile?.description ||
            "A community for book lovers and writers. Join us for monthly readings and discussions."
          }
        />

        {/* Followers Stat Card */}
        <div className="grid grid-cols-1 gap-3 md:gap-md">
          <Card
            variant="container"
            padding="p-4 md:p-md"
            className="flex flex-col items-center justify-center text-center gap-1 md:gap-xs cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => setFollowersModalType("followers")}
          >
            <span className="text-xl md:text-heading-small text-text-primary font-bold block leading-none">
              {followerCount}
            </span>
            <span className="text-[10px] md:text-body-extra-small text-text-secondary uppercase tracking-wider font-medium">
              Followers
            </span>
          </Card>
        </div>

        {/* Follow Button */}
        {isStudent && (
          <div className="w-full flex justify-end">
            <Button
              onClick={handleToggleFollow}
              variant={isFollowing ? "outline" : "primary"}
              className="py-2.5 rounded-xl text-[14px] font-bold md:w-auto w-full"
              icon={isFollowing ? UserCheck : UserPlus}
            >
              {isFollowing ? "Following" : "Follow Club"}
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Row — Full Width Sections */}
      <div className="md:col-span-2 mt-4 md:mt-lg flex flex-col gap-4 md:gap-md">
        {/* Recent Post Feed */}
        <RecentPostsSection posts={profile?.posts} />
      </div>

      {/* Followers / Following List Modal */}
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

export default ClubPublicView;

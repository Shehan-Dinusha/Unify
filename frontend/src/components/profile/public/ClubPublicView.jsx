import React, { useState } from "react";
import ProfileHeader from "../ProfileHeader";
import AboutSection from "../AboutSection";
import ReviewsSection from "../ReviewsSection";
import Card from "../../common/Card";
import RecentPostsSection from "./RecentPostsSection";

import { AddReviewModal } from "../../common/ReviewModals";

/**
 * ClubPublicView — public-facing view for club_society profiles.
 */
const ClubPublicView = ({ profile }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-x-lg md:gap-y-md items-start text-start">
      {/* Left — Profile Card */}
      <div className="md:row-span-1">
        <ProfileHeader profile={profile} />
      </div>

      {/* Right — Top Sections */}
      <div className="flex flex-col gap-4 md:gap-md">
        {/* Rating */}
        <ReviewsSection
          rating={profile?.rating || 4.2}
          reviewCount={profile?.reviewCount || 8}
          onAddReview={() => setShowReviewModal(true)}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-md">
          {[
            { label: "Followers", value: profile?.followerCount || 142 },
            { label: "Following", value: profile?.followingCount || 56 },
          ].map((stat, idx) => (
            <Card
              key={idx}
              variant="container"
              padding="p-4 md:p-md"
              className="flex flex-col items-center justify-center text-center gap-1 md:gap-xs"
            >
              <span className="text-xl md:text-heading-small text-text-primary font-bold block leading-none">
                {stat.value}
              </span>
              <span className="text-[10px] md:text-body-extra-small text-text-secondary uppercase tracking-wider font-medium">
                {stat.label}
              </span>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Row — Full Width Sections */}
      <div className="md:col-span-2 flex flex-col gap-4 md:gap-md">
        {/* About */}
        <AboutSection
          description={
            profile?.description ||
            "A community for book lovers and writers. Join us for monthly readings and discussions."
          }
        />

        {/* Recent Post Feed */}
        <RecentPostsSection posts={profile?.posts} />
      </div>

      {/* Modal */}
      {showReviewModal && (
        <AddReviewModal
          onClose={() => setShowReviewModal(false)}
          onConfirm={(data) => {
            console.log("Review submitted:", data);
          }}
        />
      )}
    </div>
  );
};

export default ClubPublicView;

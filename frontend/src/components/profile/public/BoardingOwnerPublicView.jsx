import React, { useState } from "react";
import ProfileHeader from "../ProfileHeader";
import FacilitiesCard from "../FacilitiesCard";
import AboutSection from "../AboutSection";
import ReviewsSection from "../ReviewsSection";
import RecentPostsSection from "./RecentPostsSection";
import FollowersListModal from "../modals/FollowersListModal";
import ReviewsListModal from "../modals/ReviewsListModal";
import Card from "../../common/Card";

import { AddReviewModal } from "../../common/ReviewModals";
import { submitReview } from "../../../services/reviewService";

/**
 * BoardingOwnerPublicView — public-facing view for boarding_owner profiles.
 */
const BoardingOwnerPublicView = ({ profile }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewsList, setShowReviewsList] = useState(false);
  const [followersModalType, setFollowersModalType] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-x-lg md:gap-y-md items-start text-start">
      {/* Left — Profile Card */}
      <div className="md:row-span-1 flex flex-col gap-4">
        <ProfileHeader profile={profile} isPublic={true} />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-md">
          {[
            {
              label: "Followers",
              value: profile?.followerCount || 0,
              type: "followers",
            },
            {
              label: "Following",
              value: profile?.followingCount || 0,
              type: "followings",
            },
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

      {/* Right — Top Sections */}
      <div className="flex flex-col gap-4 md:gap-md">
        {/* Rating */}
        <ReviewsSection
          rating={profile?.rating ?? 0}
          reviewCount={profile?.reviewCount ?? 0}
          onAddReview={() => setShowReviewModal(true)}
          onViewReviews={() => setShowReviewsList(true)}
        />

        {/* Facilities */}
        <FacilitiesCard
          title="Boarding Facilities"
          items={
            profile?.facilities || [
              "WiFi Included",
              "24/7 Security",
              "Water & Electricity",
              "Furnished Rooms",
              "Parking Available",
              "Laundry Access",
            ]
          }
        />
      </div>

      {/* Bottom Row — Full Width Sections */}
      <div className="md:col-span-2 mt-4 md:mt-lg flex flex-col gap-4 md:gap-md">
        {/* About */}
        <AboutSection
          description={
            profile?.description ||
            "Safe and high-quality student accommodation near the university campus."
          }
        />

        {/* Recent Post Feed */}
        <RecentPostsSection posts={profile?.posts} />
      </div>

      {/* Modal */}
      {showReviewModal && (
        <AddReviewModal
          onClose={() => setShowReviewModal(false)}
          onConfirm={async (data) => {
            try {
              await submitReview({
                targetId: profile.id,
                rating: data.rating,
                review: data.comment,
                isAnonymous: false,
              });
              window.location.reload();
            } catch (err) {
              console.error(err);
              alert(err.message || "Failed to submit review");
            }
          }}
        />
      )}

      {showReviewsList && (
        <ReviewsListModal
          targetId={profile?.id}
          onClose={() => setShowReviewsList(false)}
        />
      )}

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

export default BoardingOwnerPublicView;

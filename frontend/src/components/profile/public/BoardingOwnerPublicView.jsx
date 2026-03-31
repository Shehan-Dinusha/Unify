import React, { useState } from "react";
import ProfileHeader from "../ProfileHeader";
import FacilitiesCard from "../FacilitiesCard";
import AboutSection from "../AboutSection";
import ReviewsSection from "../ReviewsSection";
import RecentPostsSection from "./RecentPostsSection";
import Card from "../../common/Card";

import { AddReviewModal } from "../../common/ReviewModals";

/**
 * BoardingOwnerPublicView — public-facing view for boarding_owner profiles.
 */
const BoardingOwnerPublicView = ({ profile }) => {
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
          rating={profile?.rating || 4.5}
          reviewCount={profile?.reviewCount || 12}
          onAddReview={() => setShowReviewModal(true)}
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
      <div className="md:col-span-2 flex flex-col gap-4 md:gap-md">
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
          onConfirm={(data) => {
            console.log("Review submitted:", data);
          }}
        />
      )}
    </div>
  );
};

export default BoardingOwnerPublicView;

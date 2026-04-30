import React, { useState } from "react";
import ProfileHeader from "../ProfileHeader";
import FacilitiesCard from "../FacilitiesCard";
import AboutSection from "../AboutSection";
import ReviewsSection from "../ReviewsSection";
import Card from "../../common/Card";
import RecentPostsSection from "./RecentPostsSection";

import { AddReviewModal } from "../../common/ReviewModals";

/**
 * FoodCafePublicView — public-facing view for food_cafe profiles.
 */
const FoodCafePublicView = ({ profile }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-x-lg md:gap-y-md items-start text-start">
      {/* Left — Profile Card (aligned with first 2 sections on right) */}
      <div className="md:row-span-1">
        <ProfileHeader profile={profile} isPublic={true} />
      </div>

      {/* Right — Top Sections (Rating + Menu) */}
      <div className="flex flex-col gap-4 md:gap-md">
        {/* Rating */}
        <ReviewsSection
          rating={profile?.rating || 4.3}
          reviewCount={profile?.reviewCount || 27}
          onAddReview={() => setShowReviewModal(true)}
        />

        {/* About Section replaced Menu/Facilities */}
        <AboutSection
          description={
            profile?.description ||
            "Serving quality meals for students near the university campus."
          }
        />
      </div>

      {/* Bottom Row — Full Width Sections */}
      <div className="md:col-span-2 mt-4 md:mt-lg flex flex-col gap-4 md:gap-md">
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

export default FoodCafePublicView;

import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../ProfileHeader";
import FacilitiesCard from "../FacilitiesCard";
import AboutSection from "../AboutSection";
import ReviewsSection from "../ReviewsSection";
import RecentPostsSection from "./RecentPostsSection";

/**
 * BoardingOwnerPublicView — public-facing view for boarding_owner profiles.
 * Note: Business accounts do not have follower/following features.
 */
const BoardingOwnerPublicView = ({ profile }) => {
  const navigate = useNavigate();

  const handleReviewNavigation = () => {
    navigate(`/marketplace/${profile.id}/reviews`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-x-lg md:gap-y-md items-start text-start">
      {/* Left — Profile Card */}
      <div className="md:row-span-1 flex flex-col gap-4">
        <ProfileHeader profile={profile} isPublic={true} />
      </div>

      {/* Right — Top Sections */}
      <div className="flex flex-col gap-4 md:gap-md">
        {/* Rating */}
        <ReviewsSection
          rating={profile?.rating ?? 0}
          reviewCount={profile?.reviewCount ?? 0}
          onAddReview={handleReviewNavigation}
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
    </div>
  );
};

export default BoardingOwnerPublicView;

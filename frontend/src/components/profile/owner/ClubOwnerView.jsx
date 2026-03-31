import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../ProfileHeader";
import ProfileDashboardCard from "../ProfileDashboardCard";
import Button from "../../common/Button";
import { Plus, Zap, ShieldCheck } from "lucide-react";

// localStorage key
const STORAGE_KEY = "unify_club_verification_submitted";

/**
 * ClubOwnerView — dashboard cards, verification banner, and CTAs for club_society role.
 */
const ClubOwnerView = () => {
  const navigate = useNavigate();

  // Read initial state from localStorage
  const [submitted] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true",
  );

  const handleVerificationClick = () => {
    navigate("/club-verification");
  };

  const cards = [
    {
      icon: "🔖",
      iconBg: "bg-purple-500/20",
      title: "My Posts",
      description: "View and manage your advertisements and updates.",
    },
    {
      icon: "👥",
      iconBg: "bg-pink-500/20",
      title: "View Followers",
      description: "View people who follow you",
      path: "/club/followers",
    },
    {
      icon: "⊞",
      iconBg: "bg-blue-500/20",
      title: "View Boost Packages",
      description: "Explore packages to promote your listings.",
    },
    {
      icon: "🚀",
      iconBg: "bg-violet-500/20",
      title: "View Boosted Posts",
      description: "Track boosted posts and their performance.",
    },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-lg text-start">
      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-md items-stretch">
        {cards.map((card, idx) => (
          <ProfileDashboardCard key={idx} {...card} />
        ))}
      </div>

      {/* Verification Banner */}
      <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 md:p-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-md">
        <div className="flex flex-col gap-xs">
          <h3 className="text-base md:text-body-large-bold text-text-primary">
            {submitted ? "Club Verification" : "Start Verifying Your Club"}
          </h3>
          <p className="text-[12px] md:text-body-small text-text-secondary max-w-sm leading-relaxed">
            {submitted
              ? "Your verification document is under review by the admin team."
              : "Upload an official document that verifies your club's registration or university recognition."}
          </p>
        </div>
        <div className="flex items-center gap-sm flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-start">
          <Button
            variant="outline"
            size="small"
            onClick={handleVerificationClick}
            className="flex-1 sm:flex-initial text-[12px] md:text-body-small py-1.5 md:py-2"
          >
            {submitted ? "See Status" : "Start Verification"}
          </Button>
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white/10 flex items-center justify-center">
            <ShieldCheck
              size={17}
              className={submitted ? "text-state-success" : "text-primary-blue"}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-md">
        <Button variant="primary" fullWidth icon={Plus} className="py-2.5 md:py-3">
          Create Post
        </Button>
        <Button variant="outline" fullWidth icon={Zap} className="py-2.5 md:py-3">
          Boost Post
        </Button>
      </div>
    </div>
  );
};

export default ClubOwnerView;

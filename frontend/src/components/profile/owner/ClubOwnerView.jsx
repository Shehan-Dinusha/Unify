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
    <div className="flex flex-col gap-lg">
      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md items-stretch">
        {cards.map((card, idx) => (
          <ProfileDashboardCard key={idx} {...card} />
        ))}
      </div>

      {/* Verification Banner */}
      <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md">
        <div className="flex flex-col gap-xs">
          <h3 className="text-body-large-bold text-text-primary">
            {submitted ? "Club Verification" : "Start Verifying Your Club"}
          </h3>
          <p className="text-body-small text-text-secondary max-w-sm leading-relaxed">
            {submitted
              ? "Your verification document is under review by the admin team."
              : "Upload an official document that verifies your club's registration or university recognition."}
          </p>
        </div>
        <div className="flex items-center gap-sm flex-shrink-0">
          <Button
            variant="outline"
            size="small"
            onClick={handleVerificationClick}
          >
            {submitted ? "See Status" : "Start Verification"}
          </Button>
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
            <ShieldCheck
              size={18}
              className={submitted ? "text-state-success" : "text-primary-blue"}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-md">
        <Button variant="primary" fullWidth icon={Plus}>
          Create Post
        </Button>
        <Button variant="outline" fullWidth icon={Zap}>
          Boost Post
        </Button>
      </div>
    </div>
  );
};

export default ClubOwnerView;

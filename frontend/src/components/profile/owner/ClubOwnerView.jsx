import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../ProfileHeader";
import ProfileDashboardCard from "../ProfileDashboardCard";
import Button from "../../common/Button";
import { Plus, Zap, ShieldCheck } from "lucide-react";

/**
 * ClubOwnerView — dashboard cards, verification banner, and CTAs for club_society role.
 */
const ClubOwnerView = ({
  verificationStatus = "NOT_SUBMITTED",
  verificationReason,
}) => {
  const navigate = useNavigate();

  const isApproved = verificationStatus === "APPROVED";

  const handleVerificationClick = () => {
    navigate("/club-verification");
  };

  const statusConfigs = {
    NOT_SUBMITTED: {
      title: "Start Verifying Your Club",
      description:
        "Upload an official document that verifies your club's registration or university recognition.",
      buttonText: "Start Verification",
      iconColor: "text-primary-blue",
      buttonDisabled: false,
    },
    PENDING: {
      title: "Verification Pending",
      description: "Your verification is under review by the admin team.",
      buttonText: "See Status",
      iconColor: "text-state-warning",
      buttonDisabled: false,
    },
    REJECTED: {
      title: "Verification Rejected",
      description:
        verificationReason || "Verification rejected. Please resubmit documents.",
      buttonText: "Resubmit Verification",
      iconColor: "text-state-error",
      buttonDisabled: false,
    },
    APPROVED: {
      title: "Club Verified",
      description: "Your club is verified and all features are available.",
      buttonText: "View Status",
      iconColor: "text-state-success",
      buttonDisabled: false,
    },
  };

  const currentStatus =
    statusConfigs[verificationStatus] || statusConfigs.NOT_SUBMITTED;

  const cards = [
    {
      icon: "🔖",
      iconBg: "bg-purple-500/20",
      title: "My Posts",
      description: "View and manage your advertisements and updates.",
      path: "/my-posts",
      disabled: !isApproved,
    },
    {
      icon: "👥",
      iconBg: "bg-pink-500/20",
      title: "View Followers",
      description: "View people who follow you",
      path: "/club/followers",
      disabled: !isApproved,
    },
    {
      icon: "⊞",
      iconBg: "bg-blue-500/20",
      title: "View Boost Packages",
      description: "Explore packages to promote your listings.",
      disabled: !isApproved,
    },
    {
      icon: "🚀",
      iconBg: "bg-violet-500/20",
      title: "View Boosted Posts",
      description: "Track boosted posts and their performance.",
      disabled: !isApproved,
    },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-lg text-start">
      {/* Dashboard Cards Grid */}
      <div className={`grid grid-cols-2 sm:grid-cols-2 gap-3 md:gap-md items-stretch transition-all duration-300 ${!isApproved ? "opacity-50 pointer-events-none" : ""}`}>
        {cards.map((card, idx) => (
          <ProfileDashboardCard key={idx} {...card} />
        ))}
      </div>

      {/* Verification Banner */}
      <div className={`w-full rounded-2xl border border-white/10 bg-white/5 p-4 md:p-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-md transition-all duration-300 ${!isApproved && verificationStatus !== "APPROVED" ? "border-primary-blue/30 bg-primary-blue/5 shadow-lg shadow-primary-blue/5" : ""}`}>
        <div className="flex flex-col gap-xs">
          <h3 className="text-base md:text-body-large-bold text-text-primary">
            {currentStatus.title}
          </h3>
          <p className="text-[12px] md:text-body-small text-text-secondary max-w-sm leading-relaxed">
            {currentStatus.description}
          </p>
        </div>
        <div className="flex items-center gap-sm flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-start">
          <Button
            variant="outline"
            size="small"
            onClick={handleVerificationClick}
            disabled={currentStatus.buttonDisabled}
            className="flex-1 sm:flex-initial text-[12px] md:text-body-small py-1.5 md:py-2"
          >
            {currentStatus.buttonText}
          </Button>
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white/10 flex items-center justify-center">
            <ShieldCheck size={17} className={currentStatus.iconColor} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`flex flex-col sm:flex-row gap-3 md:gap-md transition-all duration-300 ${!isApproved ? "opacity-50 pointer-events-none" : ""}`}>
        <Button variant="primary" fullWidth icon={Plus} className="py-2.5 md:py-3" disabled={!isApproved}>
          Create Post
        </Button>
        <Button variant="outline" fullWidth icon={Zap} className="py-2.5 md:py-3" disabled={!isApproved}>
          Boost Post
        </Button>
      </div>
    </div>
  );
};

export default ClubOwnerView;

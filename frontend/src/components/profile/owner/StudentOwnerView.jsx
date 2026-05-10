import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../ProfileHeader";
import ProfileDashboardCard from "../ProfileDashboardCard";
import Button from "../../common/Button";
import { ShieldCheck } from "lucide-react";

const STORAGE_KEY = "unify_student_rep_submitted";

/**
 * StudentOwnerView — dashboard cards and actions for the student role owner view.
 */
const StudentOwnerView = ({ repStatus = "NOT_SUBMITTED", repReason }) => {
  const navigate = useNavigate();

  const handleVerificationClick = () => {
    navigate("/batch-rep-verification");
  };

  const statusConfigs = {
    NOT_SUBMITTED: {
      title: "Become a Rep",
      description:
        "Verify as a Batch Representative to access leadership tools.",
      buttonText: "Start Verification",
      iconColor: "text-primary-blue",
      buttonClass: "border-primary-blue text-primary-blue hover:bg-primary-light active:bg-primary-blue/20",
    },
    PENDING: {
      title: "Verification Pending",
      description: "Your verification document is under review.",
      buttonText: "See Status",
      iconColor: "text-state-warning",
      buttonClass: "border-state-warning text-state-warning hover:bg-state-warning/10 active:bg-state-warning/20",
    },
    REJECTED: {
      title: "Verification Rejected",
      description:
        repReason ||
        "Your request was declined. Please check details and resubmit.",
      buttonText: "See Status",
      iconColor: "text-state-error",
      buttonClass: "border-state-error text-state-error hover:bg-state-error/10 active:bg-state-error/20",
    },
    APPROVED: {
      title: "Batch Representative",
      description: "Verification complete. You have Rep privileges.",
      buttonText: "View Status",
      iconColor: "text-state-success",
      buttonClass: "border-state-success text-state-success hover:bg-state-success/10 active:bg-state-success/20",
    },
    REMOVED: {
      title: "Verification Removed",
      description:
        repReason || "Your batch rep status has been removed by the administration.",
      buttonText: "See Details",
      iconColor: "text-state-error",
      buttonClass: "border-state-error text-state-error hover:bg-state-error/10 active:bg-state-error/20",
    },
  };

  const currentStatus =
    statusConfigs[repStatus] || statusConfigs.NOT_SUBMITTED;

  const cards = [
    {
      icon: "🔖",
      iconBg: "bg-purple-500/20",
      title: "Saved Posts",
      description: "Access your bookmarked announcements and events.",
      path: "/my-saved-posts",
    },
    {
      icon: "🛒",
      iconBg: "bg-green-500/20",
      title: "Purchases",
      description: "View ticket history for campus events.",
      path: "/order-history",
    },
    {
      icon: "🔍",
      iconBg: "bg-orange-500/20",
      title: "Lost & Found",
      description: "Manage items you've posted as lost or found.",
      path: "/my-lost-and-found",
    },
    {
      icon: "👥",
      iconBg: "bg-pink-500/20",
      title: "Followed Clubs",
      description: "Updates from the societies you follow.",
      path: "/student/followings",
    },
    {
      icon: "⭐",
      iconBg: "bg-yellow-500/20",
      title: "My Reviews",
      description: "Access your all submitted reviews.",
      path: "/profile/reviews",
    },
    {
      icon: "📋",
      iconBg: "bg-blue-500/20",
      title: "My Reports",
      description: "Access your all submitted reports.",
      path: "/report-moderation",
    },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-lg">
      <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-md items-stretch">
        {cards.map((card, idx) => (
          <ProfileDashboardCard key={idx} {...card} />
        ))}
      </div>

      {/* Become a Rep Banner */}
      <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 md:p-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-md">
        <div className="flex flex-col gap-1 md:gap-xs text-start">
          <h3 className="text-base md:text-body-large-bold text-text-primary">
            {currentStatus.title}
          </h3>
          <p className="text-[12px] md:text-body-small text-text-secondary max-w-xs leading-relaxed">
            {currentStatus.description}
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-sm w-full sm:w-auto justify-between sm:justify-start">
          <Button
            variant="outline"
            size="small"
            className={`${currentStatus.buttonClass} flex-1 sm:flex-initial text-[12px] md:text-body-small py-1.5 md:py-2`}
            onClick={handleVerificationClick}
          >
            {currentStatus.buttonText}
          </Button>
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={17} className={currentStatus.iconColor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOwnerView;

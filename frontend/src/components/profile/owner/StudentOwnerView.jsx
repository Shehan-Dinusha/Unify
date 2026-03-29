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
const StudentOwnerView = () => {
  const navigate = useNavigate();

  // Read initial state from localStorage
  const [submitted, setSubmitted] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true"
  );

  const handleVerificationClick = () => {
    navigate("/batch-rep-verification");
  };

  const cards = [
    {
      icon: "🔖",
      iconBg: "bg-purple-500/20",
      title: "Saved Posts",
      description: "Access your bookmarked announcements and events.",
      path: "/news-feed",
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
      path: "/lost-and-found",
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
    <div className="flex flex-col gap-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md items-stretch">
        {cards.map((card, idx) => (
          <ProfileDashboardCard key={idx} {...card} />
        ))}
      </div>

      {/* Become a Rep Banner */}
      <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md">
        <div className="flex flex-col gap-xs">
          <h3 className="text-body-large-bold text-text-primary">
            Become a Rep
          </h3>
          <p className="text-body-small text-text-secondary max-w-xs">
            {submitted
              ? "Your verification document is under review."
              : "Verify as a Batch Representative to access leadership tools."}
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <Button
            variant="outline"
            size="small"
            onClick={handleVerificationClick}
          >
            {submitted ? "See Verification Status" : "Start Verification"}
          </Button>
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <ShieldCheck
              size={18}
              className={submitted ? "text-state-success" : "text-primary-blue"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOwnerView;

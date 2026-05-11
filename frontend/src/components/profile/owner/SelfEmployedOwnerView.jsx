import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../ProfileHeader";
import ProfileDashboardCard from "../ProfileDashboardCard";
import Button from "../../common/Button";
import { Plus, Zap } from "lucide-react";

/**
 * SelfEmployedOwnerView — dashboard cards and CTAs for self_employed role.
 */
const SelfEmployedOwnerView = () => {
  const cards = [
    {
      icon: "🔖",
      iconBg: "bg-purple-500/20",
      title: "My Posts",
      description: "View and manage your service advertisements and updates.",
      path: "/my-posts",
    },
    {
      icon: "⭐",
      iconBg: "bg-yellow-500/20",
      title: "My Reviews",
      description: "See feedback and ratings from student clients.",
      path: "/business/reviews",
    },
    {
      icon: "⊞",
      iconBg: "bg-blue-500/20",
      title: "View Boost Packages",
      description: "Explore packages to promote your services.",
    },
    {
      icon: "🚀",
      iconBg: "bg-violet-500/20",
      title: "View Boosted Posts",
      description: "Track boosted posts and their performance.",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 md:gap-lg text-start">
      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 md:gap-md items-stretch">
        {cards.map((card, idx) => (
          <ProfileDashboardCard key={idx} {...card} />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-md">
        <Button
          variant="primary"
          fullWidth
          icon={Plus}
          className="py-2.5 md:py-3 text-[13px] md:text-body-small"
          onClick={() => navigate("/services-owner/create-post")}
        >
          Create Post
        </Button>
        <Button
          variant="outline"
          fullWidth
          icon={Zap}
          className="py-2.5 md:py-3 text-[13px] md:text-body-small"
        >
          Boost Post
        </Button>
      </div>
    </div>
  );
};

export default SelfEmployedOwnerView;

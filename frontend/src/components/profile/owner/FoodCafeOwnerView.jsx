import React from "react";
import ProfileHeader from "../ProfileHeader";
import ProfileDashboardCard from "../ProfileDashboardCard";
import Button from "../../common/Button";
import { Plus, Zap } from "lucide-react";

/**
 * FoodCafeOwnerView — dashboard cards and CTAs for food_cafe role.
 */
const FoodCafeOwnerView = () => {
  const cards = [
    {
      icon: "🔖",
      iconBg: "bg-purple-500/20",
      title: "My Posts",
      description: "View and manage your boarding advertisements and updates.",
    },
    {
      icon: "⭐",
      iconBg: "bg-yellow-500/20",
      title: "My Reviews",
      description: "See feedback and ratings from student tenants.",
      path: "/business/reviews",
    },
    {
      icon: "⊞",
      iconBg: "bg-blue-500/20",
      title: "View Boost Packages",
      description: "Explore packages to promote your boarding listings.",
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

export default FoodCafeOwnerView;

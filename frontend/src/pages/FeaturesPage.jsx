import React from "react";
import LandingLayout from "../components/layout/LandingLayout";
import Card from "../components/common/Card";

const FeatureItem = ({ title, description, icon, iconBg }) => {
  return (
    <Card
      variant="card"
      className="h-full min-h-[220px] hover:border-primary-blue/40 hover:-translate-y-2 group"
    >
      <div className="flex flex-col justify-start items-start gap-5">
        {/* Icon Container using the specific bg color from design */}
        <div
          className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl ${iconBg}`}
        >
          <img
            src={icon}
            alt={title}
            className="w-6 h-6 object-contain block"
          />
        </div>

        <div className="flex flex-col items-start text-left gap-2">
          <h3 className="text-lg font-bold text-white leading-tight">
            {title}
          </h3>
          <p className="text-sm font-normal text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};

const FeaturesPage = () => {
  const features = [
    {
      title: "Real-Time Chat",
      description:
        "Communicate seamlessly within your clubs.Share updates, coordinate events, and keep members informed in one dedicated space.",
      icon: "icon_realtime_chat.svg",
      iconBg: "bg-pink-500/10",
    },
    {
      title: "Post Boosting",
      description:
        "Maximize your reach by boosting posts, events, and marketplace listings to a wider campus audience.",
      icon: "icon_post_boosting.svg",
      iconBg: "bg-pink-500/10",
    },
    {
      title: "Lost & Found",
      description:
        "Easily report lost items or browse found objects. Our system helps reunite students with belongings efficiently.",
      icon: "icon_lost_and_found.svg",
      iconBg: "bg-pink-500/10",
    },
    {
      title: "Marketplace",
      description:
        "Buy and sell textbooks, electronics, and dorm essentials securely within the trusted campus community.",
      icon: "icon_marketplace.svg",
      iconBg: "bg-pink-500/10",
    },
    {
      title: "Wallet System",
      description:
        "Experience a secure, integrated digital wallet for all your campus transactions, payments, and transfers.",
      icon: "icon_wallet_system.svg",
      iconBg: "bg-pink-500/10",
    },
    {
      title: "Learning Materials",
      description:
        "Access a vast library of shared notes, study guides, and learning materials to enhance your  performance.",
      icon: "icon_learning_materials.svg",
      iconBg: "bg-pink-500/10",
    },
  ];

  return (
    <LandingLayout>
      <section className="w-full flex flex-col items-center text-center mt-10 mb-20">
        <div className="relative">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-heading-display text-white tracking-tight leading-tight font-black font-inter">
            Platform Features
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-body-large-bold font-normal md:font-bold text-gray-400">
            Elevate your campus life
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1000px]">
          {features.map((feature, index) => (
            <FeatureItem key={index} {...feature} />
          ))}
        </div>
      </section>
    </LandingLayout>
  );
};

export default FeaturesPage;

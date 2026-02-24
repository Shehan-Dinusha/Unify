import React from "react";
import LandingLayout from "../components/layout/LandingLayout";
import { Check } from "lucide-react";

const PricingCard = ({ title, price, duration, description, features, isPopular = false, bestValue = false }) => {
  return (
    <div className={`relative w-full min-h-[420px] rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 flex flex-col ${isPopular ? "outline outline-1 outline-primary-blue shadow-[0px_0px_30px_rgba(43,140,238,0.3)] bg-white/5" : "border border-white/20 hover:border-white/40 bg-white/5"}`}>
      {/* Background Glass Effect - Removed absolute to fix stacking, used bg-white/5 on parent instead */}
      
      {/* Content */}
      <div className="relative z-10 p-8 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-white font-inter">{title}</h3>
          {bestValue && (
            <div className="bg-primary-blue/20 px-2 py-1 rounded">
              <span className="text-primary-blue text-[10px] font-bold uppercase tracking-wide">Best Value</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold text-white font-inter">Rs. {price}</span>
          <span className="ml-2 text-primary-blue text-sm font-bold font-inter">/ {duration}</span>
        </div>

        {/* Description */}
        <p className="text-text-tertiary text-xs font-normal font-inter mb-8 h-10 text-justify">
          {description}
        </p>

        {/* Features */}
        <div className="flex flex-col gap-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isPopular ? "bg-primary-blue" : "bg-primary-blue"}`}>
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <span className={`text-xs font-normal font-inter ${isPopular ? "text-white" : "text-gray-400"}`}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PricingPage = () => {
  const plans = [
    {
      title: "Starter",
      price: "1000",
      duration: "24 Hours",
      description: "Perfect for quick announcements or flash sales.",
      features: [
        "Standard Visibility",
        "Basic Analytics",
        "Feed Placement"
      ]
    },
    {
      title: "Growth",
      price: "2000",
      duration: "24 Hours",
      description: "Best balance of reach and duration for weekly promos.",
      features: [
        "2x Audience Reach",
        "Top of Category",
        "Detailed Analytics",
        "Priority Support"
      ],
      isPopular: true
    },
    {
      title: "Dominate",
      price: "4000",
      duration: "7 Days",
      description: "Maximize brand with a full week campaign.",
      features: [
        "Max Reach Potential",
        "Top of Feed Placement",
        "Highlighted Gold Border",
        "CRM Integration"
      ],
      bestValue: true
    }
  ];

  return (
    <LandingLayout>
      <section className="w-full flex flex-col items-center text-center mt-10 mb-20 relative">
        {/* Helper Note: Background orbs are inherited from LandingLayout, no local orbs needed to avoid double brightness */}

        {/* Hero Section */}
        <div className="relative z-10 px-4">
          <h1 className="text-white text-heading-display tracking-tight">
            Simple Pricing
          </h1>
          <p className="mt-4 text-body-large-bold text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your journey. From casual to professional networking.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1050px] z-10 px-4">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </section>
    </LandingLayout>
  );
};

export default PricingPage;

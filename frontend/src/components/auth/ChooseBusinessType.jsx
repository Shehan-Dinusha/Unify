import React from "react";
import { Home, Users, Utensils, UserCircle, ArrowLeft } from "lucide-react";
import Card from "../common/Card";

const ChooseBusinessType = ({ onSelect, onBack }) => {
  const businessTypes = [
    {
      id: "boarding",
      title: "Boarding Owner",
      description: "Manage housing and student accommodation efficiently.",
      icon: Home,
      color: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      id: "club",
      title: "Clubs & Societies",
      description: "Student groups, extracurriculars, and team management.",
      icon: Users,
      color: "bg-pink-500/10",
      iconColor: "text-pink-500",
    },
    {
      id: "cafe",
      title: "Food & Café",
      description: "On-campus dining, cafeterias, and snack bars.",
      icon: Utensils,
      color: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
    {
      id: "self-employed",
      title: "Self-employed",
      description: "Individual service providers and tutors.",
      icon: UserCircle,
      color: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <div className="w-full max-w-[1000px] flex flex-col items-center gap-16 pb-8 pt-0">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <h1 className="text-white text-3xl md:text-heading-large font-black font-inter tracking-tight leading-tight">
          Welcome to Unify.
          <br />
          Let&apos;s get you set up.
        </h1>
        <p className="text-text-secondary text-body-large max-w-[600px] leading-relaxed">
          Select the category that best describes your business or organization
          on campus.
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full items-stretch px-4">
        {businessTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className="w-full text-left transition-all active:scale-[0.98] outline-none group"
          >
            <Card
              variant="card"
              padding="p-0"
              className="h-full border-white/10 hover:border-primary-blue/40 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] bg-white/[0.03] transition-all duration-300"
            >
              <div className="flex items-center gap-6 p-8 h-full">
                <div
                  className={`w-20 h-20 ${type.color} rounded-2xl flex items-center justify-center ${type.iconColor} group-hover:scale-105 transition-transform shrink-0 shadow-lg`}
                >
                  <type.icon size={36} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-white text-heading-small font-bold">
                    {type.title}
                  </h3>
                  <p className="text-text-secondary text-body-small leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>

      {/* Navigation Section */}
      <div className="mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-tertiary hover:text-white transition-colors text-body-medium-bold"
        >
          <ArrowLeft size={20} />
          Back to account type
        </button>
      </div>
    </div>
  );
};

export default ChooseBusinessType;

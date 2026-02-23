import React from "react";
import LandingLayout from "../components/layout/LandingLayout";
import Card from "../components/common/Card";
import { ShieldCheck, Shield, Network } from "lucide-react";

const AboutPage = () => {
  return (
    <LandingLayout>
      <section className="w-full flex flex-col items-center text-center mt-10 mb-20">
        {/* Title */}
        <h1 className="text-heading-display text-white tracking-tight">
          About <span className="text-primary-blue">Unify</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-body-large-bold text-text-secondary max-w-[750px]">
          Unify is a purpose-built platform designed to bridge the gap between
          students, faculty, and university services, creating a seamless
          digital campus experience.
        </p>

        {/* Cards */}
        {/* Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1050px]">
          <FeatureCard
            icon={
              <img
                src="icon_verified_students.svg"
                alt="Verified Students"
                className="w-full h-full"
              />
            }
            title="Verified Students"
            description="Join a trusted community where every student is verified, ensuring a safe and authentic environment for collaboration. Connect with peers, share resources, and build meaningful academic relationships with confidence."
            noBackground={true}
          />

          <FeatureCard
            icon={
              <img
                src="icon_secure_platform.svg"
                alt="Secure Platform"
                className="w-full h-full"
              />
            }
            title="Secure Platform"
            description="Experience top-tier security with our robust platform designed to protect your personal data and institutional privacy. We prioritize your digital safety so you can focus on learning and socializing without worry."
            noBackground={true}
          />

          <FeatureCard
            icon={
              <img
                src="icon_all_in_one_hub.svg"
                alt="All-in-One Hub"
                className="w-full h-full"
              />
            }
            title="All-in-One Hub"
            description="Streamline your university life by accessing campus news, events, academic resources, and social groups in one place. Say goodbye to scattered information and hello to a centralized, efficient digital campus dashboard."
            noBackground={true}
          />
        </div>
      </section>
    </LandingLayout>
  );
};

const FeatureCard = ({ icon, title, description, noBackground = false }) => {
  return (
    <Card
      variant="card"
      className="h-full min-h-[420px] transition-all duration-300 hover:border-primary-blue/40 hover:-translate-y-2"
    >
      <div className="flex flex-col items-center h-full px-6 py-8">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shrink-0 ${
            noBackground ? "" : "bg-primary-blue/10"
          }`}
        >
          {icon}
        </div>

        {/* Title with min-height to align descriptions */}
        <div className="min-h-[64px] flex items-start justify-center w-full">
          <h3 className="text-heading-small text-white text-center leading-tight">
            {title}
          </h3>
        </div>

        {/* Description justified */}
        <p className="text-body-medium text-text-secondary text-center mt-2 leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
};

export default AboutPage;

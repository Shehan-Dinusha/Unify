import React from "react";
import { GraduationCap, Briefcase, CheckCircle2 } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";

const ChooseMainType = ({ onNext }) => {
  const studentFeatures = [
    "Access campus news, learning materials, and events",
    "Use Lost & Found with smart matching notifications",
    "Browse boardings, food & cafés, club merchandise, and services",
    "Interact with clubs, businesses, and fellow students",
  ];

  const businessFeatures = [
    "Create and manage service or event posts",
    "Promote boardings, food outlets, and club activities",
    "Receive reviews, ratings, and notifications",
    "Boost posts for higher visibility",
  ];

  return (
    <div className="w-full max-w-[1200px] flex flex-col items-center gap-8 md:gap-16 pb-8 pt-4">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <h1 className="text-white text-3xl md:text-heading-large font-black font-inter tracking-tight leading-tight">
          Choose Your Path.
        </h1>
        <p className="text-text-secondary text-body-large-bold max-w-[600px] leading-relaxed">
          Select the account type that best fits your needs to get started with
          the Unify platform.
        </p>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full items-stretch px-4">
        {/* Student Account Card */}
        <Card
          variant="card"
          padding="p-6 md:p-10"
          className="group h-full border-white/10 hover:border-primary-blue/40 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] bg-white/[0.03] transition-all duration-300"
        >
          <div className="h-full flex flex-col justify-between">
            <div className="flex flex-col">
              {/* Icon & Title Section */}
              <div className="flex flex-col gap-6">
                <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center text-primary-blue group-hover:scale-110 transition-transform">
                  <GraduationCap size={40} />
                </div>

                <div className="flex flex-col gap-3">
                  <h2 className="text-white text-heading-medium font-bold">
                    Student Account
                  </h2>
                  <p className="text-text-secondary text-body-medium leading-relaxed max-w-sm">
                    Connect with your university community and explore campus
                    services directly.
                  </p>
                </div>
              </div>

              {/* Features List Section */}
              <div className="mt-8">
                <ul className="flex flex-col space-y-4">
                  {studentFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2
                        size={18}
                        className="text-primary-blue shrink-0"
                      />
                      <span className="text-text-secondary text-body-small leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Button Section */}
            <div className="mt-10 pt-6 border-t border-white/5">
              <Button
                variant="outline"
                fullWidth
                onClick={() => onNext("student")}
                className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white transition-all shadow-custom-shadow !py-4"
              >
                Join as Student
              </Button>
            </div>
          </div>
        </Card>

        {/* Business Account Card */}
        <Card
          variant="card"
          padding="p-6 md:p-10"
          className="group h-full border-white/10 hover:border-primary-blue/40 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] bg-white/[0.03] transition-all duration-300"
        >
          <div className="h-full flex flex-col justify-between">
            <div className="flex flex-col">
              {/* Icon & Title Section */}
              <div className="flex flex-col gap-6">
                <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center text-primary-blue group-hover:scale-110 transition-transform">
                  <Briefcase size={40} />
                </div>

                <div className="flex flex-col gap-3">
                  <h2 className="text-white text-heading-medium font-bold">
                    Business & Organization
                  </h2>
                  <p className="text-text-secondary text-body-medium leading-relaxed max-w-sm">
                    Promote services, share updates, and engage effectively with
                    university students.
                  </p>
                </div>
              </div>

              {/* Features List Section */}
              <div className="mt-8">
                <ul className="flex flex-col space-y-4">
                  {businessFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2
                        size={18}
                        className="text-primary-blue shrink-0"
                      />
                      <span className="text-text-secondary text-body-small leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Button Section */}
            <div className="mt-10 pt-6 border-t border-white/5">
              <Button
                variant="outline"
                fullWidth
                onClick={() => onNext("business")}
                className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white transition-all shadow-custom-shadow !py-4"
              >
                Join as Business
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChooseMainType;

import React from "react";
import ProfileHeader from "../ProfileHeader";
import AboutSection from "../AboutSection";
import RecentPostsSection from "./RecentPostsSection";
import Card from "../../common/Card";

/**
 * StudentPublicView — read-only public view for a student profile.
 */
const StudentPublicView = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-x-lg md:gap-y-md items-start text-start">
      {/* Left — Profile Card */}
      <div className="md:row-span-1">
        <ProfileHeader profile={profile} isPublic={true} />
      </div>

      {/* Right — Top Sections (Details) */}
      <div className="flex flex-col gap-4 md:gap-md">
        {/* Quick Info */}
        {(profile?.batch || profile?.faculty) && (
          <Card variant="container" padding="p-4 md:p-lg">
            <h3 className="text-base md:text-body-large-bold text-text-primary mb-3 md:mb-md">
              Details
            </h3>
            <div className="flex flex-col gap-2.5 md:gap-sm">
              {profile.batch && (
                <div className="flex items-center gap-sm">
                  <span className="text-[12px] md:text-body-small text-text-secondary w-20 md:w-24 flex-shrink-0">
                    Batch
                  </span>
                  <span className="text-[12px] md:text-body-small-bold text-text-primary font-bold">
                    {profile.batch}
                  </span>
                </div>
              )}
              {profile.faculty && (
                <div className="flex items-center gap-sm">
                  <span className="text-[12px] md:text-body-small text-text-secondary w-20 md:w-24 flex-shrink-0">
                    Faculty
                  </span>
                  <span className="text-[12px] md:text-body-small-bold text-text-primary font-bold">
                    {profile.faculty}
                  </span>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Row — Full Width Sections */}
      <div className="md:col-span-2 mt-4 md:mt-lg flex flex-col gap-4 md:gap-md">
        {/* Recent Post Feed */}
        <RecentPostsSection posts={profile?.posts} />
      </div>
    </div>
  );
};

export default StudentPublicView;

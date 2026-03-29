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
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-x-lg gap-y-md items-start">
      {/* Left — Profile Card */}
      <div className="md:row-span-1">
        <ProfileHeader profile={profile} />
      </div>

      {/* Right — Top Sections (Details) */}
      <div className="flex flex-col gap-md">
        {/* Quick Info */}
        {(profile?.batch || profile?.faculty) && (
          <Card variant="container" padding="p-lg">
            <h3 className="text-body-large-bold text-text-primary mb-md">
              Details
            </h3>
            <div className="flex flex-col gap-sm">
              {profile.batch && (
                <div className="flex items-center gap-sm">
                  <span className="text-body-small text-text-secondary w-24 flex-shrink-0">
                    Batch
                  </span>
                  <span className="text-body-small-bold text-text-primary">
                    {profile.batch}
                  </span>
                </div>
              )}
              {profile.faculty && (
                <div className="flex items-center gap-sm">
                  <span className="text-body-small text-text-secondary w-24 flex-shrink-0">
                    Faculty
                  </span>
                  <span className="text-body-small-bold text-text-primary">
                    {profile.faculty}
                  </span>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Row — Full Width Sections */}
      <div className="md:col-span-2 flex flex-col gap-md">
        {/* About */}
        <AboutSection description={profile?.description} />

        {/* Recent Post Feed */}
        <RecentPostsSection posts={profile?.posts} />
      </div>
    </div>
  );
};

export default StudentPublicView;

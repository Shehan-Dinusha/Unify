import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import { Flag } from "lucide-react";

/**
 * ProfileHeader — left-side profile card shown on both owner and public views.
 * Props:
 *  profile: { name, subtitle, badge, description, profileImage, id }
 *  isPublic: boolean - if true, shows public actions like Report
 */
const ProfileHeader = ({ profile, isPublic = false, className = "" }) => {
  const navigate = useNavigate();
  const {
    id,
    name = "User",
    subtitle = "",
    badge = "",
    profileImage,
  } = profile || {};

  const avatarSrc =
    profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2666F1&color=fff`;

  const handleReport = () => {
    navigate("/student/report-issue", {
      state: { 
        postData: { 
          authorId: id, 
          author: name,
          title: `Profile: ${name}`,
          type: 'user'
        }, 
        from: window.location.pathname 
      },
    });
  };

  return (
    <Card variant="container" padding="p-4 md:p-md" className={className}>
      {/* Inner wrapper — centers everything both axes */}
      <div className="flex flex-col items-center justify-center text-center gap-2 md:gap-3 h-full">
        {/* Avatar */}
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-primary-blue/30 shadow-lg flex-shrink-0">
          <img
            src={avatarSrc}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name */}
        <h2 className="text-[17px] md:text-heading-small text-text-primary font-bold leading-tight">
          {name}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-[12px] md:text-body-small text-text-secondary leading-snug -mt-0.5 md:-mt-1">
            {subtitle}
          </p>
        )}

        {/* Badge */}
        {badge && (
          <span className="inline-block px-2.5 py-0.5 md:px-3 md:py-1 rounded-full border border-primary-blue/40 text-primary-blue text-[10px] md:text-body-extra-small-bold bg-primary-blue/10">
            {badge}
          </span>
        )}

        {/* Public Actions */}
        {isPublic && (
          <div className="w-full mt-4 flex flex-col gap-2">
            <button
              onClick={handleReport}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-state-error/10 text-state-error border border-state-error/20 hover:bg-state-error/20 transition-all text-[12px] font-bold"
            >
              <Flag size={14} />
              Report Profile
            </button>
          </div>
        )}

        {/* Description — Removed for all roles as requested */}
      </div>
    </Card>
  );
};

export default ProfileHeader;

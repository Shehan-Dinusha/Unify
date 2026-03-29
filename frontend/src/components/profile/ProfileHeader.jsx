import React from "react";
import Card from "../common/Card";

/**
 * ProfileHeader — left-side profile card shown on both owner and public views.
 * Props:
 *  profile: { name, subtitle, badge, description, profileImage }
 */
const ProfileHeader = ({ profile, className = "" }) => {
  const {
    name = "User",
    subtitle = "",
    badge = "",
    description = "",
    profileImage,
  } = profile || {};

  const avatarSrc =
    profileImage ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

  return (
    <Card variant="container" padding="p-md" className={className}>
      {/* Inner wrapper — centers everything both axes */}
      <div className="flex flex-col items-center justify-center text-center gap-3 h-full">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-blue/30 shadow-lg flex-shrink-0">
          <img
            src={avatarSrc}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name */}
        <h2 className="text-heading-small text-text-primary font-bold leading-tight">
          {name}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-body-small text-text-secondary leading-snug -mt-1">
            {subtitle}
          </p>
        )}

        {/* Badge */}
        {badge && (
          <span className="inline-block px-3 py-1 rounded-full border border-primary-blue/40 text-primary-blue text-body-extra-small-bold bg-primary-blue/10">
            {badge}
          </span>
        )}

        {/* Description */}
        {description && (
          <p className="text-body-extra-small text-text-tertiary leading-relaxed max-w-[200px]">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
};

export default ProfileHeader;

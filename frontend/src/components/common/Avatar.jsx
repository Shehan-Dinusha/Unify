import React, { useState } from "react";

/**
 * A resilient Avatar component.
 * Fallbacks cleanly to a generated initial avatar if the image fails to load.
 *
 * @param {string} src - The avatar image URL
 * @param {string} alt - Alt text (usually the user's name)
 * @param {string} className - Optional Tailwind classes to merge
 */
const Avatar = ({ src, alt, className = "" }) => {
  const [hasError, setHasError] = useState(false);

  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    alt || "User",
  )}&background=2666F1&color=fff`;

  return (
    <img
      className={`object-cover ${className}`}
      src={hasError || !src ? fallbackUrl : src}
      alt={alt}
      onError={() => setHasError(true)}
    />
  );
};

export default Avatar;

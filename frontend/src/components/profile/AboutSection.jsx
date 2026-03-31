import React from "react";
import Card from "../common/Card";

/**
 * AboutSection — shows the profile description/bio.
 * Props:
 *  description: string
 *  title: string (optional, default "About")
 */
const AboutSection = ({ description, title = "About" }) => {
  if (!description) return null;

  return (
    <Card variant="container" padding="p-4 md:p-lg">
      <h3 className="text-base md:text-body-large-bold text-text-primary mb-2 md:mb-sm">{title}</h3>
      <p className="text-[13px] md:text-body-small text-text-secondary leading-relaxed">
        {description}
      </p>
    </Card>
  );
};

export default AboutSection;

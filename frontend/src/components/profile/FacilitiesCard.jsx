import React from "react";
import Card from "../common/Card";
import { CheckCircle } from "lucide-react";

/**
 * FacilitiesCard — shows a list of facilities/features for public profiles.
 * Props:
 *  title: string (section title, defaults to "Facilities")
 *  items: string[]
 */
const FacilitiesCard = ({ title = "Facilities", items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <Card variant="container" padding="p-4 md:p-lg">
      <h3 className="text-base md:text-body-large-bold text-text-primary mb-3 md:mb-md text-start">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-sm text-start">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-sm">
            <CheckCircle
              size={15}
              className="text-state-success flex-shrink-0"
            />
            <span className="text-[13px] md:text-body-small text-text-secondary">{item}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FacilitiesCard;

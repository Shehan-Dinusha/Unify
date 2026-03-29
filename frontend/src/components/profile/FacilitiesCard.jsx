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
    <Card variant="container" padding="p-lg">
      <h3 className="text-body-large-bold text-text-primary mb-md">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-sm">
            <CheckCircle
              size={16}
              className="text-state-success flex-shrink-0"
            />
            <span className="text-body-small text-text-secondary">{item}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FacilitiesCard;

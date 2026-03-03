import React from "react";
import { ChevronDown } from "lucide-react";
import Button from "./Button";

const LoadMoreButton = ({
  visibleCount,
  totalCount,
  onClick,
  itemName = "Reviews",
  className = "py-6 flex justify-center items-center pb-12",
}) => {
  if (visibleCount >= totalCount) return null;

  return (
    <div className={className}>
      <Button
        variant="ghost-hoverless"
        className="flex items-center justify-center gap-2 group w-full sm:w-auto"
        onClick={onClick}
      >
        <span className="text-gray-400 text-sm font-bold font-inter group-hover:text-white transition-colors">
          Load more {itemName}
        </span>
        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      </Button>
    </div>
  );
};

export default LoadMoreButton;

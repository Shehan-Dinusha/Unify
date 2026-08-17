import SkeletonBlock from "./SkeletonBlock";

const SkeletonText = ({ lines = 1, widths, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBlock
        key={i}
        height="h-4"
        width={widths?.[i] || (i === lines - 1 ? "w-3/4" : "w-full")}
      />
    ))}
  </div>
);

export default SkeletonText;

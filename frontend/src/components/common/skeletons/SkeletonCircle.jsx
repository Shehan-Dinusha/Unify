const SkeletonCircle = ({ size = "w-10 h-10", className = "" }) => (
  <div
    className={`bg-white/10 animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-full shrink-0 ${size} ${className}`}
  />
);

export default SkeletonCircle;

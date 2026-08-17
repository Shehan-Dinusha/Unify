const SkeletonBlock = ({ width, height, className = "", rounded = "rounded" }) => (
  <div
    className={`bg-white/10 animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-white/10 via-white/20 to-white/10 ${rounded} ${className}`}
    style={{ width, height }}
  />
);

export default SkeletonBlock;

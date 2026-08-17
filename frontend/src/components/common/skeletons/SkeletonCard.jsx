import Card from "../Card";

const SkeletonCard = ({ variant = "card", padding = "p-lg", className = "", children }) => (
  <Card variant={variant} padding={padding} className={`animate-pulse ${className}`}>
    {children}
  </Card>
);

export default SkeletonCard;

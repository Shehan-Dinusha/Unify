export const formatRelativeDate = (dateStringOrObject) => {
  const now = new Date();
  const targetDate = new Date(dateStringOrObject);
  const diffInMs = now - targetDate;
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInMins < 1) {
    return "Just now";
  } else if (diffInMins < 60) {
    return `${diffInMins} min${diffInMins > 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInHours < 48) {
    return "Yesterday";
  } else {
    return targetDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

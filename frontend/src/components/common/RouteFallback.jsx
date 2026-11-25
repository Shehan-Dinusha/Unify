import React from "react";

const RouteFallback = () => (
  <div
    className="flex min-h-screen items-center justify-center bg-dark-1"
    role="status"
    aria-label="Loading"
  >
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-blue/20 border-t-primary-blue" />
  </div>
);

export default RouteFallback;

import React from "react";
import { useRouteError, Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const NotFound = ({ status, customTitle, customSubtitle, customMessage }) => {
  const error = useRouteError();
  if (error) console.error(error);

  let errorCode = status || error?.status;

  let title = customTitle || "Oops!";
  let subtitle = customSubtitle || "Something went wrong.";
  let message = customMessage || "An unexpected error has occurred.";

  if (!customTitle && !customSubtitle && !customMessage) {
    if (errorCode === 401) {
      title = "401";
      subtitle = "Unauthorized";
      message = "Please log in to access this page.";
    } else if (errorCode === 403) {
      title = "403";
      subtitle = "Access Denied";
      message = "You do not have permission to access this page.";
    } else if (errorCode === 404) {
      title = "404";
      subtitle = "Page Not Found";
      message = "The page you are looking for doesn't exist or has been moved.";
    } else if (error?.statusText || error?.message) {
      message = error.statusText || error.message;
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-slate-800 relative overflow-hidden flex items-center justify-center font-inter p-4">
      {/* Background Blurs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center gap-6 z-10 w-full max-w-lg">
        <Card
          variant="card"
          className="w-full text-center"
          padding="p-8 sm:p-12"
        >
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 ring-4 ring-red-500/5">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>

          <h1 className="text-5xl font-bold text-white mb-2">{title}</h1>
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            {subtitle}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-8">
            {message}
          </p>

          <Link to="/" className="w-full block">
            <Button
              variant="primary"
              className="w-full h-12 rounded-xl shadow-lg shadow-primary-blue/25 flex items-center justify-center gap-2 group text-base"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;

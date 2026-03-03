import React, { useEffect } from "react";
import { Check, X } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

const SuccessMessage = ({
  title = "Password Change Successfully",
  message = "Your password has been updated successfully. Please use your new password the next time you log in.",
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Strict fix to screen
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    const container = document.querySelector(".bg-app-bg");
    const main = document.querySelector("main");

    if (container) {
      container.style.height = "100vh";
      container.style.overflow = "hidden";
    }
    if (main) {
      main.style.overflow = "hidden";
      main.style.display = "flex";
      main.style.flexDirection = "column";
      main.style.justifyContent = "center";
    }

    // Restore on unmount
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
      if (container) {
        container.style.height = "auto";
        container.style.overflow = "visible";
      }
      if (main) {
        main.style.overflow = "visible";
      }
    };
  }, []);

  return (
    <Card
      variant="card"
      className="w-full max-w-[480px] relative overflow-hidden"
    >
      <button
        onClick={() => navigate("/login")}
        className="absolute right-6 top-6 text-text-tertiary hover:text-white transition-colors z-10"
      >
        <X size={24} />
      </button>

      <div className="flex flex-col items-center gap-10 py-10">
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10">
            <div className="w-10 h-10 rounded-full border-2 border-primary-blue flex items-center justify-center border-opacity-50">
              <Check className="text-primary-blue w-6 h-6" strokeWidth={3} />
            </div>
          </div>

          <div className="flex flex-col gap-2 text-center w-full px-4">
            <h2 className="text-white text-heading-small">{title}</h2>
            <p className="text-text-secondary text-body-small leading-relaxed max-w-[360px] mx-auto">
              {message}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={() => navigate("/login")}
          className="shadow-[0px_4px_6px_-4px_rgba(43,140,238,0.25)]"
        >
          Done
        </Button>
      </div>
    </Card>
  );
};

export default SuccessMessage;

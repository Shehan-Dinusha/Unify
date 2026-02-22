import React from "react";
import { Check, X } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

const SuccessMessage = () => {
  const navigate = useNavigate();

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
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center overflow-hidden">
            <div className="w-10 h-10 rounded-full border-2 border-primary-blue flex items-center justify-center border-opacity-50">
              <Check className="text-primary-blue w-6 h-6" strokeWidth={3} />
            </div>
          </div>

          <div className="flex flex-col gap-2 text-center w-full px-4">
            <h2 className="text-white text-body-large-bold leading-8">
              Password Change Successfully
            </h2>
            <p className="text-gray-400 text-body-small-bold leading-5 px-4 leading-relaxed max-w-[360px] mx-auto">
              Your password has been updated successfully. Please use your new
              password the next time you log in.
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

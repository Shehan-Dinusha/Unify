import React from "react";
import { ArrowLeftRight, X, Plus } from "lucide-react";
import Button from "../../common/Button";

/**
 * SwitchAccountModal — shows linked accounts and allows switching.
 * Props:
 *  onClose: function
 *  currentUser: { name, role }
 */
const SwitchAccountModal = ({ onClose, currentUser }) => {
  // Mock linked accounts
  const accounts = [
    {
      id: 1,
      name: currentUser?.name || "Alex Johnson",
      role: currentUser?.role || "student",
      active: true,
    },
  ];

  const roleLabels = {
    student: "Student",
    boarding_owner: "Boarding Owner",
    club_society: "Clubs & Societies",
    food_cafe: "Food & Cafe",
    self_employed: "Self Employed",
    admin: "Admin",
    business: "Business",
    club: "Club",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-md"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-dark-1/80 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-dark-2 border border-white/10 rounded-3xl p-xl shadow-custom-shadow animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-md right-md text-text-tertiary hover:text-text-primary transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-sm mb-xl">
          <ArrowLeftRight size={22} className="text-primary-blue" />
          <h2 className="text-heading-small text-text-primary font-bold">
            Switch Account
          </h2>
        </div>

        {/* Account list */}
        <div className="flex flex-col gap-sm mb-lg">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className={`flex items-center gap-md p-md rounded-2xl border transition-colors ${
                acc.active
                  ? "border-primary-blue/40 bg-primary-blue/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer"
              }`}
            >
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(acc.name)}`}
                alt={acc.name}
                className="w-10 h-10 rounded-full border border-white/20"
              />
              <div className="flex-1 min-w-0">
                <p className="text-body-medium-bold text-text-primary truncate">
                  {acc.name}
                </p>
                <p className="text-body-extra-small text-text-secondary">
                  {roleLabels[acc.role] || acc.role}
                </p>
              </div>
              {acc.active && (
                <span className="text-body-extra-small-bold text-primary-blue bg-primary-blue/20 px-sm py-xs rounded-full flex-shrink-0">
                  Active
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Add account */}
        <Button variant="outline" fullWidth icon={Plus}>
          Add Another Account
        </Button>
      </div>
    </div>
  );
};

export default SwitchAccountModal;

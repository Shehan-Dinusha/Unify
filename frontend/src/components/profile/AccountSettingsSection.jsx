import React from "react";
import { UserCog, ShieldCheck, Users, Trash2 } from "lucide-react";

/**
 * AccountSettingsSection — renders the account settings list for owner profile.
 * Props:
 *  onEditProfile: function
 *  onSecurity: function (navigate to security page)
 *  onSwitchAccount: function
 *  onDeleteAccount: function
 */
const AccountSettingsSection = ({
  onEditProfile,
  onSecurity,
  onSwitchAccount,
  onDeleteAccount,
  disabled = false,
}) => {
  const items = [
    {
      icon: UserCog,
      label: "Edit Profile",
      desc: "Update your name, email address, and personal information.",
      action: onEditProfile,
      danger: false,
    },
    {
      icon: ShieldCheck,
      label: "Security & Password",
      desc: "Manage your passwords",
      action: onSecurity,
      danger: false,
    },
    {
      icon: Users,
      label: "Switch Account",
      desc: "Switch between your saved accounts",
      action: onSwitchAccount,
      danger: false,
    },
    {
      icon: Trash2,
      label: "Delete Account",
      desc: "Permanently delete your account",
      action: onDeleteAccount,
      danger: true,
    },
  ];

  return (
    <div
      className={`flex flex-col gap-3 md:gap-md text-start transition-all duration-300 ${
        disabled ? "pointer-events-none opacity-50" : ""
      }`}
    >
      {/* Section Header */}
      <div className="flex items-center gap-2 md:gap-sm">
        <UserCog size={18} className="text-primary-blue" />
        <h2 className="text-base md:text-heading-small text-text-primary font-bold">
          Account Settings
        </h2>
      </div>

      {/* Settings List */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={item.action}
              className={`w-full flex items-center gap-3 md:gap-md p-3.5 md:p-md hover:bg-white/5 transition-colors text-left ${
                idx !== items.length - 1 ? "border-b border-white/10" : ""
              }`}
              disabled={disabled}
            >
              {/* Icon bubble */}
              <div
                className={`w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.danger ? "bg-state-error/10" : "bg-white/10"
                }`}
              >
                <Icon
                  size={16}
                  className={
                    item.danger ? "text-state-error" : "text-text-secondary"
                  }
                />
              </div>
              {/* Text */}
              <div className="flex flex-col gap-1 md:gap-xs min-w-0">
                <span
                  className={`text-[13px] md:text-body-medium-bold font-bold ${
                    item.danger ? "text-state-error" : "text-text-primary"
                  }`}
                >
                  {item.label}
                </span>
                <span className="text-[11px] md:text-body-extra-small text-text-secondary line-clamp-1">
                  {item.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AccountSettingsSection;

import React from "react";
import { Users, X, Check, Plus, Trash2 } from "lucide-react";
import Button from "../../common/Button";
import Card from "../../common/Card";
import Avatar from "../../common/Avatar";

/**
 * Generates compact subtitle:
 * e.g. "Student • Information Technology", "Business • Food & Cafe"
 */
const getAccountSubtitle = (user) => {
  if (!user) return "";
  const role = user.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
    : "";
  if (role === "Student") {
    const detail =
      user.faculty ||
      user.department ||
      user.subtitle ||
      "Information Technology";
    return detail.toLowerCase().includes("student")
      ? detail
      : `Student • ${detail}`;
  }
  if (role === "Business") {
    const cat = user.category?.toUpperCase();
    let catLabel = "Organization";
    if (cat === "FOOD") catLabel = "Food & Cafe";
    else if (cat === "BOARDING") catLabel = "Boarding Owner";
    else if (cat === "SELF_EMPLOYED") catLabel = "Services Provider";
    return `Business • ${catLabel}`;
  }
  if (role === "Club") {
    return "Club & Society";
  }
  return role;
};

/**
 * SwitchAccountModal — displays only locally saved device sessions.
 * Source of truth: localStorage.savedAccounts (browser/device-specific).
 * Accounts must be explicitly added on each browser/device via Add Account.
 */
const SwitchAccountModal = ({
  savedAccounts = [],
  activeUserId,
  onClose,
  onSelectAccount,
  onAddAccount,
  onRemoveAccount,
}) => {
  // Build account list solely from local device sessions
  const accounts = savedAccounts.map((acc) => ({
    id: acc.id,
    user: acc.user || {},
  }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-dark-1/80 backdrop-blur-md" />

      {/* Modal Card */}
      <Card
        variant="card"
        className="w-full max-w-[480px] !bg-dark-2 !backdrop-blur-none !border-white/10 !shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden"
        padding="p-lg md:p-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-md right-md text-text-tertiary hover:text-text-primary transition-colors p-1.5 rounded-xl hover:bg-white/5"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-md mb-lg">
          <div className="w-12 h-12 rounded-2xl bg-primary-blue/10 border border-primary-blue/20 flex items-center justify-center flex-shrink-0">
            <Users size={24} className="text-primary-blue" />
          </div>
          <div>
            <h2 className="text-heading-small text-text-primary font-bold">
              Switch Account
            </h2>
            <p className="text-body-extra-small text-text-secondary">
              Switch between your saved accounts on this device
            </p>
          </div>
        </div>

        {/* Account List — Compact Horizontal Cards */}
        <div className="flex flex-col gap-3 max-h-[340px] overflow-y-auto pr-1 mb-lg custom-scrollbar">
          {accounts.map((acc) => {
            const isActive = String(acc.id) === String(activeUserId);
            const user = acc.user;
            const displayName = user.name || "Unify User";
            const email = user.email || user.phone || "No contact info";
            const subtitle = getAccountSubtitle(user);

            return (
              <div
                key={acc.id}
                onClick={() => !isActive && onSelectAccount(acc.id)}
                className={`group w-full flex items-center justify-between p-3.5 md:p-4 rounded-2xl border transition-all duration-200 text-left ${
                  isActive
                    ? "bg-white/10 border-white/20 shadow-md"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer"
                }`}
              >
                {/* Small Circular Avatar + User Info */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
                  <Avatar
                    src={user.avatar}
                    alt={displayName}
                    className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-white/10"
                  />

                  <div className="flex flex-col min-w-0">
                    <span className="text-body-medium-bold font-bold text-text-primary truncate">
                      {displayName}
                    </span>
                    <span className="text-body-extra-small text-text-secondary truncate">
                      {email}
                    </span>
                    <span className="text-body-extra-small font-semibold text-primary-blue truncate mt-0.5">
                      {subtitle}
                    </span>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {isActive ? (
                    <div className="flex items-center gap-1.5 text-primary-blue text-body-small-bold font-bold px-3 py-1 rounded-full bg-primary-blue/10 border border-primary-blue/20">
                      <Check size={16} />
                      <span>Active</span>
                    </div>
                  ) : (
                    onRemoveAccount && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveAccount(acc.id);
                        }}
                        className="p-2 text-text-tertiary hover:text-amber-400 hover:bg-white/5 rounded-xl transition-colors"
                        title="Remove saved session from this device"
                      >
                        <Trash2 size={17} />
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}

          {accounts.length === 0 && (
            <div className="text-center py-6 text-text-secondary text-body-small">
              No saved accounts on this device.
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col gap-sm">
          <Button
            variant="outline"
            fullWidth
            onClick={onAddAccount}
            className="rounded-2xl py-3 border-white/10 hover:border-primary-blue/40 flex items-center justify-center gap-2 text-text-primary hover:text-primary-blue font-bold"
          >
            <Plus size={18} />
            <span>Add Account</span>
          </Button>

          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
            className="rounded-2xl py-2.5"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SwitchAccountModal;

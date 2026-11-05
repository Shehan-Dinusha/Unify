import { useState } from "react";
import { Phone, Inbox, Copy, Check } from "lucide-react";
import { useToast } from "../common/Toast";

/**
 * Owner-only panel listing the claim / "I found this" requests for a post,
 * including each requester's contact number.
 */
const ClaimRequestsPanel = ({ claims, isLost }) => {
  const list = claims || [];
  const toast = useToast();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyNumber = async (id, number) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedId(id);
      toast?.success?.("Contact number copied to clipboard!");
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2000);
    } catch {
      // Fallback if clipboard API is unavailable
    }
  };

  const avatarFor = (claimant) =>
    !claimant.avatar || claimant.avatar.includes("placehold") || claimant.avatar.includes("dicebear")
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(claimant.name || "User")}&background=2666F1&color=fff`
      : claimant.avatar;

  return (
    <div id="claim-requests" className="rounded-2xl border border-primary-blue/30 bg-primary-blue/5 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-text-primary">
          <Inbox size={18} className="text-primary-blue" />
          <span className="text-body-medium-bold">
            {isLost ? "People Who Found This" : "Claim Requests"}
          </span>
        </div>
        <span className="text-[10px] font-bold text-primary-blue bg-primary-blue/10 px-2 py-0.5 rounded-md">
          {list.length}
        </span>
      </div>

      {list.length === 0 ? (
        <p className="text-body-small text-text-secondary">
          No requests yet. You&apos;ll get a notification when someone responds to your post.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((claim) => (
            <div key={claim.id} className="bg-dark-3 rounded-xl p-3.5 border border-white/5 flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <img
                  src={avatarFor(claim.claimant)}
                  alt={claim.claimant.name}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-body-small-bold text-text-primary truncate">{claim.claimant.name}</span>
                  <span className="text-body-extra-small text-text-tertiary">{claim.time}</span>
                </div>
              </div>

              <p className="text-body-small text-text-secondary leading-relaxed whitespace-pre-line break-words">
                {claim.description}
              </p>

              <button
                type="button"
                onClick={() => handleCopyNumber(claim.id, claim.contactNumber)}
                title="Click to copy contact number"
                className="self-start flex items-center gap-2 text-body-small-bold text-white bg-primary-blue hover:brightness-110 active:scale-95 px-3 py-2 rounded-lg transition-all"
              >
                <Phone size={14} />
                <span>{claim.contactNumber}</span>
                {copiedId === claim.id ? (
                  <Check size={14} className="opacity-90" />
                ) : (
                  <Copy size={13} className="opacity-75" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClaimRequestsPanel;

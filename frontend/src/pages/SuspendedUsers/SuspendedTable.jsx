import { ShieldAlert } from "lucide-react";
import Badge from "../../components/common/Badge";
import { getAvatarUrl } from "../../utils/formatters";
import { formatDate } from "./useSuspendedUsers";
import SkeletonRow from "./SkeletonRow";

const COLS = "2fr 1.2fr 1fr 1fr";

const SuspendedTable = ({ users, usersLoading, error, onViewProfile }) => (
  <div className="relative overflow-hidden border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm mb-lg hidden md:block">
    <div className="grid gap-md px-lg py-md border-b border-white/10" style={{ gridTemplateColumns: COLS }}>
      <span className="text-body-small-bold text-text-secondary">User Details</span>
      <span className="text-body-small-bold text-text-secondary">Suspension Date</span>
      <span className="text-body-small-bold text-text-secondary">Reason</span>
      <span className="text-body-small-bold text-text-secondary text-right">Actions</span>
    </div>

    {usersLoading && (
      <>
        <SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow />
      </>
    )}

    {!usersLoading && !error && users.length === 0 && (
      <div className="px-lg py-xl text-center">
        <ShieldAlert size={40} className="text-text-tertiary mx-auto mb-md" />
        <p className="text-body-medium-bold text-text-secondary font-inter">No suspended users found</p>
        <p className="text-body-extra-small text-text-tertiary font-inter mt-xs">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    )}

    {!usersLoading && users.map((user, idx) => (
      <div
        key={user.id}
        className={`grid gap-md px-lg py-md items-center hover:bg-white/5 transition-colors ${idx < users.length - 1 ? "border-b border-white/5" : ""}`}
        style={{ gridTemplateColumns: COLS }}
      >
        <div className="flex items-center gap-md min-w-0">
          <img src={getAvatarUrl(user.avatar, user.name)} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0" />
          <div className="min-w-0">
            <p className="text-body-medium-bold text-text-primary truncate">{user.name || "Unknown User"}</p>
            <p className="text-body-extra-small text-text-secondary truncate">{user.email || "—"}</p>
          </div>
        </div>
        <div>
          <p className="text-body-small text-text-secondary">{formatDate(user.suspensionDate)}</p>
          <p className="text-body-extra-small text-text-secondary">{user.suspensionTime || ""}</p>
        </div>
        <div>
          <Badge type="reason" value={user.reasonTag} />
        </div>
        <div className="flex items-center justify-end">
          <button
            onClick={() => onViewProfile(user.userId || user.id)}
            className="px-md py-xs rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue hover:shadow-lg hover:shadow-primary-blue/25 transition-all duration-200"
          >
            View Profile
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default SuspendedTable;

import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { getAvatarUrl } from "../../utils/formatters";
import { formatDate } from "./useSuspendedUsers";

const SuspendedMobileCard = ({ user, onViewProfile }) => (
  <Card variant="container" className="hover:bg-white/5 transition-colors">
    <div className="flex flex-col gap-md">
      <div className="flex items-center gap-md">
        <img src={getAvatarUrl(user.avatar, user.name)} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-body-medium-bold text-text-primary truncate">{user.name || "Unknown User"}</p>
          <p className="text-body-extra-small text-text-secondary truncate">{user.email || "—"}</p>
        </div>
        <Badge type="reason" value={user.reasonTag} className="ml-2" />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-body-small text-text-secondary">{formatDate(user.suspensionDate)}</span>
        <span className="text-body-extra-small text-text-secondary">{user.suspensionTime || ""}</span>
      </div>

      <button
        onClick={() => onViewProfile(user.userId || user.id)}
        className="w-full py-sm rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue transition-all duration-200 text-center"
      >
        View Profile
      </button>
    </div>
  </Card>
);

export default SuspendedMobileCard;

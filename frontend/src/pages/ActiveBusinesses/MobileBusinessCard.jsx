import Card from "../../components/common/Card";
import { getAvatarUrl } from "../../utils/formatters";

const categoryColors = {
  "Self Employee": "bg-primary-blue/20 text-primary-blue border border-primary-blue/30",
  "Boarding": "bg-state-warning/20 text-state-warning border border-state-warning/30",
  "Food & Cafe": "bg-state-error/20 text-state-error border border-state-error/30",
  "Clubs & Society": "bg-primary-accent/20 text-primary-accent border border-primary-accent/30",
};

const MobileBusinessCard = ({ biz, onViewProfile }) => (
  <Card variant="container" className="hover:bg-white/5 transition-colors">
    <div className="flex flex-col gap-md">
      <div className="flex items-center gap-md">
        <img
          src={getAvatarUrl(biz.avatar, biz.name)}
          alt={biz.name}
          className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="text-body-medium-bold text-text-primary truncate">{biz.name}</p>
          <p className="text-body-extra-small text-text-secondary truncate">{biz.email}</p>
        </div>
        <div className="flex items-center gap-xs">
          <div className={`w-2 h-2 rounded-full shrink-0 ${biz.status === "Active" ? "bg-state-success" : "bg-state-error"}`} />
          <span className={`text-body-extra-small ${biz.status === "Active" ? "text-state-success" : "text-state-error"}`}>{biz.status}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`inline-flex px-sm py-xs rounded-lg text-body-extra-small-bold whitespace-nowrap ${categoryColors[biz.category] || "bg-white/10 text-text-secondary"}`}>
          {biz.category}
        </span>
        <span className="text-body-extra-small text-text-secondary">{biz.registrationDate}</span>
      </div>

      <button
        onClick={() => onViewProfile(biz.id)}
        className="w-full py-sm rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue transition-all duration-200 text-center"
      >
        View Profile
      </button>
    </div>
  </Card>
);

export default MobileBusinessCard;

import { getAvatarUrl } from "../../utils/formatters";

const categoryColors = {
  "Self Employee": "bg-primary-blue/20 text-primary-blue border border-primary-blue/30",
  "Boarding": "bg-state-warning/20 text-state-warning border border-state-warning/30",
  "Food & Cafe": "bg-state-error/20 text-state-error border border-state-error/30",
  "Clubs & Society": "bg-primary-accent/20 text-primary-accent border border-primary-accent/30",
};

const COLS = "2fr 1fr 1.2fr 1fr 1fr";

const BusinessTable = ({ businesses, loading, error, onViewProfile }) => (
  <div className="relative overflow-hidden border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm mb-md hidden md:block">
    <div className="grid gap-md px-lg py-md border-b border-white/10" style={{ gridTemplateColumns: COLS }}>
      <span className="text-body-small-bold text-text-secondary">Business</span>
      <span className="text-body-small-bold text-text-secondary">Category</span>
      <span className="text-body-small-bold text-text-secondary">Registration Date</span>
      <span className="text-body-small-bold text-text-secondary">Status</span>
      <span className="text-body-small-bold text-text-secondary text-right">Actions</span>
    </div>

    {loading && (
      <div className="px-lg py-xl text-center text-text-secondary text-body-small">Loading businesses...</div>
    )}

    {!loading && !error && businesses.map((biz, idx) => (
      <div
        key={biz.id}
        className={`grid gap-md px-lg py-md items-center hover:bg-white/5 transition-colors ${idx < businesses.length - 1 ? "border-b border-white/5" : ""}`}
        style={{ gridTemplateColumns: COLS }}
      >
        <div className="flex items-center gap-md min-w-0">
          <img
            src={getAvatarUrl(biz.avatar, biz.name)}
            alt={biz.name}
            className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-body-medium-bold text-text-primary truncate">{biz.name}</p>
            <p className="text-body-extra-small text-text-secondary truncate">{biz.email}</p>
          </div>
        </div>

        <div>
          <span className={`inline-flex px-sm py-xs rounded-lg text-body-extra-small-bold whitespace-nowrap ${categoryColors[biz.category] || "bg-white/10 text-text-secondary"}`}>
            {biz.category}
          </span>
        </div>

        <span className="text-body-small text-text-secondary">{biz.registrationDate}</span>

        <div className="flex items-center gap-xs">
          <div className={`w-2 h-2 rounded-full shrink-0 ${biz.status === "Active" ? "bg-state-success" : "bg-state-error"}`} />
          <span className={`text-body-small ${biz.status === "Active" ? "text-state-success" : "text-state-error"}`}>{biz.status}</span>
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={() => onViewProfile(biz.id)}
            className="px-md py-xs rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue hover:shadow-lg hover:shadow-primary-blue/25 transition-all duration-200"
          >
            View Profile
          </button>
        </div>
      </div>
    ))}

    {!loading && !error && businesses.length === 0 && (
      <div className="px-lg py-xl text-center text-text-secondary text-body-small">
        No businesses found matching your filters.
      </div>
    )}
  </div>
);

export default BusinessTable;

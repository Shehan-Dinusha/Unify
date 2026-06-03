import Card from "../../components/common/Card";
import {
  Gauge,
  Repeat2,
  Palette,
  Globe,
  BarChart3,
  Timer,
} from "lucide-react";

const BoostConfigPanel = ({
  feedPriority, setFeedPriority,
  visibilityMultiplier, setVisibilityMultiplier,
  highlightStyle, setHighlightStyle,
  crossCategoryReach, setCrossCategoryReach,
  analyticsAccess, setAnalyticsAccess,
  autoRefreshHours, setAutoRefreshHours,
}) => {
  return (
    <Card variant="card" padding="p-lg" className="mt-lg">
      <div className="flex flex-col gap-xl">
        <div>
          <h3 className="text-body-large-bold text-text-primary font-inter mb-1">Boost Engine Configuration</h3>
          <p className="text-body-extra-small text-text-secondary font-inter">These 5 parameters control the actual behavior when a business activates this boost package.</p>
        </div>

        <div className="flex flex-col gap-sm">
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-lg bg-state-success/15 flex items-center justify-center flex-shrink-0">
              <Gauge size={16} className="text-state-success" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <label className="text-body-small-bold text-text-primary font-inter">Feed Priority Position</label>
                <span className="text-body-small-bold text-state-success font-inter">#{feedPriority}</span>
              </div>
              <p className="text-body-extra-small text-text-secondary font-inter">Lower number = higher position in the news feed. #1 always appears first.</p>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={feedPriority}
            onChange={(e) => setFeedPriority(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-white/10 accent-state-success cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-text-tertiary font-inter">
            <span>#1 — Top of feed</span>
            <span>#10 — Normal position</span>
          </div>
        </div>

        <div className="flex flex-col gap-sm">
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-lg bg-primary-blue/15 flex items-center justify-center flex-shrink-0">
              <Repeat2 size={16} className="text-primary-blue" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <label className="text-body-small-bold text-text-primary font-inter">Visibility Multiplier</label>
                <span className="text-body-small-bold text-primary-blue font-inter">{visibilityMultiplier}x</span>
              </div>
              <p className="text-body-extra-small text-text-secondary font-inter">How many times the post appears in a single feed load. 2x = post shows twice.</p>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={visibilityMultiplier}
            onChange={(e) => setVisibilityMultiplier(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-white/10 accent-primary-blue cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-text-tertiary font-inter">
            <span>1x — Normal</span>
            <span>5x — Maximum exposure</span>
          </div>
        </div>

        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-lg bg-[#FBBF24]/15 flex items-center justify-center flex-shrink-0">
            <Palette size={16} className="text-[#FBBF24]" />
          </div>
          <div className="flex-1">
            <label className="text-body-small-bold text-text-primary font-inter block mb-1">Highlight Style</label>
            <p className="text-body-extra-small text-text-secondary font-inter mb-2">Visual treatment of the post card in the feed.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
              {[
                { value: "none", label: "None", desc: "Normal card", color: "text-text-secondary" },
                { value: "subtle", label: "Subtle", desc: "\"Sponsored\" text", color: "text-text-secondary" },
                { value: "blue", label: "Blue", desc: "Blue border + badge", color: "text-[#3B82F6]" },
                { value: "gold", label: "Gold", desc: "Gold glow + ⚡", color: "text-[#FBBF24]" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setHighlightStyle(opt.value)}
                  className={`rounded-xl p-3 text-center transition-all duration-200 border ${
                    highlightStyle === opt.value
                      ? "border-primary-blue bg-primary-blue/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className={`text-body-small-bold font-inter block ${opt.color}`}>{opt.label}</span>
                  <span className="text-[10px] text-text-tertiary font-inter">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-lg bg-[#A78BFA]/15 flex items-center justify-center flex-shrink-0">
            <Globe size={16} className="text-[#A78BFA]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-body-small-bold text-text-primary font-inter block">Cross-Category Reach</label>
                <p className="text-body-extra-small text-text-secondary font-inter">Post appears in ALL category feeds (Club, Boarding, etc.), not just its own.</p>
              </div>
              <button
                onClick={() => setCrossCategoryReach(!crossCategoryReach)}
                className={`relative w-12 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${
                  crossCategoryReach ? "bg-state-success" : "bg-white/15"
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${
                    crossCategoryReach ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-lg bg-[#F472B6]/15 flex items-center justify-center flex-shrink-0">
            <BarChart3 size={16} className="text-[#F472B6]" />
          </div>
          <div className="flex-1">
            <label className="text-body-small-bold text-text-primary font-inter block mb-1">Analytics Access</label>
            <p className="text-body-extra-small text-text-secondary font-inter">Business user can view boost performance metrics.</p>
          </div>
          <button
            onClick={() => setAnalyticsAccess(!analyticsAccess)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 flex-shrink-0 ${
              analyticsAccess ? "bg-primary-blue" : "bg-white/20"
            }`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
              analyticsAccess ? "translate-x-6" : "translate-x-1"
            }`} />
          </button>
        </div>

        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-lg bg-[#FBBF24]/15 flex items-center justify-center flex-shrink-0">
            <Timer size={16} className="text-[#FBBF24]" />
          </div>
          <div className="flex-1">
            <label className="text-body-small-bold text-text-primary font-inter block mb-1">Auto-Refresh</label>
            <p className="text-body-extra-small text-text-secondary font-inter mb-2">Post gets bumped as fresh content every X hours (like OLX bump).</p>
            <div className="grid grid-cols-4 gap-sm">
              {[
                { value: 0, label: "Off" },
                { value: 6, label: "6h" },
                { value: 12, label: "12h" },
                { value: 24, label: "24h" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setAutoRefreshHours(opt.value)}
                  className={`rounded-xl py-2 text-center transition-all duration-200 border ${
                    autoRefreshHours === opt.value
                      ? "border-[#FBBF24] bg-[#FBBF24]/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className="text-body-small-bold text-text-primary font-inter">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BoostConfigPanel;

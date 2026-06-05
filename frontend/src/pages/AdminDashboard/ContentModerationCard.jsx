import Card from "../../components/common/Card";
import { DonutChart } from "../../components/chart";

const ContentModerationCard = ({ moderationData, moderationTotal }) => (
  <Card variant="container" className="flex-1">
    <h3 className="text-body-large-bold text-text-primary mb-md">
      Content Moderation
    </h3>
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 140, height: 140 }}>
        <DonutChart
          segments={[
            { value: moderationData?.resolved || 0, color: "#4ADE80" },
            { value: moderationData?.reviewing || 0, color: "#FBBF24" },
            { value: moderationData?.pending || 0, color: "#FF6366" },
          ]}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-heading-medium text-text-primary leading-none">
            {moderationTotal}
          </span>
          <span className="text-body-extra-small text-text-secondary">Total</span>
        </div>
      </div>

      <div className="flex flex-col gap-sm w-full mt-md">
        {[
          { label: "Resolved", value: moderationData?.resolved || 0, color: "bg-state-success" },
          { label: "Reviewing", value: moderationData?.reviewing || 0, color: "bg-state-warning" },
          { label: "Pending", value: moderationData?.pending || 0, color: "bg-state-error" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-body-small text-text-secondary">{item.label}</span>
            </div>
            <span className="text-body-small-bold text-text-primary">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

export default ContentModerationCard;

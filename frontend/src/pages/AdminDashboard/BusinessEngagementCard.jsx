import Card from "../../components/common/Card";
import { ProgressBar } from "../../components/chart";

const BusinessEngagementCard = ({ engagementData }) => (
  <Card variant="container" className="flex-1">
    <div className="flex items-center justify-between mb-xs">
      <div>
        <h3 className="text-body-large-bold text-text-primary">Business Engagement</h3>
        <p className="text-body-extra-small text-text-secondary mt-xs">
          Boost purchases by University zone
        </p>
      </div>
      <button className="text-text-secondary hover:text-text-primary transition-colors text-lg leading-none">
        &bull;&bull;&bull;
      </button>
    </div>

    <div className="flex flex-col gap-md mt-md">
      {(engagementData || []).map((item) => (
        <div key={item.label} className="flex flex-col gap-xs">
          <div className="flex items-center justify-between">
            <span className="text-body-small text-text-secondary">{item.label}</span>
            <span className="text-body-small-bold" style={{ color: item.color }}>
              {item.value} Active
            </span>
          </div>
          <ProgressBar
            value={item.value}
            max={Math.max(...(engagementData || []).map((e) => e.value), 100)}
            color={item.color}
          />
        </div>
      ))}
    </div>
  </Card>
);

export default BusinessEngagementCard;

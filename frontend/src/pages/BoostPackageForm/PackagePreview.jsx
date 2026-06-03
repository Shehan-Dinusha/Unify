import { Eye, CheckCircle2, Info } from "lucide-react";
import Button from "../../components/common/Button";

const PackagePreview = ({
  isEditing,
  packageName,
  previewPrice,
  previewDuration,
  previewFeatures,
  description,
}) => {
  return (
    <div className="w-full md:w-80 flex-shrink-0">
      <div className="sticky top-24 flex flex-col gap-md">
        <div className="flex items-center gap-sm">
          <Eye size={18} className="text-primary-blue" />
          <span className="text-body-medium-bold text-text-primary font-inter">
            {isEditing ? "LIVE PREVIEW" : "Card Preview"}
          </span>
        </div>

        <div className="rounded-2xl border-2 border-primary-blue/60 bg-gradient-to-b from-white/10 to-white/5 p-lg">
          <div className="flex flex-col gap-sm">
            <h3 className="text-body-large-bold text-primary-blue font-inter">
              {packageName || "Campus Legend"}
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-heading-small text-text-primary font-inter font-bold">
                {previewPrice}
              </span>
              <span className="text-body-extra-small text-text-secondary font-inter">
                / {previewDuration}
              </span>
            </div>
            <p className="text-body-extra-small text-text-secondary font-inter leading-relaxed">
              {description ||
                (isEditing
                  ? "Best balance of reach and duration for weekly promos."
                  : "Dominate the university feed with maximum visibility and engagement.")}
            </p>
            <div className="flex flex-col gap-xs mt-sm">
              {previewFeatures.length > 0 ? (
                previewFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-xs">
                    <CheckCircle2
                      size={14}
                      className="text-state-success flex-shrink-0"
                    />
                    <span className="text-body-small text-text-primary font-inter">
                      {f}
                    </span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-xs">
                    <CheckCircle2 size={14} className="text-state-success" />
                    <span className="text-body-small text-text-primary font-inter">
                      Priority feed placement
                    </span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <CheckCircle2 size={14} className="text-state-success" />
                    <span className="text-body-small text-text-primary font-inter">
                      Reach 5,000+ students
                    </span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <CheckCircle2 size={14} className="text-state-success" />
                    <span className="text-body-small text-text-primary font-inter">
                      Verified sponsor badge
                    </span>
                  </div>
                </>
              )}
            </div>
            <Button
              variant="primary"
              size="small"
              fullWidth
              className="mt-md"
            >
              Select {packageName || "Package"}
            </Button>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-md">
          <div className="flex items-start gap-sm">
            <div className="w-8 h-8 rounded-full bg-primary-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Info size={16} className="text-primary-blue" />
            </div>
            <div>
              <p className="text-body-small-bold text-text-primary font-inter mb-xs">
                {isEditing ? "Editing Tips" : "Visibility Tip"}
              </p>
              <p className="text-body-extra-small text-text-secondary font-inter leading-relaxed">
                {isEditing
                  ? "Changes made here will take effect immediately for all new purchases. Existing active boosts will retain their original parameters until expiry."
                  : "This preview shows exactly how business accounts will see this package in their dashboard selection screen."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagePreview;

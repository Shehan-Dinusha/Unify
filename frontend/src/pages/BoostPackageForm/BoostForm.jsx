import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import { CheckCircle2 } from "lucide-react";

const BoostForm = ({
  packageName, setPackageName,
  price, setPrice,
  durationValue, setDurationValue,
  durationUnit, setDurationUnit,
  badgeType, setBadgeType,
  description, setDescription,
  isEditing,
  autoFeatures,
  durationUnitOptions,
  badgeOptions,
}) => {
  return (
    <Card variant="card" padding="p-lg">
      <div className="flex flex-col gap-xl">
        {isEditing && (
          <h3 className="text-body-large-bold text-text-primary font-inter">
            Package Details
          </h3>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <Input
            label={isEditing ? "PACKAGE NAME" : "Package Title"}
            placeholder="eg : Campus Legend"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
          />
          {isEditing ? (
            <Input
              label="BADGE TAG"
              placeholder="Most Popular"
              value={badgeType}
              onChange={(e) => setBadgeType(e.target.value)}
            />
          ) : (
            <Input
              label="Price (LKR)"
              placeholder="Rs. 0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {isEditing ? (
            <Input
              label="PRICE (LKR)"
              placeholder="Rs. 0.00"
              value={price ? `Rs. ${price}` : ""}
              onChange={(e) =>
                setPrice(e.target.value.replace(/[^0-9]/g, ""))
              }
            />
          ) : (
            <Select
              label="Duration"
              value={
                durationValue === "24" && durationUnit === "Hours"
                  ? "24h"
                  : `${durationValue}${durationUnit.charAt(0).toLowerCase()}`
              }
              options={[
                { value: "24h", label: "24 Hours" },
                { value: "3d", label: "3 Days" },
                { value: "7d", label: "7 Days" },
                { value: "14d", label: "14 Days" },
                { value: "30d", label: "30 Days" },
              ]}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "24h") {
                  setDurationValue("24");
                  setDurationUnit("Hours");
                } else if (val === "3d") {
                  setDurationValue("3");
                  setDurationUnit("Days");
                } else if (val === "7d") {
                  setDurationValue("7");
                  setDurationUnit("Days");
                } else if (val === "14d") {
                  setDurationValue("14");
                  setDurationUnit("Days");
                } else if (val === "30d") {
                  setDurationValue("30");
                  setDurationUnit("Days");
                }
              }}
            />
          )}
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <Input
                label="DURATION"
                placeholder="3"
                value={durationValue}
                onChange={(e) => setDurationValue(e.target.value)}
              />
              <Select
                label={"\u00A0"}
                value={durationUnit}
                options={durationUnitOptions}
                onChange={(e) => setDurationUnit(e.target.value)}
              />
            </div>
          ) : (
            <Select
              label="Badge Type"
              value={badgeType}
              options={badgeOptions}
              onChange={(e) => setBadgeType(e.target.value)}
            />
          )}
        </div>

        {isEditing && (
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-text-tertiary text-xs font-bold font-inter leading-5 uppercase tracking-wider">
              DESCRIPTION
            </label>
            <textarea
              className="w-full h-20 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all font-inter text-sm text-text-primary placeholder:text-text-tertiary px-4 py-3 resize-none focus:border-primary-blue/50 focus:bg-white/10 shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)]"
              placeholder="Describe this package..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-md">
            <h4 className="text-body-medium-bold text-text-primary font-inter">
              Live Features Preview
            </h4>
            <span className="text-[10px] text-text-tertiary font-inter bg-white/5 px-2 py-1 rounded-md">
              Auto-generated from config below
            </span>
          </div>

          {autoFeatures.length === 0 ? (
            <p className="text-body-extra-small text-text-tertiary font-inter italic">
              Configure the Boost Engine parameters below to see features appear here.
            </p>
          ) : (
            <div className="flex flex-col gap-sm">
              {autoFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-sm">
                  <CheckCircle2
                    size={18}
                    className="text-state-success flex-shrink-0"
                  />
                  <span className="text-body-small text-text-primary font-inter">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BoostForm;

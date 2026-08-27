import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import Button from "../../components/common/Button";
import { useBoostPackages } from "../../context/BoostPackageContext";
import { getCurrentUser } from "../../services/authService";
import { AlertTriangle } from "lucide-react";
import BoostForm from "./BoostForm";
import BoostConfigPanel from "./BoostConfigPanel";
import PackagePreview from "./PackagePreview";
import SaveConfirmModal from "./SaveConfirmModal";
import SuccessModal from "./SuccessModal";

const BoostPackageForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  // eslint-disable-next-line no-unused-vars
  const { packages, addPackage, updatePackage, loading } = useBoostPackages();

  const existingPackage = isEditing
    ? packages.find((pkg) => pkg.id === id)
    : null;

  const [packageName, setPackageName] = useState("");
  const [price, setPrice] = useState("");
  const [durationValue, setDurationValue] = useState("24");
  const [durationUnit, setDurationUnit] = useState("Hours");
  const [badgeType, setBadgeType] = useState("No Badge");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([""]);

  const [feedPriority, setFeedPriority] = useState(10);
  const [visibilityMultiplier, setVisibilityMultiplier] = useState(1);
  const [highlightStyle, setHighlightStyle] = useState("none");
  const [crossCategoryReach, setCrossCategoryReach] = useState(false);
  const [analyticsAccess, setAnalyticsAccess] = useState(false);
  const [autoRefreshHours, setAutoRefreshHours] = useState(0);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (existingPackage) {
      setPackageName(existingPackage.name);
      setPrice(String(existingPackage.price));
      setDurationValue(String(existingPackage.durationValue));
      setDurationUnit(existingPackage.durationUnit);
      setBadgeType(existingPackage.badge);
      setDescription(existingPackage.description);
      setFeatures(existingPackage.features && existingPackage.features.length > 0 ? existingPackage.features : [""]);
      if (existingPackage.boostConfig) {
        setFeedPriority(existingPackage.boostConfig.feedPriority ?? 10);
        setVisibilityMultiplier(existingPackage.boostConfig.visibilityMultiplier ?? 1);
        setHighlightStyle(existingPackage.boostConfig.highlightStyle ?? "none");
        setCrossCategoryReach(existingPackage.boostConfig.crossCategoryReach ?? false);
        setAnalyticsAccess(existingPackage.boostConfig.analyticsAccess ?? false);
        setAutoRefreshHours(existingPackage.boostConfig.autoRefreshHours ?? 0);
      }
    }
  }, [existingPackage]);

  const generateFeaturesPreview = () => {
    const feats = [];
    if (feedPriority < 10) {
      feats.push(feedPriority === 1 ? "Always #1 in Feed" : `Priority #${feedPriority} Feed Placement`);
    }
    if (visibilityMultiplier > 1) {
      feats.push(`${visibilityMultiplier}x Visibility Boost`);
    }
    if (highlightStyle !== "none") {
      const labels = { subtle: "Sponsored Label on Post", blue: "Blue Highlighted Card + Badge", gold: "⚡ Gold Premium Card Styling" };
      feats.push(labels[highlightStyle] || "Custom Card Styling");
    }
    if (crossCategoryReach) {
      feats.push("Appears in All Category Feeds");
    }
    if (analyticsAccess) {
      feats.push("Boost Analytics Dashboard");
    }
    if (autoRefreshHours > 0) {
      feats.push(`Auto-Refresh Every ${autoRefreshHours} Hours`);
    }
    if (durationValue && durationUnit) {
      feats.push(`${durationValue} ${durationUnit} Promotion Period`);
    }
    return feats;
  };

  const autoFeatures = generateFeaturesPreview();

  const handleSaveClick = () => {
    setSaveError(null);
    setShowSaveConfirm(true);
  };

  const confirmSave = async () => {
    setShowSaveConfirm(false);
    setIsSaving(true);
    setSaveError(null);

    const pkgData = {
      name: packageName || "Untitled",
      price: Number(price) || 0,
      durationValue: Number(durationValue) || 0,
      durationUnit,
      badge: badgeType,
      description: description || "No description provided.",
      features: features.filter((f) => f.trim() !== ""),
      boostConfig: {
        feedPriority: Number(feedPriority),
        visibilityMultiplier: Number(visibilityMultiplier),
        highlightStyle,
        crossCategoryReach,
        analyticsAccess,
        autoRefreshHours: Number(autoRefreshHours),
      },
    };

    try {
      let result;
      if (isEditing) {
        result = await updatePackage(id, pkgData);
      } else {
        result = await addPackage(pkgData);
      }

      const operationId = result?.id || `#bst-${Math.floor(10000 + Math.random() * 90000)}-tf`;
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setSuccessData({
        operationId,
        activationDate: `${dateStr} • ${timeStr}`,
        packageTier: packageName || "Untitled",
        isEdit: isEditing,
      });
      setShowSuccess(true);
    } catch (err) {
      setSaveError(err.message || "Failed to save package. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const cancelSave = () => {
    setShowSaveConfirm(false);
  };

  const handleDiscard = () => {
    navigate("/boost-controller");
  };

  const durationUnitOptions = [
    { value: "Hours", label: "Hours" },
    { value: "Days", label: "Days" },
    { value: "Weeks", label: "Weeks" },
  ];

  const badgeOptions = [
    { value: "No Badge", label: "No Badge" },
    { value: "Most Popular", label: "Most Popular" },
    { value: "Premium", label: "Premium" },
    { value: "Best Value", label: "Best Value" },
  ];

  const previewPrice = price
    ? `Rs. ${Number(price).toLocaleString()}`
    : "Rs. 0";
  const previewDuration = `${durationValue} ${durationUnit}`;
  const previewFeatures = autoFeatures;

  return (
    <MainLayout
      user={getCurrentUser() || { name: 'Admin', role: 'Admin' }}
      pageTitle="Package Configuration"
      headerRight={null}
      verificationCount={0}
    >
      <div className="flex flex-col gap-lg">
        <div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-md">
            <div>
              <h1 className="text-heading-small text-text-primary font-inter">
                {isEditing
                  ? "Edit Boost Package"
                  : "Create New Boost Package"}
              </h1>
              <p className="text-body-small text-text-secondary font-inter mt-1">
                {isEditing
                  ? `Modify details for the '${existingPackage?.name}' boost tier.`
                  : "Define a new advertising tier for businesses."}
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-sm md:gap-md w-full md:w-auto">
              <Button
                variant="secondary"
                size="medium"
                onClick={handleDiscard}
                className="whitespace-nowrap"
              >
                Discard Changes
              </Button>
              <Button
                variant="primary"
                size="medium"
                onClick={handleSaveClick}
                className="whitespace-nowrap"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        {saveError && (
          <div className="bg-state-error/10 border border-state-error/30 rounded-2xl p-md flex items-center gap-sm">
            <AlertTriangle size={18} className="text-state-error flex-shrink-0" />
            <p className="text-body-small text-state-error font-inter">{saveError}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-lg">
          <div className="flex-1 min-w-0">
            <BoostForm
              packageName={packageName} setPackageName={setPackageName}
              price={price} setPrice={setPrice}
              durationValue={durationValue} setDurationValue={setDurationValue}
              durationUnit={durationUnit} setDurationUnit={setDurationUnit}
              badgeType={badgeType} setBadgeType={setBadgeType}
              description={description} setDescription={setDescription}
              isEditing={isEditing}
              autoFeatures={autoFeatures}
              durationUnitOptions={durationUnitOptions}
              badgeOptions={badgeOptions}
            />
            <BoostConfigPanel
              feedPriority={feedPriority} setFeedPriority={setFeedPriority}
              visibilityMultiplier={visibilityMultiplier} setVisibilityMultiplier={setVisibilityMultiplier}
              highlightStyle={highlightStyle} setHighlightStyle={setHighlightStyle}
              crossCategoryReach={crossCategoryReach} setCrossCategoryReach={setCrossCategoryReach}
              analyticsAccess={analyticsAccess} setAnalyticsAccess={setAnalyticsAccess}
              autoRefreshHours={autoRefreshHours} setAutoRefreshHours={setAutoRefreshHours}
            />
          </div>

          <PackagePreview
            isEditing={isEditing}
            packageName={packageName}
            previewPrice={previewPrice}
            previewDuration={previewDuration}
            previewFeatures={previewFeatures}
            description={description}
          />
        </div>
      </div>

      {showSaveConfirm && (
        <SaveConfirmModal
          open={showSaveConfirm}
          onCancel={cancelSave}
          onConfirm={confirmSave}
          isEditing={isEditing}
          packageName={packageName}
        />
      )}

      {showSuccess && successData && (
        <SuccessModal
          open={showSuccess}
          data={successData}
          onReturnDashboard={() => navigate("/admin")}
          onManagePackages={() => navigate("/boost-controller")}
        />
      )}
    </MainLayout>
  );
};

export default BoostPackageForm;

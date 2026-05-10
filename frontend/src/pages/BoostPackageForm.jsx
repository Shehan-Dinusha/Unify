import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import Button from "../components/common/Button";
import { useBoostPackages } from "../context/BoostPackageContext";
import { mockRequests } from "../data/mockData";
import {
  CheckCircle2,
  Trash2,
  Plus,
  GripVertical,
  Eye,
  Info,
  LayoutDashboard,
  Settings,
  Save,
  AlertTriangle,
  Loader2,
  Gauge,
  Repeat2,
  Palette,
  Globe,
  BarChart3,
  Timer,
} from "lucide-react";

const BoostPackageForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const { packages, addPackage, updatePackage, loading } = useBoostPackages();

  // Find existing package if editing
  const existingPackage = isEditing
    ? packages.find((pkg) => pkg.id === id)
    : null;

  // Form state
  const [packageName, setPackageName] = useState("");
  const [price, setPrice] = useState("");
  const [durationValue, setDurationValue] = useState("24");
  const [durationUnit, setDurationUnit] = useState("Hours");
  const [badgeType, setBadgeType] = useState("No Badge");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([""]);

  // Boost Engine Config — the 6 parameters that control actual boost behavior
  const [feedPriority, setFeedPriority] = useState(10);
  const [visibilityMultiplier, setVisibilityMultiplier] = useState(1);
  const [highlightStyle, setHighlightStyle] = useState("none");
  const [crossCategoryReach, setCrossCategoryReach] = useState(false);
  const [analyticsAccess, setAnalyticsAccess] = useState(false);
  const [autoRefreshHours, setAutoRefreshHours] = useState(0);

  // Modal states
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Pre-fill form if editing
  useEffect(() => {
    if (existingPackage) {
      setPackageName(existingPackage.name);
      setPrice(String(existingPackage.price));
      setDurationValue(String(existingPackage.durationValue));
      setDurationUnit(existingPackage.durationUnit);
      setBadgeType(existingPackage.badge);
      setDescription(existingPackage.description);
      setFeatures(existingPackage.features && existingPackage.features.length > 0 ? existingPackage.features : [""]);
      // Pre-fill boost engine config
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

  // Auto-generate features text from boostConfig (mirrors backend logic)
  const generateFeaturesPreview = () => {
    const feats = [];
    if (feedPriority < 10) {
      feats.push(feedPriority === 1 ? "Always #1 in Feed" : `Priority #${feedPriority} Feed Placement`);
    }
    if (visibilityMultiplier > 1) {
      feats.push(`${visibilityMultiplier}x Visibility Boost`);
    }
    if (highlightStyle !== "none") {
      const labels = { subtle: "Sponsored Label on Post", blue: "Blue Highlighted Card + Badge", gold: "\u26A1 Gold Premium Card Styling" };
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

  // Show save confirmation first
  const handleSaveClick = () => {
    setSaveError(null);
    setShowSaveConfirm(true);
  };

  // Actually save after confirmation — calls API
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

      // Use DB-generated data for the success modal
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

  // Duration options
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

  // Live preview computed values
  const previewPrice = price
    ? `Rs. ${Number(price).toLocaleString()}`
    : "Rs. 0";
  const previewDuration = `${durationValue} ${durationUnit}`;
  const previewFeatures = autoFeatures;

  return (
      <MainLayout
        user={{ name: "Alex Johnson", role: "admin" }}
        pageTitle="Package Configuration"
        headerRight={null}
        verificationCount={mockRequests.length}
      >
        <div className="flex flex-col gap-lg">
          {/* Page Title + Mobile Buttons */}
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
              {/* Buttons — both desktop and mobile */}
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

          {/* Error Banner */}
          {saveError && (
            <div className="bg-state-error/10 border border-state-error/30 rounded-2xl p-md flex items-center gap-sm">
              <AlertTriangle size={18} className="text-state-error flex-shrink-0" />
              <p className="text-body-small text-state-error font-inter">{saveError}</p>
            </div>
          )}

          {/* Main Content: Form + Preview */}
          <div className="flex flex-col md:flex-row gap-lg">
            {/* Left: Form */}
            <div className="flex-1 min-w-0">
              <Card variant="card" padding="p-lg">
                <div className="flex flex-col gap-xl">
                  {/* Package Details Section Header (Edit mode) */}
                  {isEditing && (
                    <h3 className="text-body-large-bold text-text-primary font-inter">
                      Package Details
                    </h3>
                  )}

                  {/* Row 1: Name + Badge/Price */}
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

                  {/* Row 2: Duration + Badge/Price */}
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

                  {/* Description (Edit mode) */}
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

                  {/* Auto-Generated Features Preview */}
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

              {/* ═══ Boost Engine Configuration ═══ */}
              <Card variant="card" padding="p-lg" className="mt-lg">
                <div className="flex flex-col gap-xl">
                  <div>
                    <h3 className="text-body-large-bold text-text-primary font-inter mb-1">Boost Engine Configuration</h3>
                    <p className="text-body-extra-small text-text-secondary font-inter">These 5 parameters control the actual behavior when a business activates this boost package.</p>
                  </div>

                  {/* 1. Feed Priority */}
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

                  {/* 2. Visibility Multiplier */}
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

                  {/* 3. Highlight Style */}
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

                  {/* 4. Cross-Category Reach */}
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

                  {/* 5. Analytics Access */}
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

                  {/* 6. Auto-Refresh */}
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
            </div>

            {/* Right: Live Preview */}
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="sticky top-24 flex flex-col gap-md">
                {/* Preview Header */}
                <div className="flex items-center gap-sm">
                  <Eye size={18} className="text-primary-blue" />
                  <span className="text-body-medium-bold text-text-primary font-inter">
                    {isEditing ? "LIVE PREVIEW" : "Card Preview"}
                  </span>
                </div>

                {/* Preview Card */}
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
                            <CheckCircle2
                              size={14}
                              className="text-state-success"
                            />
                            <span className="text-body-small text-text-primary font-inter">
                              Priority feed placement
                            </span>
                          </div>
                          <div className="flex items-center gap-xs">
                            <CheckCircle2
                              size={14}
                              className="text-state-success"
                            />
                            <span className="text-body-small text-text-primary font-inter">
                              Reach 5,000+ students
                            </span>
                          </div>
                          <div className="flex items-center gap-xs">
                            <CheckCircle2
                              size={14}
                              className="text-state-success"
                            />
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

                {/* Tip Card */}
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
          </div>
        </div>
        {/* Save Confirmation Modal — inside MainLayout so sidebar shows behind blur */}
        {showSaveConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4">
            <Card variant="card" padding="p-0" className="w-full max-w-[420px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl">
              <div className="p-8 pb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-blue/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary-blue/5">
                  <Save size={32} className="text-primary-blue" />
                </div>
                <h2 className="text-xl font-bold text-white mb-3">{isEditing ? "Update Package?" : "Save New Package?"}</h2>
                <p className="text-text-secondary text-sm leading-relaxed mb-2 max-w-sm">
                  {isEditing
                    ? <>Are you sure you want to update the <span className="text-text-primary font-semibold">"{packageName || 'Untitled'}"</span> package? Changes will take effect immediately.</>
                    : <>Are you sure you want to create the <span className="text-text-primary font-semibold">"{packageName || 'Untitled'}"</span> package? It will be available for businesses immediately.</>}
                </p>
              </div>
              <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
                <button onClick={confirmSave} className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200">
                  <Save size={18} /> {isEditing ? "Yes, Update Package" : "Yes, Save Package"}
                </button>
                <button onClick={cancelSave} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">
                  Cancel
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Success Modal — inside MainLayout so sidebar shows behind blur */}
        {showSuccess && successData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4 py-6 overflow-y-auto">
            <Card variant="card" padding="p-0" className="w-full max-w-[480px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl my-auto">
              <div className="p-6 sm:p-8 pb-4 sm:pb-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-state-success/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 ring-4 ring-state-success/5">
                  <CheckCircle2 size={28} className="text-state-success sm:hidden" />
                  <CheckCircle2 size={32} className="text-state-success hidden sm:block" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Package Successfully {successData.isEdit ? "Updated" : "Added"}</h2>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 max-w-sm">
                  The "{successData.packageTier}" boosting package has been successfully {successData.isEdit ? "applied to your active campaign" : "added to your active campaign"}. Your ad visibility will increase immediately.
                </p>
                <div className="w-full bg-white/5 rounded-2xl border border-white/10 p-md sm:p-lg mb-4 sm:mb-6">
                  <div className="flex items-center justify-between py-xs sm:py-sm border-b border-white/10">
                    <span className="text-body-extra-small text-text-secondary font-inter">Operation ID</span>
                    <span className="text-body-extra-small sm:text-body-small-bold text-text-primary font-inter">{successData.operationId}</span>
                  </div>
                  <div className="flex items-center justify-between py-xs sm:py-sm border-b border-white/10">
                    <span className="text-body-extra-small text-text-secondary font-inter">Activation Date</span>
                    <span className="text-body-extra-small sm:text-body-small-bold text-text-primary font-inter">{successData.activationDate}</span>
                  </div>
                  <div className="flex items-center justify-between py-xs sm:py-sm">
                    <span className="text-body-extra-small text-text-secondary font-inter">Package Tier</span>
                    <span className="text-body-extra-small sm:text-body-small-bold text-primary-blue font-inter flex items-center gap-1">⚡ {successData.packageTier.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-1 sm:pt-2 flex flex-col gap-3">
                <button onClick={() => navigate("/admin")} className="w-full h-11 sm:h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200">
                  <LayoutDashboard size={18} /> Return to Dashboard
                </button>
                <button onClick={() => navigate("/boost-controller")} className="w-full h-11 sm:h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">
                  <Settings size={18} className="text-text-secondary" /> Manage All Packages
                </button>
              </div>
            </Card>
          </div>
        )}
      </MainLayout>
  );
};

export default BoostPackageForm;

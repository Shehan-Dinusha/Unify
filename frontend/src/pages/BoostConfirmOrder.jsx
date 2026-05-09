import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import { useBoostPackages } from '../context/BoostPackageContext';
import {
  CheckCircle2,
  Eye,
  Users,
  CalendarDays,
  Lock,
  ArrowLeft,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

const BoostConfirmOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { packages, purchaseBoost } = useBoostPackages();

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);

  // Get data passed from select page
  const {
    packageId,
    subtotal: passedSubtotal,
    tax: passedTax,
    total: passedTotal,
    durationDays: passedDuration,
  } = location.state || {};

  const selectedPkg = packages.find((p) => p.id === packageId) || packages[0];

  if (!selectedPkg) {
    return (
      <MainLayout
        user={{ name: 'Alex Johnson', role: 'business', displayRole: 'Business & Organization' }}
        pageTitle="Boost Your Post"
        verificationCount={0}
      >
        <div className="flex items-center justify-center py-xl min-h-[400px]">
          <p className="text-body-small text-text-secondary font-inter">No package selected. Please go back and select a package.</p>
        </div>
      </MainLayout>
    );
  }

  // Calculate values from DB package data
  const durationDays =
    passedDuration ||
    (selectedPkg.durationUnit === 'Hours'
      ? 1
      : selectedPkg.durationUnit === 'Days'
        ? selectedPkg.durationValue
        : selectedPkg.durationValue * 7);
  const dailyRate = durationDays > 0 ? Math.round(Number(selectedPkg.price) / durationDays * 100) / 100 : Number(selectedPkg.price);
  const subtotal = passedSubtotal || Number(selectedPkg.price);
  const tax = passedTax ?? 0;
  const total = passedTotal || subtotal + tax;

  // Date range
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + durationDays);
  const formatDate = (d) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const dateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  // Estimated reach — calculated from boostConfig parameters
  const getEstimatedReach = () => {
    const config = selectedPkg.boostConfig || {};
    const baseReach = 500; // base impressions per day for any boosted post
    const priorityBonus = Math.max(1, (11 - (config.feedPriority || 10)) / 2); // priority #1 = 5x, #10 = 0.5x
    const visMultiplier = config.visibilityMultiplier || 1;
    const crossCatBonus = config.crossCategoryReach ? 2.5 : 1; // cross-category = 2.5x more reach
    const refreshBonus = config.autoRefreshHours ? (24 / config.autoRefreshHours) * 0.3 + 1 : 1; // more refreshes = more exposure

    const totalReach = Math.round(baseReach * durationDays * priorityBonus * visMultiplier * crossCatBonus * refreshBonus);

    if (totalReach >= 10000) return `~${Math.round(totalReach / 1000)}k Views`;
    if (totalReach >= 1000) return `~${(totalReach / 1000).toFixed(1)}k Views`;
    return `~${totalReach} Views`;
  };
  const estimatedReach = getEstimatedReach();

  // Package badge from DB
  const badgeLabel =
    selectedPkg.badge === 'Most Popular'
      ? 'Most Popular'
      : selectedPkg.badge === 'Premium'
        ? 'Best Value'
        : selectedPkg.badge !== 'No Badge'
          ? selectedPkg.badge
          : null;

  // Benefits from DB package features — no hardcoded fallbacks
  const benefits = (selectedPkg.features || []).slice(0, 6);

  const handleProceedToPayment = async () => {
    setIsPurchasing(true);
    setPurchaseError(null);

    try {
      // Call the purchase API endpoint
      const result = await purchaseBoost(packageId, null);

      // Navigate to success page with DB response data
      navigate('/business/boost-post/success', {
        state: {
          packageId,
          packageName: selectedPkg.name,
          budget: total,
          durationDays,
          transactionId: result?.transactionId,
          purchaseDate: result?.purchaseDate,
          expiryDate: result?.expiryDate,
          purchaseId: result?.purchaseId,
        },
      });
    } catch (err) {
      setPurchaseError(err.message || 'Failed to process payment. Please try again.');
      setIsPurchasing(false);
    }
  };

  const handleModifyPackage = () => {
    navigate('/business/boost-post');
  };

  return (
    <MainLayout
      user={{ name: 'Alex Johnson', role: 'business', displayRole: 'Business & Organization' }}
      pageTitle="Boost Your Post"
      verificationCount={0}
    >
      <div className="flex flex-col gap-lg">
        {/* Page Title */}
        <div>
          <h1 className="text-heading-small md:text-heading-medium text-text-primary font-inter">
            Confirm Your Boost
          </h1>
          <p className="text-body-small text-text-secondary font-inter mt-1">
            Review your package details before activation.
          </p>
        </div>

        {/* Error Banner */}
        {purchaseError && (
          <div className="bg-state-error/10 border border-state-error/30 rounded-2xl p-md flex items-center gap-sm">
            <AlertTriangle size={18} className="text-state-error flex-shrink-0" />
            <p className="text-body-small text-state-error font-inter">{purchaseError}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-lg">
          {/* Left Column: Package Details */}
          <div className="flex-1 min-w-0 flex flex-col gap-lg">
            {/* Selected Package Card */}
            <Card variant="card" padding="p-0" className="overflow-hidden">
              <div className="p-lg pb-0">
                {/* Package Header */}
                <div className="h-40 sm:h-52 rounded-2xl bg-gradient-to-br from-dark-4 to-dark-2 border border-white/10 flex flex-col justify-end p-lg relative overflow-hidden">
                  {/* Decorative background */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-1/80 to-transparent" />
                  <div className="relative z-10">
                    {badgeLabel && (
                      <div className="flex items-center gap-sm mb-sm">
                        <span className="text-[10px] font-bold bg-primary-blue/20 text-primary-blue px-2.5 py-0.5 rounded-full border border-primary-blue/30">
                          {badgeLabel}
                        </span>
                        <span className="text-body-extra-small text-text-secondary font-inter">
                          Selected Package
                        </span>
                      </div>
                    )}
                    <h2 className="text-heading-small md:text-heading-medium text-text-primary font-inter">
                      {selectedPkg.name} Package
                    </h2>
                    <p className="text-body-small text-text-secondary font-inter mt-1 max-w-md">
                      {selectedPkg.description || 'Boost your post visibility across the Unify network.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="p-lg pt-md">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                  <Card variant="container" padding="p-md" className="text-center">
                    <div className="flex items-center justify-center gap-xs mb-xs">
                      <Eye size={14} className="text-state-success" />
                      <span className="text-body-extra-small text-text-secondary font-inter">Est. Reach</span>
                    </div>
                    <p className="text-body-large-bold text-text-primary font-inter">{estimatedReach}</p>
                    <p className="text-body-extra-small text-text-secondary font-inter">Impressions guaranteed</p>
                  </Card>

                  <Card variant="container" padding="p-md" className="text-center">
                    <div className="flex items-center justify-center gap-xs mb-xs">
                      <Users size={14} className="text-primary-blue" />
                      <span className="text-body-extra-small text-text-secondary font-inter">Audience</span>
                    </div>
                    <p className="text-body-large-bold text-text-primary font-inter">
                      {selectedPkg.boostConfig?.crossCategoryReach ? 'All Users' : 'Targeted'}
                    </p>
                    <p className="text-body-extra-small text-text-secondary font-inter">
                      {selectedPkg.boostConfig?.crossCategoryReach ? 'All category feeds' : 'Own category feed'}
                    </p>
                  </Card>

                  <Card variant="container" padding="p-md" className="text-center">
                    <div className="flex items-center justify-center gap-xs mb-xs">
                      <CalendarDays size={14} className="text-state-warning" />
                      <span className="text-body-extra-small text-text-secondary font-inter">Duration</span>
                    </div>
                    <p className="text-body-large-bold text-text-primary font-inter">{durationDays} Days</p>
                    <p className="text-body-extra-small text-text-secondary font-inter">{dateRange}</p>
                  </Card>
                </div>
              </div>

              {/* Included Benefits — from DB features */}
              <div className="px-lg pb-lg">
                <Card variant="container" padding="p-lg">
                  <h4 className="text-body-medium-bold text-text-primary font-inter mb-md">Included Benefits</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                    {benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-sm">
                        <div className="w-5 h-5 rounded-md bg-primary-blue/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 size={13} className="text-primary-blue" />
                        </div>
                        <span className="text-body-small text-text-soft font-inter">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </Card>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <Card variant="card" padding="p-lg">
                <h3 className="text-body-large-bold text-text-primary font-inter mb-lg">Order Summary</h3>

                <div className="flex flex-col gap-sm">
                  <div className="flex items-center justify-between py-xs">
                    <span className="text-body-small text-text-secondary font-inter">Daily Rate</span>
                    <span className="text-body-small text-text-primary font-inter">
                      Rs. {dailyRate.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-xs">
                    <span className="text-body-small text-text-secondary font-inter">Duration</span>
                    <span className="text-body-small text-text-primary font-inter">{durationDays} Days</span>
                  </div>
                  <div className="h-px bg-white/10 w-full" />
                  <div className="flex items-center justify-between py-xs">
                    <span className="text-body-small text-text-secondary font-inter">Subtotal</span>
                    <span className="text-body-small text-text-primary font-inter">
                      Rs. {subtotal.toLocaleString()}.00
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-xs">
                    <span className="text-body-small text-text-secondary font-inter">Tax (VAT 0%)</span>
                    <span className="text-body-small text-text-primary font-inter">
                      Rs. {tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-px bg-white/10 w-full" />
                  <div className="flex items-center justify-between py-sm">
                    <span className="text-body-large-bold text-text-primary font-inter">Total</span>
                    <span className="text-heading-small text-text-primary font-inter font-bold">
                      Rs. {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-lg flex flex-col gap-3">
                  <button
                    onClick={handleProceedToPayment}
                    disabled={isPurchasing}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPurchasing ? (
                      <><Loader2 size={16} className="animate-spin" /> Processing...</>
                    ) : (
                      <><Lock size={16} /> Proceed to Payment</>
                    )}
                  </button>
                  <button
                    onClick={handleModifyPackage}
                    disabled={isPurchasing}
                    className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                  >
                    Modify Package
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-lg mt-md">
                  <span className="text-body-extra-small text-text-secondary font-inter flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-state-success" /> Secure
                  </span>
                  <span className="text-body-extra-small text-text-secondary font-inter flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-state-success" /> Money-back
                  </span>
                  <span className="text-body-extra-small text-text-secondary font-inter flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-state-success" /> Support
                  </span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BoostConfirmOrder;

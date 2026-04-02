import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import { useBoostPackages } from '../context/BoostPackageContext';
import { mockBoostCampaigns } from '../data/mockBoostPostData';
import {
  CheckCircle2,
  Circle,
  Eye,
  Zap,
  Heart,
  ArrowRight,
} from 'lucide-react';

const BoostSelectPackage = () => {
  const navigate = useNavigate();
  const { packages } = useBoostPackages();
  const [selectedPkgId, setSelectedPkgId] = useState('pkg-002');

  const selectedPkg = packages.find((p) => p.id === selectedPkgId) || packages[0];

  // Compute order summary from selected package
  const durationDays =
    selectedPkg.durationUnit === 'Hours'
      ? 1
      : selectedPkg.durationUnit === 'Days'
        ? selectedPkg.durationValue
        : selectedPkg.durationValue * 7;
  const subtotal = selectedPkg.price;
  const taxRate = 0.008;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + tax;
  const durationLabel =
    selectedPkg.durationUnit === 'Hours'
      ? '24 Hours'
      : `${selectedPkg.durationValue} ${selectedPkg.durationUnit}`;

  const handleBoostNow = () => {
    navigate('/business/boost-post/confirm', {
      state: {
        packageId: selectedPkgId,
        subtotal,
        tax,
        total,
        durationDays,
      },
    });
  };

  // Use mock campaign for the live preview
  const previewCampaign = mockBoostCampaigns[1];

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
            Supercharge your Ad Reach
          </h1>
          <p className="text-body-small text-text-secondary font-inter mt-1 max-w-2xl">
            Select a boosting package to extend visibility and get up to 5x more views on
            your campaign.
          </p>
        </div>

        {/* ── Package Cards ── 3 columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {packages.map((pkg) => {
            const isSelected = pkg.id === selectedPkgId;
            const showBadge = pkg.badge === 'Premium';

            return (
              <Card
                key={pkg.id}
                variant="card"
                padding="p-lg"
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-primary-blue ring-1 ring-primary-blue/40'
                    : 'hover:border-white/30'
                }`}
                onClick={() => setSelectedPkgId(pkg.id)}
              >
                <div className="flex flex-col h-full">
                  {/* Header row: name + optional badge */}
                  <div className="flex items-start justify-between mb-md">
                    <h3 className="text-body-large-bold text-text-primary font-inter">
                      {pkg.name}
                    </h3>
                    {showBadge && (
                      <span className="text-[10px] font-bold bg-white/10 text-text-secondary px-2.5 py-0.5 rounded-md uppercase tracking-wider border border-white/10">
                        BEST VALUE
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-heading-small md:text-heading-medium text-text-primary font-inter font-bold">
                      Rs. {pkg.price.toLocaleString()}
                    </span>
                    <span className="text-body-extra-small text-text-secondary font-inter">
                      / {pkg.duration}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-body-extra-small text-text-secondary font-inter mb-lg leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-col gap-sm mt-auto">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-sm">
                        {isSelected ? (
                          <CheckCircle2 size={16} className="text-state-success flex-shrink-0" />
                        ) : (
                          <Circle size={16} className="text-text-secondary flex-shrink-0" />
                        )}
                        <span className="text-body-small text-text-soft font-inter">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Select Button */}
                  <div className="mt-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPkgId(pkg.id);
                      }}
                      className={`w-full h-11 rounded-2xl font-inter font-bold text-sm flex items-center justify-center transition-all duration-200 active:scale-[0.98] ${
                        isSelected
                          ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/30 hover:brightness-110'
                          : 'bg-dark-4 text-text-soft hover:bg-dark-2'
                      }`}
                    >
                      Select {pkg.name}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* ── Bottom Row: Live Preview + Order Summary ── side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-md">
          {/* Live Preview — takes 3 columns */}
          <div className="lg:col-span-3">
            <Card variant="card" padding="p-lg" className="h-full">
              <div className="flex items-center gap-sm mb-lg">
                <Eye size={18} className="text-primary-blue" />
                <span className="text-body-medium-bold text-text-primary font-inter">Live Preview</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-lg">
                {/* Preview Post Card */}
                <div className="flex-1 min-w-0">
                  <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/5">
                    <div className="h-28 sm:h-36 overflow-hidden bg-gradient-to-br from-white/10 to-white/5">
                      <img
                        src={previewCampaign.image}
                        alt="Preview"
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                    <div className="p-md">
                      <h4 className="text-body-small-bold text-text-primary font-inter mb-1">
                        {previewCampaign.postTitle}
                      </h4>
                      <p className="text-body-extra-small text-text-secondary font-inter leading-relaxed mb-md">
                        {previewCampaign.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-primary-blue text-body-small-bold font-inter flex items-center gap-1 cursor-pointer hover:underline">
                          Shop Now <ArrowRight size={14} />
                        </span>
                        <div className="flex items-center gap-1 text-text-secondary">
                          <Heart size={14} />
                          <span className="text-body-extra-small font-inter">7.4k</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* What-you-get info */}
                <div className="flex-1 min-w-0 flex flex-col gap-md justify-center">
                  <h4 className="text-body-medium-bold text-text-primary font-inter">
                    What you get with "{selectedPkg.name}":
                  </h4>
                  <ul className="flex flex-col gap-sm">
                    <li className="flex items-start gap-sm">
                      <span className="text-text-secondary mt-1.5 text-[6px]">●</span>
                      <span className="text-body-small text-text-secondary font-inter leading-relaxed">
                        Your ad appears in the{' '}
                        <span className="text-text-primary font-semibold">Top 3</span> spots
                        of the category.
                      </span>
                    </li>
                    <li className="flex items-start gap-sm">
                      <span className="text-text-secondary mt-1.5 text-[6px]">●</span>
                      <span className="text-body-small text-text-secondary font-inter leading-relaxed">
                        Primary color border attracts{' '}
                        <span className="text-text-primary font-semibold">25% more clicks</span>.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary — takes 2 columns */}
          <div className="lg:col-span-2">
            <Card variant="card" padding="p-lg" className="h-full flex flex-col">
              <h3 className="text-body-large-bold text-text-primary font-inter mb-lg">
                Order Summary
              </h3>

              <div className="flex flex-col gap-sm flex-1">
                <div className="flex items-center justify-between py-xs">
                  <span className="text-body-small text-text-secondary font-inter">Selected Package</span>
                  <span className="text-body-small-bold text-text-primary font-inter">
                    {selectedPkg.name} ({durationLabel})
                  </span>
                </div>
                <div className="h-px bg-white/10 w-full" />
                <div className="flex items-center justify-between py-xs">
                  <span className="text-body-small text-text-secondary font-inter">Subtotal</span>
                  <span className="text-body-small text-text-primary font-inter">
                    Rs. {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-xs">
                  <span className="text-body-small text-text-secondary font-inter">Tax (Estimated)</span>
                  <span className="text-body-small text-text-primary font-inter">
                    Rs. {tax.toFixed(2)}
                  </span>
                </div>
                <div className="h-px bg-white/10 w-full" />
                <div className="flex items-center justify-between py-sm">
                  <span className="text-body-medium-bold text-text-primary font-inter">Total Due</span>
                  <span className="text-body-medium-bold text-state-error font-inter">
                    Rs. {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleBoostNow}
                className="w-full h-10 mt-md rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
              >
                <Zap size={15} />
                Boost Now
              </button>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BoostSelectPackage;

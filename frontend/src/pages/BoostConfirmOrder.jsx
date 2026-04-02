import React from 'react';
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
} from 'lucide-react';

const BoostConfirmOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { packages } = useBoostPackages();

  // Get data passed from select page
  const {
    packageId = 'pkg-002',
    subtotal: passedSubtotal,
    tax: passedTax,
    total: passedTotal,
    durationDays: passedDuration,
  } = location.state || {};

  const selectedPkg = packages.find((p) => p.id === packageId) || packages[1];

  // Calculate values
  const durationDays =
    passedDuration ||
    (selectedPkg.durationUnit === 'Hours'
      ? 1
      : selectedPkg.durationUnit === 'Days'
        ? selectedPkg.durationValue
        : selectedPkg.durationValue * 7);
  const dailyRate = durationDays > 0 ? Math.round(selectedPkg.price / durationDays * 100) / 100 : selectedPkg.price;
  const subtotal = passedSubtotal || selectedPkg.price;
  const tax = passedTax ?? 0;
  const total = passedTotal || subtotal + tax;

  // Date range
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + durationDays);
  const formatDate = (d) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const dateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  // Package badge
  const badgeLabel =
    selectedPkg.badge === 'Most Popular'
      ? 'Most Popular'
      : selectedPkg.badge === 'Premium'
        ? 'Best Value'
        : selectedPkg.badge !== 'No Badge'
          ? selectedPkg.badge
          : null;

  // Reach estimates
  const reachMap = {
    'pkg-001': '20k - 30k',
    'pkg-002': '50k - 70k',
    'pkg-003': '100k - 150k',
  };
  const audienceMap = {
    'pkg-001': 'General',
    'pkg-002': 'Tech Pros',
    'pkg-003': 'Enterprise',
  };
  const audienceDescMap = {
    'pkg-001': 'Standard audience reach',
    'pkg-002': 'Highly targeted segment',
    'pkg-003': 'Maximum reach potential',
  };

  const estReach = reachMap[packageId] || '50k - 70k';
  const audience = audienceMap[packageId] || 'Tech Pros';
  const audienceDesc = audienceDescMap[packageId] || 'Highly targeted segment';

  // Benefits
  const benefits = [
    ...selectedPkg.features.slice(0, 4),
  ];
  // Pad to 4 if needed
  while (benefits.length < 4) {
    const defaults = ['2x Reach Multiplier', 'Priority Support 24/7', 'Detailed Analytics Report', 'Ad Optimization'];
    benefits.push(defaults[benefits.length]);
  }

  const handleProceedToPayment = () => {
    navigate('/business/boost-post/success', {
      state: {
        packageId,
        packageName: selectedPkg.name,
        budget: total,
        durationDays,
      },
    });
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
                      {selectedPkg.name === 'Growth'
                        ? 'Gold Tier Package'
                        : selectedPkg.name === 'Dominate'
                          ? 'Platinum Tier Package'
                          : 'Silver Tier Package'}
                    </h2>
                    <p className="text-body-small text-text-secondary font-inter mt-1 max-w-md">
                      Maximize your visibility with priority placement across our premium network.
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
                    <p className="text-body-large-bold text-text-primary font-inter">{estReach}</p>
                    <p className="text-body-extra-small text-text-secondary font-inter">Impressions guaranteed</p>
                  </Card>

                  <Card variant="container" padding="p-md" className="text-center">
                    <div className="flex items-center justify-center gap-xs mb-xs">
                      <Users size={14} className="text-primary-blue" />
                      <span className="text-body-extra-small text-text-secondary font-inter">Audience</span>
                    </div>
                    <p className="text-body-large-bold text-text-primary font-inter">{audience}</p>
                    <p className="text-body-extra-small text-text-secondary font-inter">{audienceDesc}</p>
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

              {/* Included Benefits */}
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
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
                  >
                    <Lock size={16} />
                    Proceed to Payment
                  </button>
                  <button
                    onClick={handleModifyPackage}
                    className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"
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

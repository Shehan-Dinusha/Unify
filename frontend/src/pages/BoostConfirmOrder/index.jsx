import React from 'react';
import { AlertTriangle } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import { useBoostConfirmOrder } from './useBoostConfirmOrder';
import PackageStatsRow from './PackageStatsRow';
import BenefitsList from './BenefitsList';
import OrderSummary from './OrderSummary';

const BoostConfirmOrder = () => {
  const {
    user, selectedPkg, isPurchasing, purchaseError,
    estimatedReach, durationDays, dateRange, dailyRate, subtotal,
    tax, total, badgeLabel, benefits, handleProceedToPayment, handleModifyPackage,
  } = useBoostConfirmOrder();

  if (!selectedPkg) {
    return (
      <MainLayout user={user} pageTitle="Boost Your Post" verificationCount={0}>
        <div className="flex items-center justify-center py-xl min-h-[400px]">
          <p className="text-body-small text-text-secondary font-inter">No package selected. Please go back and select a package.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user} pageTitle="Boost Your Post" verificationCount={0}>
      <div className="flex flex-col gap-lg">
        <div>
          <h1 className="text-heading-small md:text-heading-medium text-text-primary font-inter">Confirm Your Boost</h1>
          <p className="text-body-small text-text-secondary font-inter mt-1">Review your package details before activation.</p>
        </div>

        {purchaseError && (
          <div className="bg-state-error/10 border border-state-error/30 rounded-2xl p-md flex items-center gap-sm">
            <AlertTriangle size={18} className="text-state-error flex-shrink-0" />
            <p className="text-body-small text-state-error font-inter">{purchaseError}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-lg">
          <div className="flex-1 min-w-0 flex flex-col gap-lg">
            <Card variant="card" padding="p-0" className="overflow-hidden">
              <div className="p-lg pb-0">
                <div className="h-40 sm:h-52 rounded-2xl bg-gradient-to-br from-dark-4 to-dark-2 border border-white/10 flex flex-col justify-end p-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-1/80 to-transparent" />
                  <div className="relative z-10">
                    {badgeLabel && (
                      <div className="flex items-center gap-sm mb-sm">
                        <span className="text-[10px] font-bold bg-primary-blue/20 text-primary-blue px-2.5 py-0.5 rounded-full border border-primary-blue/30">
                          {badgeLabel}
                        </span>
                        <span className="text-body-extra-small text-text-secondary font-inter">Selected Package</span>
                      </div>
                    )}
                    <h2 className="text-heading-small md:text-heading-medium text-text-primary font-inter">{selectedPkg.name} Package</h2>
                    <p className="text-body-small text-text-secondary font-inter mt-1 max-w-md">
                      {selectedPkg.description || 'Boost your post visibility across the Unify network.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-lg pt-md">
                <PackageStatsRow
                  estimatedReach={estimatedReach}
                  audienceLabel={selectedPkg.boostConfig?.crossCategoryReach ? 'All Users' : 'Targeted'}
                  audienceDesc={selectedPkg.boostConfig?.crossCategoryReach ? 'All category feeds' : 'Own category feed'}
                  durationDays={durationDays}
                  dateRange={dateRange}
                />
              </div>

              {benefits.length > 0 && (
                <div className="px-lg pb-lg">
                  <BenefitsList benefits={benefits} />
                </div>
              )}
            </Card>
          </div>

          <div className="w-full lg:w-80 flex-shrink-0">
            <OrderSummary
              dailyRate={dailyRate} durationDays={durationDays}
              subtotal={subtotal} tax={tax} total={total}
              isPurchasing={isPurchasing}
              onProceed={handleProceedToPayment}
              onModify={handleModifyPackage}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BoostConfirmOrder;

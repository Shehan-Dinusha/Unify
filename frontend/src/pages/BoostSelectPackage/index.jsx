import React from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import { getCurrentUser } from '../../services/authService';
import { useBoostSelectPackage } from './useBoostSelectPackage';
import BoostPackageCard from './BoostPackageCard';
import BoostLivePreview from './BoostLivePreview';
import BoostOrderSummary from './BoostOrderSummary';

const BoostSelectPackage = () => {
  const navigate = useNavigate();
  const {
    packages, loading, error, fetchPackages,
    selectedPkg, effectiveSelectedId, setSelectedPkgId,
    durationLabel, subtotal, tax, total, postId,
    handleBoostNow,
  } = useBoostSelectPackage();

  React.useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  if (loading && packages.length === 0) {
    return (
      <MainLayout
        user={getCurrentUser() || { name: 'Business User', role: 'business', displayRole: 'Business & Organization' }}
        pageTitle="Boost Your Post" verificationCount={0}
      >
        <div className="flex items-center justify-center py-xl min-h-[400px]">
          <Loader2 size={32} className="text-primary-blue animate-spin" />
          <span className="ml-3 text-body-small text-text-secondary font-inter">Loading packages...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      user={getCurrentUser() || { name: 'Business User', role: 'business', displayRole: 'Business & Organization' }}
      pageTitle="Boost Your Post" verificationCount={0}
    >
      <div className="flex flex-col gap-lg">
        <div>
          <h1 className="text-heading-small md:text-heading-medium text-text-primary font-inter">
            {postId ? 'Supercharge your Ad Reach' : 'Available Boost Packages'}
          </h1>
          <p className="text-body-small text-text-secondary font-inter mt-1 max-w-2xl">
            {postId
              ? 'Select a boosting package to extend visibility and get up to 5x more views on your campaign.'
              : 'Explore our premium boosting packages designed to increase your visibility across the Unify network.'}
          </p>
        </div>

        {error && (
          <div className="bg-state-error/10 border border-state-error/30 rounded-2xl p-md">
            <p className="text-body-small text-state-error font-inter">{error}</p>
          </div>
        )}

        {packages.length === 0 && !loading && (
          <Card variant="card" padding="p-lg" className="text-center">
            <p className="text-body-small text-text-secondary font-inter">No boost packages available at the moment. Please check back later.</p>
          </Card>
        )}

        {packages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {packages.map((pkg) => (
              <BoostPackageCard key={pkg.id} pkg={pkg} isSelected={pkg.id === effectiveSelectedId} onSelect={setSelectedPkgId} />
            ))}
          </div>
        )}

        {selectedPkg && postId && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-md">
            <BoostLivePreview selectedPkg={selectedPkg} />
            <BoostOrderSummary selectedPkg={selectedPkg} durationLabel={durationLabel} subtotal={subtotal} tax={tax} total={total} onBoostNow={handleBoostNow} />
          </div>
        )}

        {!postId && (
          <div className="flex flex-col items-center justify-center py-10 gap-6">
            <div className="h-px bg-white/10 w-full max-w-md" />
            <div className="text-center">
              <p className="text-body-small text-text-secondary font-inter mb-4">You are currently viewing all available boost packages.</p>
              <button
                onClick={() => navigate('/my-posts')}
                className="h-12 px-10 rounded-2xl bg-white/5 border-2 border-white/10 text-text-primary font-inter font-bold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 active:scale-[0.95]"
              >
                <ArrowRight size={18} />
                Select a Post to Boost
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BoostSelectPackage;

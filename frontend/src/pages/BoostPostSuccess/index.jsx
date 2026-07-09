import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import Overlay from '../../components/common/Overlay';
import { Loader2, AlertTriangle } from 'lucide-react';
import Button from '../../components/common/Button';
import { useBoostPostSuccess } from './useBoostPostSuccess';
import BoostSuccessContent from './BoostSuccessContent';

const BoostPostSuccess = () => {
  const {
    navigate, user, loading, error,
    packageName, budget, durationDays,
    displayTransactionId, activationTimestamp, expiryTimestamp,
  } = useBoostPostSuccess();

  if (loading) {
    return (
      <MainLayout user={user} pageTitle="Boost Your Post" verificationCount={0}>
        <Overlay open={true} className="!transition-none">
          <Card variant="card" padding="p-lg" className="text-center max-w-sm">
            <Loader2 size={40} className="text-primary-blue animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-bold text-white mb-2">Processing Payment...</h2>
            <p className="text-text-secondary text-sm">Confirming your boost purchase with the payment provider.</p>
          </Card>
        </Overlay>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout user={user} pageTitle="Boost Your Post" verificationCount={0}>
        <Overlay open={true} className="!transition-none">
          <Card variant="card" padding="p-lg" className="text-center max-w-md">
            <div className="w-14 h-14 bg-state-error/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-state-error/5">
              <AlertTriangle size={28} className="text-state-error" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Payment Issue</h2>
            <p className="text-text-secondary text-sm mb-6">{error}</p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate('/business/boost-post')} variant="gradient" fullWidth size="medium" className="h-11 gap-2">Try Again</Button>
              <button onClick={() => navigate('/my-posts')}
                className="w-full h-11 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 active:scale-[0.98] transition-all duration-200">
                Back to My Posts
              </button>
            </div>
          </Card>
        </Overlay>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user} pageTitle="Boost Your Post" verificationCount={0}>
      <Overlay open={true} className="py-6 overflow-y-auto">
        <BoostSuccessContent
          packageName={packageName} durationDays={durationDays}
          transactionId={displayTransactionId}
          activationTimestamp={activationTimestamp}
          expiryTimestamp={expiryTimestamp}
          budget={budget}
          onViewFeed={() => navigate('/news-feed')}
          onMyPosts={() => navigate('/my-posts')}
        />
      </Overlay>
    </MainLayout>
  );
};

export default BoostPostSuccess;

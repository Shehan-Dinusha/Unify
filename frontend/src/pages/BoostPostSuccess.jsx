import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import { CheckCircle2, ArrowRight, CalendarDays, Loader2, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const BoostPostSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [boostData, setBoostData] = useState(null);

  // Stripe redirects back with ?session_id=... in the URL
  const sessionId = searchParams.get('session_id');

  // Data may also come from location.state (fallback for non-Stripe flow)
  const locationState = location.state || {};

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        setLoading(true);

        if (sessionId) {
          // Import the service method
          const { confirmBoostPayment } = await import('../services/boostService');

          // Verify the Stripe session and finalize the boost purchase
          const response = await confirmBoostPayment(sessionId);

          if (response?.success && response?.data) {
            setBoostData(response.data);
          } else {
            throw new Error('Failed to confirm boost payment.');
          }
        } else if (locationState.packageName) {
          // Fallback: data was passed via location.state (non-Stripe flow)
          setBoostData({
            packageName: locationState.packageName,
            budget: locationState.budget,
            durationDays: locationState.durationDays,
            transactionId: locationState.transactionId,
            purchaseDate: locationState.purchaseDate,
            expiryDate: locationState.expiryDate,
            purchaseId: locationState.purchaseId,
          });
        } else {
          throw new Error('No payment session found. Please try boosting again.');
        }
      } catch (err) {
        console.error('Boost confirmation error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to confirm payment.');
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Format dates from DB response
  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Loading state
  if (loading) {
    return (
      <MainLayout
        user={{ name: 'Alex Johnson', role: 'business', displayRole: 'Business & Organization' }}
        pageTitle="Boost Your Post"
        verificationCount={0}
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl">
          <Card variant="card" padding="p-lg" className="text-center max-w-sm">
            <Loader2 size={40} className="text-primary-blue animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-bold text-white mb-2">Processing Payment...</h2>
            <p className="text-text-secondary text-sm">
              Confirming your boost purchase with the payment provider.
            </p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout
        user={{ name: 'Alex Johnson', role: 'business', displayRole: 'Business & Organization' }}
        pageTitle="Boost Your Post"
        verificationCount={0}
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl px-4">
          <Card variant="card" padding="p-lg" className="text-center max-w-md">
            <div className="w-14 h-14 bg-state-error/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-state-error/5">
              <AlertTriangle size={28} className="text-state-error" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Payment Issue</h2>
            <p className="text-text-secondary text-sm mb-6">{error}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/business/boost-post')}
                className="w-full h-11 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-blue/30 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/my-posts')}
                className="w-full h-11 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 active:scale-[0.98] transition-all duration-200"
              >
                Back to My Posts
              </button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Success state
  const {
    packageName = 'Boost Package',
    budget = 0,
    durationDays = 0,
    transactionId,
    purchaseDate,
    expiryDate,
  } = boostData || {};

  const displayTransactionId = transactionId || `#TXN-${Date.now()}`;
  const activationTimestamp = formatDateTime(purchaseDate);
  const expiryTimestamp = formatDateTime(expiryDate);

  return (
    <MainLayout
      user={{ name: 'Alex Johnson', role: 'business', displayRole: 'Business & Organization' }}
      pageTitle="Boost Your Post"
      verificationCount={0}
    >
      {/* Success Modal — inside MainLayout so sidebar shows behind blur */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4 py-6 overflow-y-auto">
        <Card
          variant="card"
          padding="p-0"
          className="w-full max-w-[480px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl my-auto"
        >
          <div className="p-6 sm:p-8 pb-4 sm:pb-6 flex flex-col items-center text-center">
            {/* Success Icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-state-success/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 ring-4 ring-state-success/5">
              <CheckCircle2 size={28} className="text-state-success sm:hidden" />
              <CheckCircle2 size={32} className="text-state-success hidden sm:block" />
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
              Boost Activated Successfully
            </h2>
            <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 max-w-sm">
              Your listing is now being promoted to a wider audience with premium priority.
            </p>

            {/* Transaction Details Card — all from DB response */}
            <div className="w-full bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-4 sm:mb-6">
              {/* Campaign Header */}
              <div className="p-md sm:p-lg flex items-center gap-md">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary-blue/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={24} className="text-primary-blue" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-sm">
                    <h4 className="text-body-small-bold sm:text-body-medium-bold text-text-primary font-inter truncate">
                      {packageName} Boost
                    </h4>
                    <span className="text-[10px] font-bold bg-state-success/15 text-state-success px-2 py-0.5 rounded-full flex-shrink-0">
                      Active
                    </span>
                  </div>
                  <p className="text-body-extra-small text-text-secondary font-inter">
                    ID: {displayTransactionId}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <CalendarDays size={11} className="text-text-secondary" />
                    <span className="text-body-extra-small text-text-secondary font-inter">
                      Ends in {durationDays} days
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats from DB */}
              <div className="border-t border-white/10 grid grid-cols-3 divide-x divide-white/10">
                <div className="p-md sm:p-lg text-left">
                  <p className="text-body-extra-small text-text-secondary font-inter mb-0.5">Budget</p>
                  <p className="text-body-small-bold sm:text-body-medium-bold text-text-primary font-inter">
                    Rs.{Number(budget).toLocaleString()}
                  </p>
                </div>
                <div className="p-md sm:p-lg text-left">
                  <p className="text-body-extra-small text-text-secondary font-inter mb-0.5">Activated</p>
                  <p className="text-body-small-bold sm:text-body-medium-bold text-text-primary font-inter">
                    {activationTimestamp}
                  </p>
                </div>
                <div className="p-md sm:p-lg text-left">
                  <p className="text-body-extra-small text-text-secondary font-inter mb-0.5">Expires</p>
                  <p className="text-body-small-bold sm:text-body-medium-bold text-text-primary font-inter">
                    {expiryTimestamp}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-1 sm:pt-2 flex flex-col gap-3">
            <button
              onClick={() => navigate('/news-feed')}
              className="w-full h-11 sm:h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
            >
              View Boosted Listing <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/my-posts')}
              className="w-full h-11 sm:h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"
            >
              Return to My Posts
            </button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BoostPostSuccess;

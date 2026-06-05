import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';

const formatDateTime = (isoString) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

export const useBoostPostSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [boostData, setBoostData] = useState(null);

  const sessionId = searchParams.get('session_id');
  const locationState = location.state || {};

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        setLoading(true);
        if (sessionId) {
          const { confirmBoostPayment } = await import('../../services/boostService');
          const response = await confirmBoostPayment(sessionId);
          if (response?.success && response?.data) {
            setBoostData(response.data);
          } else {
            throw new Error('Failed to confirm boost payment.');
          }
        } else if (locationState.packageName) {
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
        setError(err.response?.data?.message || err.message || 'Failed to confirm payment.');
      } finally {
        setLoading(false);
      }
    };
    confirmPayment();
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const user = getCurrentUser() || { name: 'Business User', role: 'business', displayRole: 'Business & Organization' };

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

  return {
    navigate, user, loading, error, boostData,
    packageName, budget, durationDays,
    displayTransactionId, activationTimestamp, expiryTimestamp,
  };
};

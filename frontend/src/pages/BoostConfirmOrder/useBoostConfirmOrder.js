import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBoostPackages } from '../../context/BoostPackageContext';
import { getCurrentUser } from '../../services/authService';

export const useBoostConfirmOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { packages } = useBoostPackages();

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);

  const {
    packageId,
    postId,
    postType,
    subtotal: passedSubtotal,
    tax: passedTax,
    total: passedTotal,
    durationDays: passedDuration,
  } = location.state || {};

  const selectedPkg = packages.find((p) => p.id === packageId) || packages[0];

  const durationDays =
    passedDuration ||
    (selectedPkg?.durationUnit === 'Hours'
      ? 1
      : selectedPkg?.durationUnit === 'Days'
        ? selectedPkg?.durationValue
        : selectedPkg?.durationValue * 7);

  const dailyRate = durationDays > 0 ? Math.round(Number(selectedPkg?.price) / durationDays * 100) / 100 : Number(selectedPkg?.price);
  const subtotal = passedSubtotal || Number(selectedPkg?.price);
  const tax = passedTax ?? 0;
  const total = passedTotal || subtotal + tax;

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + durationDays);
  const formatDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const dateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  const getEstimatedReach = () => {
    const config = selectedPkg?.boostConfig || {};
    const baseReach = 500;
    const priorityBonus = Math.max(1, (11 - (config.feedPriority || 10)) / 2);
    const visMultiplier = config.visibilityMultiplier || 1;
    const crossCatBonus = config.crossCategoryReach ? 2.5 : 1;
    const refreshBonus = config.autoRefreshHours ? (24 / config.autoRefreshHours) * 0.3 + 1 : 1;
    const totalReach = Math.round(baseReach * durationDays * priorityBonus * visMultiplier * crossCatBonus * refreshBonus);
    if (totalReach >= 10000) return `~${Math.round(totalReach / 1000)}k Views`;
    if (totalReach >= 1000) return `~${(totalReach / 1000).toFixed(1)}k Views`;
    return `~${totalReach} Views`;
  };

  const estimatedReach = getEstimatedReach();

  const badgeLabel = selectedPkg?.badge === 'Most Popular'
    ? 'Most Popular'
    : selectedPkg?.badge === 'Premium'
      ? 'Best Value'
      : selectedPkg?.badge !== 'No Badge' && selectedPkg?.badge !== undefined
        ? selectedPkg.badge
        : null;

  const benefits = (selectedPkg?.features || []).slice(0, 6);

  const user = getCurrentUser() || { name: 'Business User', role: 'business', displayRole: 'Business & Organization' };

  const handleProceedToPayment = async () => {
    setIsPurchasing(true);
    setPurchaseError(null);
    try {
      const { createBoostCheckoutSession } = await import('../../services/boostService');
      const response = await createBoostCheckoutSession({
        packageId, postId: postId || null, postType: postType || null,
        amount: total, packageName: selectedPkg.name, durationDays,
      });
      if (response?.success && response?.url) {
        window.location.href = response.url;
      } else {
        throw new Error('Failed to create checkout session.');
      }
    } catch (err) {
      setPurchaseError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to process payment. Please try again.');
      setIsPurchasing(false);
    }
  };

  const handleModifyPackage = () => navigate('/business/boost-post');

  return {
    user, navigate, selectedPkg, isPurchasing, purchaseError,
    estimatedReach, durationDays, dateRange, dailyRate, subtotal,
    tax, total, badgeLabel, benefits, handleProceedToPayment, handleModifyPackage,
  };
};

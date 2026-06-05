import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBoostPackages } from '../../context/BoostPackageContext';

export const useBoostSelectPackage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { packages, loading, error, fetchPackages } = useBoostPackages();
  const [selectedPkgId, setSelectedPkgId] = useState(null);

  const { postId, postType } = location.state || {};

  const effectiveSelectedId = selectedPkgId || (packages.length > 0 ? packages[0].id : null);
  const selectedPkg = packages.find((p) => p.id === effectiveSelectedId) || packages[0];

  const durationDays = selectedPkg
    ? selectedPkg.durationUnit === 'Hours' ? 1
      : selectedPkg.durationUnit === 'Days' ? selectedPkg.durationValue
      : selectedPkg.durationValue * 7
    : 0;

  const subtotal = selectedPkg ? Number(selectedPkg.price) : 0;
  const taxRate = 0.008;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + tax;

  const durationLabel = selectedPkg
    ? selectedPkg.durationUnit === 'Hours' ? '24 Hours'
      : `${selectedPkg.durationValue} ${selectedPkg.durationUnit}`
    : '';

  const handleBoostNow = () => {
    navigate('/business/boost-post/confirm', {
      state: { packageId: effectiveSelectedId, postId, postType, subtotal, tax, total, durationDays },
    });
  };

  return {
    packages, loading, error, fetchPackages,
    selectedPkg, effectiveSelectedId, setSelectedPkgId,
    durationLabel, subtotal, tax, total, postId,
    handleBoostNow, navigate,
  };
};

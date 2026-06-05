import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoostPackages } from '../../context/BoostPackageContext';

export const useBoostController = () => {
    const navigate = useNavigate();
    const { packages, logs, stats, loading, error, deletePackage, fetchPackages, fetchLogs, fetchStats } = useBoostPackages();

    useEffect(() => {
        fetchPackages();
        fetchLogs();
        fetchStats();
    }, [fetchPackages, fetchLogs, fetchStats]);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const visibleCount = 3;
    const maxIndex = Math.max(0, packages.length - visibleCount);
    const canGoLeft = carouselIndex > 0;
    const canGoRight = carouselIndex < maxIndex;

    const goLeft = () => setCarouselIndex(prev => Math.max(0, prev - 1));
    const goRight = () => setCarouselIndex(prev => Math.min(maxIndex, prev + 1));
    const visiblePackages = packages.slice(carouselIndex, carouselIndex + visibleCount);

    const handleDeleteClick = (pkg) => {
        setDeleteTarget(pkg);
    };

    const confirmDelete = async () => {
        if (deleteTarget) {
            setIsDeleting(true);
            try {
                await deletePackage(deleteTarget.id);
                setDeleteTarget(null);
                const newLen = packages.length - 1;
                const newMax = Math.max(0, newLen - visibleCount);
                if (carouselIndex > newMax) setCarouselIndex(newMax);
            } catch (err) {
                console.error('Failed to delete package:', err.message);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const cancelDelete = () => {
        setDeleteTarget(null);
    };

    const statTiles = [
        {
            label: 'Active Packages',
            value: String(packages.length),
            change: stats ? `${stats.activePackages} live` : '~',
            changeColor: 'text-text-secondary',
        },
        {
            label: 'Monthly Revenue',
            value: stats ? `Rs. ${Number(stats.monthlyRevenue).toLocaleString()}` : 'Loading...',
            change: stats ? `${stats.revenueChange >= 0 ? '\u2191' : '\u2193'}${Math.abs(stats.revenueChange)}%` : '',
            changeColor: stats && stats.revenueChange >= 0 ? 'text-state-success' : 'text-state-error',
        },
        {
            label: 'Total Boosts (30d)',
            value: stats ? String(stats.totalBoosts30d) : 'Loading...',
            change: stats ? `${stats.boostsChange >= 0 ? '\u2191' : '\u2193'}${Math.abs(stats.boostsChange)}%` : '',
            changeColor: stats && stats.boostsChange >= 0 ? 'text-state-success' : 'text-state-error',
        },
        {
            label: 'Average Duration',
            value: stats ? `${stats.avgDurationDays} Days` : 'Loading...',
            change: 'Avg',
            changeColor: 'text-text-secondary',
        },
    ];

    return {
        navigate, packages, logs, loading, error,
        deleteTarget, isDeleting,
        carouselIndex, setCarouselIndex,
        maxIndex, canGoLeft, canGoRight,
        goLeft, goRight, visiblePackages,
        handleDeleteClick, confirmDelete, cancelDelete,
        statTiles,
    };
};

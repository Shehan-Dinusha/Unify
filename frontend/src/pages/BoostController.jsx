import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useBoostPackages } from '../context/BoostPackageContext';
import { getCurrentUser } from '../services/authService';
import { Plus, Pencil, CheckCircle2, DollarSign, Clock, Trash2, AlertTriangle, ChevronLeft, ChevronRight, RefreshCw, Loader2 } from 'lucide-react';

const BoostController = () => {
    const navigate = useNavigate();
    const { packages, logs, stats, loading, error, deletePackage, fetchPackages, fetchLogs, fetchStats } = useBoostPackages();

    // Fetch data on mount to ensure fresh data even if accessed via client-side navigation
    React.useEffect(() => {
        fetchPackages();
        fetchLogs();
        fetchStats();
    }, [fetchPackages, fetchLogs, fetchStats]);

    // Delete modal state
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Carousel state — show 3 cards at a time
    const [carouselIndex, setCarouselIndex] = useState(0);
    const visibleCount = 3;
    const maxIndex = Math.max(0, packages.length - visibleCount);
    const canGoLeft = carouselIndex > 0;
    const canGoRight = carouselIndex < maxIndex;

    const goLeft = () => setCarouselIndex(prev => Math.max(0, prev - 1));
    const goRight = () => setCarouselIndex(prev => Math.min(maxIndex, prev + 1));

    // Visible packages for the current carousel window
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
                // Adjust carousel index if needed
                const newLen = packages.length - 1;
                const newMax = Math.max(0, newLen - visibleCount);
                if (carouselIndex > newMax) {
                    setCarouselIndex(newMax);
                }
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

    // Stats data — computed from DB via context
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

    return (
            <MainLayout
                user={getCurrentUser() || { name: 'Admin', role: 'Admin' }}
                pageTitle="Boost Moderation"
                verificationCount={0}
            >
                <div className="flex flex-col gap-lg">
                    {/* Title + Add Button */}
                    <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-md">
                        <div>
                            <h1 className="text-heading-small text-text-primary font-inter">Ad Boosting Packages</h1>
                            <p className="text-body-small text-text-secondary font-inter mt-1">
                                Configure and manage promotion tiers for Sri Lankan university advertisements.
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            size="medium"
                            icon={Plus}
                            onClick={() => navigate('/boost-controller/new')}
                        >
                            Add New Package
                        </Button>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="bg-state-error/10 border border-state-error/30 rounded-2xl p-md flex items-center gap-sm">
                            <AlertTriangle size={18} className="text-state-error flex-shrink-0" />
                            <p className="text-body-small text-state-error font-inter">{error}</p>
                        </div>
                    )}

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                        {statTiles.map((stat, i) => (
                            <Card key={i} variant="container" padding="p-md">
                                <div className="flex flex-col gap-sm">
                                    <p className="text-body-extra-small text-text-secondary font-inter">{stat.label}</p>
                                    <div className="flex items-end justify-between">
                                        <span className="text-base md:text-heading-small text-text-primary font-inter whitespace-nowrap">{stat.value}</span>
                                        <span className={`text-body-extra-small-bold font-inter ${stat.changeColor}`}>{stat.change}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Loading State */}
                    {loading && packages.length === 0 && (
                        <div className="flex items-center justify-center py-xl">
                            <Loader2 size={32} className="text-primary-blue animate-spin" />
                            <span className="ml-3 text-body-small text-text-secondary font-inter">Loading packages...</span>
                        </div>
                    )}

                    {/* Package Cards Carousel */}
                    {packages.length > 0 && (
                    <div className="relative">
                        {/* Left Arrow */}
                        {canGoLeft && (
                            <button
                                onClick={goLeft}
                                className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-2 border border-white/15 flex items-center justify-center shadow-lg hover:bg-white/10 hover:border-white/25 active:scale-95 transition-all duration-200"
                            >
                                <ChevronLeft size={20} className="text-text-primary" />
                            </button>
                        )}

                        {/* Right Arrow */}
                        {canGoRight && (
                            <button
                                onClick={goRight}
                                className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-2 border border-white/15 flex items-center justify-center shadow-lg hover:bg-white/10 hover:border-white/25 active:scale-95 transition-all duration-200"
                            >
                                <ChevronRight size={20} className="text-text-primary" />
                            </button>
                        )}

                        {/* Cards Grid — always 3 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                            {visiblePackages.map((pkg) => (
                                <Card
                                    key={pkg.id}
                                    variant="card"
                                    padding="p-lg"
                                    className="hover:border-primary-blue/50 group"
                                >
                                    <div className="flex flex-col h-full">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-md">
                                            <h3 className="text-body-large-bold text-text-primary font-inter">{pkg.name}</h3>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => navigate(`/boost-controller/edit/${encodeURIComponent(pkg.id)}`)}
                                                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary-blue/20 transition-colors"
                                                >
                                                    <Pencil size={14} className="text-text-secondary group-hover:text-text-primary" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(pkg)}
                                                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-state-error/20 transition-colors"
                                                >
                                                    <Trash2 size={14} className="text-text-secondary hover:text-state-error transition-colors" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-baseline gap-1 mb-1">
                                            <span className="text-base md:text-heading-small text-text-primary font-inter font-bold whitespace-nowrap">Rs. {Number(pkg.price).toLocaleString()}</span>
                                            <span className="text-body-extra-small text-text-secondary font-inter">/ {pkg.duration}</span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-body-extra-small text-text-secondary font-inter mb-lg leading-relaxed">
                                            {pkg.description}
                                        </p>

                                        {/* Features */}
                                        <div className="flex flex-col gap-sm mt-auto">
                                            {(pkg.features || []).map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-sm">
                                                    <CheckCircle2 size={16} className="text-state-success flex-shrink-0" />
                                                    <span className="text-body-small text-text-soft font-inter">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Status Footer */}
                                        <div className="flex items-center justify-between mt-lg pt-md border-t border-white/10">
                                            <span className="text-body-small text-text-secondary font-inter">Active Status</span>
                                            <div className="flex items-center gap-xs">
                                                <div className="w-2 h-2 rounded-full bg-state-success animate-pulse" />
                                                <span className="text-body-small-bold text-state-success font-inter">LIVE</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination Dots */}
                        {packages.length > visibleCount && (
                            <div className="flex items-center justify-center gap-1.5 mt-md">
                                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCarouselIndex(i)}
                                        className={`h-1.5 rounded-full transition-all duration-200 ${i === carouselIndex
                                            ? 'w-6 bg-primary-blue'
                                            : 'w-1.5 bg-white/20 hover:bg-white/40'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    )}

                    {/* Empty state */}
                    {!loading && packages.length === 0 && !error && (
                        <Card variant="card" padding="p-lg" className="text-center">
                            <p className="text-body-small text-text-secondary font-inter">
                                No boost packages configured yet. Click "Add New Package" to create one.
                            </p>
                        </Card>
                    )}

                    {/* Recent Configuration Changes */}
                    <Card variant="card" padding="p-lg">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-sm mb-lg">
                            <div className="flex items-center gap-sm">
                                <Clock size={20} className="text-text-secondary" />
                                <h3 className="text-body-large-bold text-text-primary font-inter">Recent Configuration Changes</h3>
                            </div>
                            <button className="text-body-small-bold text-primary-blue font-inter hover:underline transition-all hidden md:block">
                                View All Logs
                            </button>
                        </div>
                        {logs.length === 0 && !loading && (
                            <p className="text-body-small text-text-secondary font-inter py-md text-center">No configuration changes recorded yet.</p>
                        )}
                        <div className="flex flex-col">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-start gap-md py-md border-b border-white/5 last:border-0"
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${log.type === 'package_added' ? 'bg-state-success/15' :
                                            log.type === 'package_deleted' ? 'bg-state-error/15' :
                                                'bg-primary-blue/15'
                                        }`}>
                                        {log.type === 'package_added' && <CheckCircle2 size={18} className="text-state-success" />}
                                        {log.type === 'package_deleted' && <Trash2 size={18} className="text-state-error" />}
                                        {log.type === 'package_updated' && <RefreshCw size={18} className="text-primary-blue" />}
                                        {(!['package_added', 'package_deleted', 'package_updated'].includes(log.type)) && <Clock size={18} className="text-text-secondary" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-sm">
                                            <p className="text-body-small-bold text-text-primary font-inter leading-tight">{log.title}</p>
                                            <span className="text-body-extra-small text-text-secondary font-inter whitespace-nowrap shrink-0 hidden md:inline">{log.time}</span>
                                        </div>
                                        <p className="text-body-extra-small text-text-secondary font-inter mt-0.5">{log.description}</p>
                                        <span className="text-body-extra-small text-text-tertiary font-inter mt-1 block md:hidden">{log.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Delete Confirmation Modal — inside MainLayout so sidebar shows behind blur */}
                {deleteTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4">
                        <Card variant="card" padding="p-0" className="w-full max-w-[420px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl">
                            <div className="p-8 pb-6 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-state-error/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-error/5">
                                    <AlertTriangle size={32} className="text-state-error" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-3">Delete Package?</h2>
                                <p className="text-text-secondary text-sm leading-relaxed mb-2 max-w-sm">
                                    Are you sure you want to delete the <span className="text-text-primary font-semibold">"{deleteTarget.name}"</span> package? This action cannot be undone.
                                </p>
                            </div>
                            <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-state-error to-red-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-error/30 hover:shadow-xl hover:shadow-state-error/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                    {isDeleting ? 'Deleting...' : 'Yes, Delete Package'}
                                </button>
                                <button onClick={cancelDelete} disabled={isDeleting} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200 disabled:opacity-50">
                                    Cancel
                                </button>
                            </div>
                        </Card>
                    </div>
                )}
            </MainLayout>
    );
};

export default BoostController;

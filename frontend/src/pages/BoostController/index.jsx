import React from 'react';
import { Plus, AlertTriangle, Loader2 } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getCurrentUser } from '../../services/authService';
import { useBoostController } from './useBoostController';
import BoostStatsCards from './BoostStatsCards';
import PackageCarousel from './PackageCarousel';
import ConfigurationLogs from './ConfigurationLogs';
import DeleteConfirmModal from './DeleteConfirmModal';

const BoostController = () => {
    const {
        navigate, packages, logs, loading, error,
        deleteTarget, isDeleting,
        carouselIndex, setCarouselIndex,
        maxIndex, canGoLeft, canGoRight,
        goLeft, goRight, visiblePackages,
        handleDeleteClick, confirmDelete, cancelDelete,
        statTiles,
    } = useBoostController();

    return (
        <MainLayout
            user={getCurrentUser() || { name: 'Admin', role: 'Admin' }}
            pageTitle="Boost Moderation"
            verificationCount={0}
        >
            <div className="flex flex-col gap-lg">
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

                {error && (
                    <div className="bg-state-error/10 border border-state-error/30 rounded-2xl p-md flex items-center gap-sm">
                        <AlertTriangle size={18} className="text-state-error flex-shrink-0" />
                        <p className="text-body-small text-state-error font-inter">{error}</p>
                    </div>
                )}

                <BoostStatsCards statTiles={statTiles} />

                {loading && packages.length === 0 && (
                    <div className="flex items-center justify-center py-xl">
                        <Loader2 size={32} className="text-primary-blue animate-spin" />
                        <span className="ml-3 text-body-small text-text-secondary font-inter">Loading packages...</span>
                    </div>
                )}

                {packages.length > 0 && (
                    <PackageCarousel
                        visiblePackages={visiblePackages}
                        canGoLeft={canGoLeft}
                        canGoRight={canGoRight}
                        goLeft={goLeft}
                        goRight={goRight}
                        carouselIndex={carouselIndex}
                        setCarouselIndex={setCarouselIndex}
                        maxIndex={maxIndex}
                        onEdit={(pkg) => navigate(`/boost-controller/edit/${encodeURIComponent(pkg.id)}`)}
                        onDelete={handleDeleteClick}
                    />
                )}

                {!loading && packages.length === 0 && !error && (
                    <Card variant="card" padding="p-lg" className="text-center">
                        <p className="text-body-small text-text-secondary font-inter">
                            No boost packages configured yet. Click &quot;Add New Package&quot; to create one.
                        </p>
                    </Card>
                )}

                <ConfigurationLogs logs={logs} loading={loading} />

                <DeleteConfirmModal
                    open={deleteTarget !== null}
                    target={deleteTarget}
                    isDeleting={isDeleting}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            </div>
        </MainLayout>
    );
};

export default BoostController;

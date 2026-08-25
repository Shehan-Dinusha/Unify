import React from 'react';
import { Loader2 } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useClubProduct } from './useClubProduct';
import ImageGallery from './ImageGallery';
import ProductDetails from './ProductDetails';
import BuyBar from './BuyBar';

const ClubProduct = () => {
    const {
        navigate, user, post, loading, error,
        activeImg, setActiveImg, activeColor, setActiveColor,
        activeSize, setActiveSize, qty, setQty,
        isDescExpanded, setIsDescExpanded, activeTier, setActiveTier,
        images, currentImg, finalPrice, handleBuy,
    } = useClubProduct();

    if (loading) {
        return (
            <MainLayout user={user} pageTitle="Club" verificationCount={0}>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="w-12 h-12 text-primary-blue animate-spin" />
                    <p className="text-text-secondary text-body-large">Loading product details...</p>
                </div>
            </MainLayout>
        );
    }

    if (error || !post) {
        return (
            <MainLayout user={user} pageTitle="Club" verificationCount={0}>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl">{'\uD83D\uDED2'}</span>
                    </div>
                    <h2 className="text-heading-medium text-text-primary mb-2">Oops!</h2>
                    <p className="text-text-secondary mb-8">{error || 'Something went wrong.'}</p>
                    <Button variant="outline" onClick={() => navigate('/marketplace/club')}>Back to Marketplace</Button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout user={user} pageTitle="Club" verificationCount={0}>
            <Card variant="card" padding="p-0" className="overflow-hidden mb-lg md:mb-2xl">
                <div className="p-md md:p-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-[520px_1fr] gap-2xl">
                        <ImageGallery images={images} currentImg={currentImg} activeImg={activeImg} onSelect={setActiveImg} />
                        <div className="flex flex-col h-full">
                            <ProductDetails
                                post={post}
                                activeColor={activeColor} setActiveColor={setActiveColor}
                                activeSize={activeSize} setActiveSize={setActiveSize}
                                activeTier={activeTier} setActiveTier={setActiveTier}
                                isDescExpanded={isDescExpanded} setIsDescExpanded={setIsDescExpanded}
                                finalPrice={finalPrice}
                            />
                            <div className="mt-auto pt-xl">
                                <BuyBar qty={qty} onQtyChange={setQty} onBuy={handleBuy} pickupNote={post.pickupNote} />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </MainLayout>
    );
};

export default ClubProduct;

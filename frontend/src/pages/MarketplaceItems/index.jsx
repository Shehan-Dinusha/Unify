import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import MarketplaceItemCard from '../../components/marketplace/MarketplaceItemCard';
import { Calendar, Loader2 } from 'lucide-react';
import newsfeedService from '../../services/newsfeedService';
import { getImageUrl } from '../../utils/formatters';
import { getCurrentUser } from '../../services/authService';

const MarketplaceItems = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentUser = getCurrentUser();
    const user = {
        name: currentUser?.name || 'User',
        role: currentUser?.role?.toLowerCase() || 'student',
        avatar: currentUser?.avatar,
    };

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const data = await newsfeedService.getMarketplaceItemsToday();
                setItems(data.items || []);
            } catch (err) {
                // intentionally empty
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const handleItemClick = (postId) => {
        navigate('/news-feed', { state: { targetPostId: postId, targetPostType: 'club-product' } });
    };

    return (
        <MainLayout
            user={user}
            pageTitle={
                <div className="flex items-center gap-4">
                    <span>New Marketplace Items</span>
                    <div className="flex items-center gap-1.5 text-text-secondary text-body-small font-normal">
                        <Calendar size={16} />
                        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                    </div>
                </div>
            }
            verificationCount={0}
        >
            <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto mt-4 px-4 md:px-0">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
                        <p className="text-text-secondary">Finding new items...</p>
                    </div>
                ) : items.length > 0 ? (
                    items.map((item) => (
                        <MarketplaceItemCard
                            key={item.id}
                            title={item.name}
                            description={item.description ? item.description.split('\n').map((line, i) => <span key={i}>{line}<br /></span>) : null}
                            price={`Rs. ${item.price}`}
                            image={getImageUrl(item.images?.[0] || item.image)}
                            onClick={() => handleItemClick(item.id)}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <p className="text-text-secondary">No new marketplace items added today.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default MarketplaceItems;

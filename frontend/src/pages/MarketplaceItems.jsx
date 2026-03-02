import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import MarketplaceItemCard from '../components/marketplace/MarketplaceItemCard';
import { Calendar } from 'lucide-react';

// Example structured mock data specifically for this page design based on image
const marketplaceItems = [
    {
        id: 1,
        postId: 6, // Matches "Hackathon 2026 Hoodie" in mockData.js
        title: "Hackathon 2026 Hoodie",
        description: "High quality cotton blend with embroidered logo.\nPre-order now to guarantee your size",
        price: "Price: Rs. 2500.00",
        image: "/img_post6.jpg"
    },
    {
        id: 2,
        postId: 7, // Matches "Calculus Early Transcendentals" in mockData.js
        title: "Calculus Early Transcendentals",
        description: "High quality pages with beautifully embossed cover.\nPre-order now to reserve your copy and dive into the code.",
        price: "Price: Rs. 1050.00",
        image: "/img_post7.jpg"
    }
];

const MarketplaceItems = () => {
    const navigate = useNavigate();
    const user = {
        name: "Alex Johnson",
        role: "student"
    };

    const handleItemClick = (postId) => {
        navigate('/news-feed', { state: { targetPostId: postId } });
    };

    return (
        <MainLayout
            user={user}
            pageTitle={
                <div className="flex items-center gap-4">
                    <span>New Marketplace Items</span>
                    <div className="flex items-center gap-1.5 text-text-secondary text-body-small font-normal">
                        <Calendar size={16} />
                        <span>Wednesday, Feb 14</span>
                    </div>
                </div>
            }
            verificationCount={0}
        >
            <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto mt-4 px-4 md:px-0">

                {marketplaceItems.map((item) => (
                    <MarketplaceItemCard
                        key={item.id}
                        title={item.title}
                        description={item.description.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
                        price={item.price}
                        image={item.image}
                        onClick={() => handleItemClick(item.postId)}
                    />
                ))}

            </div>
        </MainLayout>
    );
};

export default MarketplaceItems;

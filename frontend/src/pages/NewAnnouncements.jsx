import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AnnouncementCard from '../components/announcements/AnnouncementCard';
import { Calendar, Loader2 } from 'lucide-react';
import newsfeedService from '../services/newsfeedService';
import { getImageUrl } from '../utils/formatters';

const NewAnnouncements = () => {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = {
        name: "Alex Johnson",
        role: "student"
    };

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setLoading(true);
                const data = await newsfeedService.getNewAnnouncements();
                setAnnouncements(data.announcements || []);
            } catch (err) {
                console.error("Failed to fetch announcements:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    const handleAnnouncementClick = (postId, postType) => {
        navigate('/news-feed', { state: { targetPostId: postId, targetPostType: postType } });
    };

    return (
        <MainLayout
            user={user}
            pageTitle={
                <div className="flex items-center gap-4">
                    <span>New Announcements</span>
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
                        <p className="text-text-secondary">Finding new announcements...</p>
                    </div>
                ) : announcements.length > 0 ? (
                    announcements.map((item) => (
                        <AnnouncementCard
                            key={item.id}
                            title={item.title || item.name || "Announcement"}
                            location={item.location}
                            description={item.description}
                            image={getImageUrl(item.images?.[0] || item.coverImage)}
                            onClick={() => handleAnnouncementClick(item.id, item.postType || 'normal')}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <p className="text-text-secondary">No new announcements today.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default NewAnnouncements;

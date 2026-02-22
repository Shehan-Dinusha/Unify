import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AnnouncementCard from '../components/announcements/AnnouncementCard';
import { Calendar } from 'lucide-react';

// Using mockData posts with id: 1 and 2
const announcementsData = [
    {
        id: 1,
        postId: 1,
        title: "Millenium",
        location: "0.2 km from Central Library",
        description: "Perfect for grad students. Quiet, private entrance, kitchenette included.",
        image: "/img_post1.jpg"
    },
    {
        id: 2,
        postId: 2,
        title: "Hackathon 2026 Registration Open!",
        location: "Main Auditorium",
        description: "Teams of 4. Prizes worth Rs.50000. Don't miss this opportunity to build something amazing!",
        image: "/img_post2.jpg"
    }
];

const NewAnnouncements = () => {
    const navigate = useNavigate();
    const user = {
        name: "Alex Johnson",
        role: "student"
    };

    const handleAnnouncementClick = (postId) => {
        navigate('/news-feed', { state: { targetPostId: postId } });
    };

    return (
        <MainLayout
            user={user}
            pageTitle={
                <div className="flex items-center gap-4">
                    <span>New Announcements</span>
                    <div className="flex items-center gap-1.5 text-text-secondary text-body-small font-normal">
                        <Calendar size={16} />
                        <span>Today</span>
                    </div>
                </div>
            }
            verificationCount={0}
        >
            <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto mt-4 px-4 md:px-0">

                {announcementsData.map((item) => (
                    <AnnouncementCard
                        key={item.id}
                        title={item.title}
                        location={item.location}
                        description={item.description}
                        image={item.image}
                        onClick={() => handleAnnouncementClick(item.postId)}
                    />
                ))}

            </div>
        </MainLayout>
    );
};

export default NewAnnouncements;

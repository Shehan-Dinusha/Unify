import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import EventItemCard from '../components/events/EventItemCard';
import { Calendar } from 'lucide-react';

// Using the requested mockData records (id: 3 and 4)
const eventsTodayData = [
    {
        id: 1,
        postId: 3,
        title: "Open mic Night",
        location: "Student Center Atrium",
        description: "Free entry for all students. Snacks provided. It's going to be a night filled with amazing performances from our talented students.",
        image: "/img_post3.jpg"
    },
    {
        id: 2,
        postId: 4,
        title: "Career Fair Prep Workshop",
        location: "Lecture Hall B",
        description: "This introductory lecture will explore the foundations of computer science, including problem-solving techniques, programming basics, and real-world applications. Hosted by Prof. Alan Turing, this session is perfect for students considering a major in CS or anyone interested in understanding the technology shaping our world.",
        image: "/img_post4.jpg"
    }
];

const EventsToday = () => {
    const navigate = useNavigate();
    const user = {
        name: "Alex Johnson",
        role: "student"
    };

    const handleEventClick = (postId) => {
        navigate('/news-feed', { state: { targetPostId: postId } });
    };

    return (
        <MainLayout
            user={user}
            pageTitle={
                <div className="flex items-center gap-4">
                    <span>Events Today</span>
                    <div className="flex items-center gap-1.5 text-text-secondary text-body-small font-normal">
                        <Calendar size={16} />
                        <span>Today</span>
                    </div>
                </div>
            }
            verificationCount={0}
        >
            <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto mt-4 px-4 md:px-0">

                {eventsTodayData.map((event) => (
                    <EventItemCard
                        key={event.id}
                        title={event.title}
                        location={event.location}
                        description={event.description}
                        image={event.image}
                        onClick={() => handleEventClick(event.postId)}
                    />
                ))}

            </div>
        </MainLayout>
    );
};

export default EventsToday;

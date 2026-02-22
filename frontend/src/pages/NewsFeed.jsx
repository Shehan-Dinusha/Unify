import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import StatsCard from "../components/common/StatsCard";
import PostCard from "../components/feed/PostCard";
import mockPosts from "../data/mockData";

const NewsFeed = () => {
  const location = useLocation();
  const postRefs = useRef({});

  const user = {
    name: "Alex Johnson",
    role: "student"
  };

  useEffect(() => {
    // Check if we arrived with a targetPostId in state
    if (location.state?.targetPostId) {
      const targetId = location.state.targetPostId;
      const targetRef = postRefs.current[targetId];

      if (targetRef) {
        // Add a slight delay to ensure rendering is complete before scrolling
        setTimeout(() => {
          targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [location.state]);

  return (
    <MainLayout
      user={user}
      pageTitle="News Feed"
      verificationCount={0}
    >
      <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto">

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">

          <Link to="/announcements">
            <StatsCard
              iconSrc="/icon_new_announcement.svg"
              iconAlt="Announcements"
              iconBgClass="bg-yellow-500/20"
              title="New Announcements"
              value="10"
            />
          </Link>

          <Link to="/marketplace">
            <StatsCard
              iconSrc="/icon_marketplace.svg"
              iconAlt="Marketplace"
              iconBgClass="bg-green-500/20"
              title="New Marketplace Items"
              value="10"
            />
          </Link>

          <Link to="/events">
            <StatsCard
              iconSrc="/icon_event_today.svg"
              iconAlt="Events"
              iconBgClass="bg-purple-500/20"
              title="Events Today"
              iconSize="w-7 h-7"
              value="10"
            />
          </Link>

        </div>

        {/* Posts Section */}
        <div className="flex flex-col gap-6 w-full">
          {mockPosts.map((post) => (
            <div
              key={post.id}
              ref={(el) => (postRefs.current[post.id] = el)}
            >
              <PostCard
                author={post.author}
                authorInitial={post.authorInitial}
                time={post.time}
                title={post.title}
                location={post.location}
                description={post.description}
                image={post.image}
                likes={post.likes}
                comments={post.comments}
                isPromoted={post.isPromoted}
              />
            </div>
          ))}
        </div>

      </div>
    </MainLayout>
  );
};

export default NewsFeed;

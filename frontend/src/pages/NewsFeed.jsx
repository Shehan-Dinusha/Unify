import React from "react";
import MainLayout from "../components/layout/MainLayout";
import StatsCard from "../components/common/StatsCard";
import PostCard from "../components/feed/PostCard";
import mockPosts from "../data/mockData";



const NewsFeed = () => {
  const user = {
    name: "Alex Johnson",
    role: "student"
  };

  return (
    <MainLayout
      user={user}
      pageTitle="News Feed"
      verificationCount={0}
    >
      <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto">

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">

          <StatsCard
            iconSrc="/icon_new_announcement.svg"
            iconAlt="Announcements"
            iconBgClass="bg-yellow-500/20"
            title="New Announcements"
            value="10"
          />

          <StatsCard
            iconSrc="/icon_marketplace.svg"
            iconAlt="Marketplace"
            iconBgClass="bg-green-500/20"
            title="New Marketplace Items"
            value="10"
          />

          <StatsCard
            iconSrc="/icon_event_today.svg"
            iconAlt="Events"
            iconBgClass="bg-purple-500/20"
            title="Events Today"
            iconSize="w-7 h-7"
            value="10"
          />

        </div>

        {/* Posts Section */}
        <div className="flex flex-col gap-6 w-full">
          {mockPosts.map((post) => (
            <PostCard
              key={post.id}
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
          ))}
        </div>

      </div>
    </MainLayout>
  );
};

export default NewsFeed;

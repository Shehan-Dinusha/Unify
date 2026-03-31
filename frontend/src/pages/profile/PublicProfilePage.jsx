import React from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import StudentPublicView from "../../components/profile/public/StudentPublicView";
import BoardingOwnerPublicView from "../../components/profile/public/BoardingOwnerPublicView";
import ClubPublicView from "../../components/profile/public/ClubPublicView";
import FoodCafePublicView from "../../components/profile/public/FoodCafePublicView";
import SelfEmployedPublicView from "../../components/profile/public/SelfEmployedPublicView";

// ------------------------------------------------------------------
// MOCK DATA — swap with GET /api/profile/:userId when backend is ready
// ------------------------------------------------------------------
const mockPublicProfiles = {
  1: {
    id: "1",
    name: "Alex Johnson",
    role: "student",
    subtitle: "Batch 23",
    badge: "B.Sc. Information Technology",
    description: "Faculty of Information Technology",
    batch: "Batch 23",
    faculty: "Faculty of Information Technology",
    profileImage: null,
    posts: [
      {
        id: 1,
        author: "Alex Johnson",
        authorInitial: "AJ",
        time: "2h ago",
        title: "Study Sessions at the Library",
        description: "Join me this weekend for some intensive exam prep at the main library. Group study works magic!",
        image: "https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?auto=compress&cs=tinysrgb&w=800",
        likes: 12,
        comments: 3,
      },
      {
        id: 2,
        author: "Alex Johnson",
        authorInitial: "AJ",
        time: "1d ago",
        title: "Batch 23 Kickoff!",
        description: "What an amazing start to the semester. Looking forward to making more memories with Batch 23.",
        image: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800",
        likes: 45,
        comments: 8,
      },
      {
        id: 3,
        author: "Alex Johnson",
        authorInitial: "AJ",
        time: "1w ago",
        title: "Hackathon 2024",
        description: "Exhausted but proud! Our team finished 3rd in the University Hackathon. Hard work pays off.",
        image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800",
        likes: 89,
        comments: 15,
      },
    ],
  },
  2: {
    id: "2",
    name: "John Doe",
    role: "boarding_owner",
    subtitle: "Registered Boarding Owner",
    badge: "Member since 2021",
    description: "Safe student accommodation near campus.",
    rating: 4.5,
    reviewCount: 12,
    facilities: [
      "WiFi Included",
      "24/7 Security",
      "Water & Electricity",
      "Furnished Rooms",
      "Parking Available",
      "Laundry Access",
    ],
    profileImage: null,
    posts: [
      {
        id: 1,
        author: "John Doe",
        authorInitial: "JD",
        time: "5h ago",
        title: "Room Available — Blue Residence",
        location: "0.5km from University",
        description: "A spacious single room is now available. Comes with an attached bathroom and study desk. Ideal for final year students.",
        image: "/img_post5.jpg",
        likes: 24,
        comments: 5,
        isPromoted: true,
      },
      {
        id: 2,
        author: "John Doe",
        authorInitial: "JD",
        time: "3d ago",
        title: "Maintenance Update",
        description: "Annual painting and plumbing maintenance completed! We're committed to providing the best living standard for students.",
        image: "/img_post6.jpg",
        likes: 18,
        comments: 2,
      },
      {
        id: 3,
        author: "John Doe",
        authorInitial: "JD",
        time: "1w ago",
        title: "Safety First!",
        description: "We've upgraded our 24/7 monitoring system and increased security personnel for your peace of mind.",
        image: "/img_post1.jpg",
        likes: 31,
        comments: 7,
      },
    ],
  },
  3: {
    id: "3",
    name: "Reader's Club",
    role: "club_society",
    subtitle: "Established in 2023",
    badge: "B.Sc. Information Technology",
    description: "A community for book lovers and writers.",
    rating: 4.2,
    reviewCount: 8,
    followerCount: 142,
    followingCount: 56,
    postCount: 36,
    profileImage: null,
    posts: [
      {
        id: 1,
        author: "Reader's Club",
        authorInitial: "RC",
        time: "3d ago",
        title: "Book Club Monthly Meeting — March 2025",
        description: "Join us this Friday for a discussion on 'The Midnight Library'. Coffee and snacks provided!",
        image: "https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800",
        likes: 56,
        comments: 12,
      },
      {
        id: 2,
        author: "Reader's Club",
        authorInitial: "RC",
        time: "1w ago",
        title: "New Members Welcome Session",
        description: "Welcome to all our new bibliophiles! Our first orientation session was a massive success.",
        image: "https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800",
        likes: 72,
        comments: 9,
      },
      {
        id: 3,
        author: "Reader's Club",
        authorInitial: "RC",
        time: "2w ago",
        title: "Writer's Workshop",
        description: "Unlock your creative potential! Our poetry and short-story workshop series starts next week.",
        image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
        likes: 41,
        comments: 4,
      },
    ],
  },
  4: {
    id: "4",
    name: "Campus Kitchen",
    role: "food_cafe",
    subtitle: "Registered Food Provider",
    badge: "Member since 2021",
    description: "Serving quality meals for students.",
    rating: 4.3,
    reviewCount: 27,
    facilities: [
      "Rice & Curry",
      "Short Eats",
      "Fresh Juices",
      "Vegan Options",
      "Takeaway",
      "Student Discounts",
    ],
    profileImage: null,
    posts: [
      {
        id: 1,
        author: "Campus Kitchen",
        authorInitial: "CK",
        time: "2h ago",
        title: "Millenium Breakfast Bowl",
        location: "0.2 km from Central Library",
        description: "Perfect for grad students. Healthy, delicious and energy-packed for long study sessions.",
        image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800",
        likes: 124,
        comments: 10,
        isPromoted: true,
      },
      {
        id: 2,
        author: "Campus Kitchen",
        authorInitial: "CK",
        time: "1d ago",
        title: "Friday Biryani Special",
        description: "Our famous Dum Biryani is back! Come early to avoid the queue. Special student price: LKR 450.",
        image: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=800",
        likes: 215,
        comments: 18,
      },
      {
        id: 3,
        author: "Campus Kitchen",
        authorInitial: "CK",
        time: "3d ago",
        title: "Late Night Delivery",
        description: "Exam season is here! We're now delivering until 1 AM for all library residents.",
        image: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=800",
        likes: 98,
        comments: 6,
      },
    ],
  },
  5: {
    id: "5",
    name: "TechHelp Services",
    role: "self_employed",
    subtitle: "Registered Service Provider",
    badge: "Member since 2021",
    description: "Student-focused support services at competitive rates.",
    rating: 4.7,
    reviewCount: 15,
    facilities: [
      "Web Development",
      "Graphic Design",
      "Math Tutoring",
      "Photography",
      "CV Writing",
    ],
    profileImage: null,
    posts: [
      {
        id: 1,
        author: "TechHelp",
        authorInitial: "TH",
        time: "1h ago",
        title: "CV Writing Masterclass",
        description: "Struggling with internship applications? I'm offering a 1-hour session to polish your CV. 100% success rate so far!",
        image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
        likes: 36,
        comments: 4,
      },
      {
        id: 2,
        author: "TechHelp",
        authorInitial: "TH",
        time: "3d ago",
        title: "Graphic Design Portfolio",
        description: "Check out my latest branding project for a campus startup. Available for freelance logo and social media design.",
        image: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800",
        likes: 64,
        comments: 11,
      },
      {
        id: 3,
        author: "TechHelp",
        authorInitial: "TH",
        time: "1w ago",
        title: "Math & Physics Tutoring",
        description: "Facing difficulties with engineering mechanics or calculus? I'm here to help. Discount for group sessions (3+ students).",
        image: "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=800",
        likes: 22,
        comments: 3,
      },
    ],
  },
};

// ------------------------------------------------------------------
// The logged-in (authenticated) user — determines the sidebar role.
// Change this to simulate different visitor roles.
// ------------------------------------------------------------------
const LOGGED_IN_USER = {
  name: "Alex Johnson",
  role: "student", // sidebar role: student | business | club | admin
  displayRole: "Student",
};

// ------------------------------------------------------------------
// Public view switcher (role of the VISITED profile)
// ------------------------------------------------------------------
const PublicViewSwitch = ({ profile }) => {
  const role = profile?.role || "student";
  switch (role) {
    case "boarding_owner":
      return <BoardingOwnerPublicView profile={profile} />;
    case "club_society":
      return <ClubPublicView profile={profile} />;
    case "food_cafe":
      return <FoodCafePublicView profile={profile} />;
    case "self_employed":
      return <SelfEmployedPublicView profile={profile} />;
    case "student":
    default:
      return <StudentPublicView profile={profile} />;
  }
};

// ------------------------------------------------------------------
// Page component
// ------------------------------------------------------------------
const PublicProfilePage = () => {
  const { userId } = useParams();

  // Fetch profile data (mock)
  const profile = mockPublicProfiles[userId] || mockPublicProfiles["1"];

  // Sidebar always reflects the logged-in user, NOT the viewed profile
  const sidebarUser = LOGGED_IN_USER;

  return (
    <MainLayout user={sidebarUser} pageTitle="Profile" verificationCount={0}>
      <div className="w-full max-w-5xl mx-auto px-1 md:px-0">
        <PublicViewSwitch profile={profile} />
      </div>
    </MainLayout>
  );
};

export default PublicProfilePage;

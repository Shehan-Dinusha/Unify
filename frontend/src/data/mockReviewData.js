export const mockReviewSummary = {
  averageRating: 4.5,
  totalReviews: 120,
  distribution: [
    { stars: 5, percentage: 50 },
    { stars: 4, percentage: 30 },
    { stars: 3, percentage: 10 },
    { stars: 2, percentage: 5 },
    { stars: 1, percentage: 5 },
  ],
};

export const mockReviews = [
  {
    id: "rev-1",
    author: {
      name: "Michael Chen",
      role: "Student",
      avatar: "https://placehold.co/40x40",
    },
    createdAt: "2 days ago",
    rating: 5,
    content:
      "Great place to study! The wifi is super fast and there are plenty of outlets. The coffee is decent, maybe a bit pricey for student budget, but the atmosphere makes up for it. Can get crowded around noon though.",
    helpfulCount: 12,
  },
  {
    id: "rev-2",
    author: {
      name: "Alex Rivera",
      role: "Student",
      avatar: "https://placehold.co/40x40",
    },
    createdAt: "2 weeks ago",
    rating: 5,
    content: "Best iced latte on campus, hands down.",
    helpfulCount: 0,
  },
  {
    id: "rev-3",
    author: {
      name: "Jessica Davis",
      role: "Student",
      initials: "JD",
      bgColor: "bg-purple-500",
    },
    createdAt: "1 week ago",
    rating: 4,
    content:
      "The sandwiches are fresh, but the service can be really slow during lunch rush. I waited 20 mins for a panini. Staff is friendly though.",
    helpfulCount: 4,
    ownerReply: {
      author: {
        name: "Campus Bites Cafe",
        role: "Owner",
        avatar: "https://placehold.co/36x36",
      },
      content:
        "Hi Jessica, thanks for your feedback. We apologize for the wait! We are currently training new staff to speed things up during the lunch rush. Hope to see you again soon.",
    },
  },
];

export const mockUserReviewSummary = {
  totalReviews: 14,
  averageRating: 4.2,
  topCategory: "Food & Cafe",
};

export const mockUserReviews = [
  {
    id: "usr-rev-1",
    targetName: "The Daily Grind Cafe",
    targetAvatar: "https://placehold.co/48x48",
    category: "Food & Cafe",
    createdAt: "Rated on Oct 24, 2023",
    rating: 5,
    content:
      "Absolutely love this spot for studying. The wifi is fast, and the coffee is reasonably priced for students. It gets a bit crowded\naround lunch, but mornings are perfect. Highly recommend the bagel sandwich!",
  },
  {
    id: "usr-rev-2",
    targetName: "Greenwood Boarding House",
    targetAvatar: "https://placehold.co/48x48",
    category: "Boarding",
    createdAt: "Rated on Sep 12, 2023",
    rating: 4,
    content:
      "Great location right next to the engineering block. The landlord is responsive to issues. However, the sound insulation between\nrooms isn't the best, so bring headphones if you need quiet.",
  },
  {
    id: "usr-rev-3",
    targetName: "Sarah Jenkins - Calculus Tutor",
    targetAvatar: "https://placehold.co/48x48",
    category: "Freelance Services",
    createdAt: "Rated on Aug 30, 2023",
    rating: 3,
    content:
      "Sarah is extremely knowledgeable in Calculus, no doubt. She helped me understand integrals well. The reason for the lower rating\nis that she cancelled our session twice last minute. Hard to rely on if you have an exam coming up soon.",
  },
  {
    id: "usr-rev-4",
    targetName: "TechFix Campus Repairs",
    targetAvatar: "https://placehold.co/48x48",
    category: "Tech Services",
    createdAt: "Rated on Jul 15, 2023",
    rating: 2,
    content:
      "Took my laptop in for a screen replacement. They said 2 days, but it took a week. When I got it back, the webcam wasn't\nconnected properly. Had to go back again. Not the best experience.",
  },
];

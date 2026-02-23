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

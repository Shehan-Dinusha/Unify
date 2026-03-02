// Pre-defined realistic data based on the provided design
let allFollowings = [
  {
    id: 1,
    name: "Photography Society",
    category: "Arts",
    description:
      "Capturing moments, creating memories. Join our weekly photowalks.",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=Photography",
    categoryColor: "purple",
  },
  {
    id: 2,
    name: "Robotics Club",
    category: "Tech",
    description:
      "Building the future, one bot at a time. Workshops every Friday.",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=Robotics",
    categoryColor: "blue",
  },
  {
    id: 3,
    name: "Debate Team",
    category: "Academic",
    description: "Sharpen your rhetoric. National champions 2023.",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=Debate",
    categoryColor: "yellow",
  },
  {
    id: 4,
    name: "Basketball Team",
    category: "Sports",
    description: "Weekly practices and inter-university tournaments.",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=Basketball",
    categoryColor: "green",
  },
  {
    id: 5,
    name: "Computer Science Society",
    category: "Academic",
    description:
      "Networking, hackathons, and tech talks from industry leaders.",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=Tech",
    categoryColor: "yellow",
  },
  {
    id: 6,
    name: "Volunteer Corps",
    category: "Volunteering",
    description: "Giving back to the local community through weekly events.",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=Volunteer",
    categoryColor: "red",
  },
  {
    id: 7,
    name: "Drama Club",
    category: "Arts & Media",
    description: "Semester productions and improv nights. All welcome!",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=Drama",
    categoryColor: "purple",
  },
  {
    id: 8,
    name: "Esports Association",
    category: "Tech",
    description: "Competitive gaming and casual tournaments.",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=Esports",
    categoryColor: "blue",
  },
  {
    id: 9,
    name: "Environmental Society",
    category: "Volunteering",
    description: "Promoting sustainability on campus and beyond.",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=Environment",
    categoryColor: "red",
  },
  {
    id: 10,
    name: "Music Production Network",
    category: "Arts & Media",
    description: "Collaborate, compose, and perform. Studio access included.",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=Music",
    categoryColor: "purple",
  },
  {
    id: 11,
    name: "Engineering Council",
    category: "Academic",
    description: "Representing all engineering disciplines.",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=Engineering",
    categoryColor: "yellow",
  },
  {
    id: 12,
    name: "Soccer Club",
    category: "Sports",
    description: "Intramural league champions 3 years running.",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=Soccer",
    categoryColor: "green",
  },
];

const getSortedList = (sortOrder) => {
  let sortedList = [...allFollowings];
  if (sortOrder === "asc") {
    sortedList.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    );
  } else if (sortOrder === "desc") {
    sortedList.sort((a, b) =>
      b.name.toLowerCase().localeCompare(a.name.toLowerCase()),
    );
  } else if (sortOrder === "newest") {
    // Assuming higher ID is newer
    sortedList.sort((a, b) => b.id - a.id);
  } else if (sortOrder === "oldest") {
    sortedList.sort((a, b) => a.id - b.id);
  }
  return sortedList;
};

export const getFollowings = async (
  page = 1,
  limit = 14,
  sortOrder = "asc",
) => {
  // Simulate network delay to act like a real API
  await new Promise((resolve) => setTimeout(resolve, 800));

  const sortedList = getSortedList(sortOrder);
  const totalFollowingsCount = sortedList.length;
  const offset = (page - 1) * limit;

  // Real-world scenario: If trying to fetch beyond total count, return empty
  if (offset >= totalFollowingsCount) {
    return {
      followings: [],
      total: totalFollowingsCount,
      hasMore: false,
    };
  }

  // Calculate limit for the current page
  const end = Math.min(offset + limit, totalFollowingsCount);

  const followings = sortedList.slice(offset, end);

  return {
    followings: followings,
    total: totalFollowingsCount,
    hasMore: end < totalFollowingsCount,
  };
};

export const getSingleFollowing = async (offset, sortOrder = "asc") => {
  // Faster fake response for seamless list updating
  await new Promise((resolve) => setTimeout(resolve, 150));
  const sortedList = getSortedList(sortOrder);
  if (offset >= sortedList.length) return null;
  return sortedList[offset];
};

export const unfollowOrganization = async (id) => {
  // Wait shortly to mimic server processing
  await new Promise((resolve) => setTimeout(resolve, 150));
  allFollowings = allFollowings.filter((org) => org.id !== id);
  return { success: true };
};

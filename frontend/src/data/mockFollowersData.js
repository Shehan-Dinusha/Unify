export const getFollowers = async (page = 1, limit = 14) => {
  // Simulate network delay to act like a real API
  await new Promise((resolve) => setTimeout(resolve, 800));

  const MOCK_TOTAL_FOLLOWERS = 342;
  const offset = (page - 1) * limit;

  // Real-world scenario: If trying to fetch beyond total count, return empty
  if (offset >= MOCK_TOTAL_FOLLOWERS) {
    return {
      followers: [],
      total: MOCK_TOTAL_FOLLOWERS,
      hasMore: false,
    };
  }

  // Calculate limit for the current page
  const end = Math.min(offset + limit, MOCK_TOTAL_FOLLOWERS);
  const currentBatchCount = end - offset;

  // Generate followers dynamically just for the current response to save memory
  const followers = Array.from({ length: currentBatchCount }, (_, i) => {
    const id = offset + i + 1;
    // Common first names for realistic display
    const firstNames = [
      "Alex",
      "Sam",
      "Jordan",
      "Taylor",
      "Morgan",
      "Casey",
      "Riley",
      "Jamie",
      "Avery",
      "Quinn",
      "Peyton",
      "Cameron",
      "Drew",
      "Skyler",
    ];
    const lastNames = [
      "Thompson",
      "Chen",
      "Patel",
      "Rodriguez",
      "Smith",
      "Kim",
      "Williams",
      "Garcia",
      "Davis",
      "Martinez",
      "Lopez",
      "Lee",
      "Gonzalez",
      "Harris",
    ];

    // Create random name based on id so it remains consistent for that 'user'
    const nameStr = `${firstNames[id % firstNames.length]} ${lastNames[id % lastNames.length]}`;

    return {
      id: id,
      name: nameStr,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nameStr.replace(" ", "")}`,
    };
  });

  return {
    followers,
    total: MOCK_TOTAL_FOLLOWERS,
    hasMore: end < MOCK_TOTAL_FOLLOWERS,
  };
};

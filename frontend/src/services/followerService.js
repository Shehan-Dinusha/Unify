import api from "./api";

/**
 * Fetch a paginated list of organizations the student is following.
 *
 * @param {number} page - Current page number
 * @param {number} limit - Number of items per page
 * @param {string} sortOrder - "asc", "desc", "newest", "oldest"
 * @param {number|string} studentId - Optional student ID for testing without auth
 */
export const getFollowings = async (
  page = 1,
  limit = 14,
  sortOrder = "asc",
  studentId = 1, // Defaulting to 1 for testing purposes
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortOrder,
    });

    if (studentId) {
      params.append("studentId", studentId.toString());
    }

    const response = await api.get(
      `/followers/my-followings?${params.toString()}`,
    );
    return response.data.data; // Return the { followings, total, hasMore } object
  } catch (error) {
    console.error("Error fetching followings:", error);
    throw error;
  }
};

/**
 * Fetch exactly one following item at a given offset.
 * Useful for seamless layout filling when removing items.
 */
export const getSingleFollowing = async (
  offset,
  sortOrder = "asc",
  studentId = 1,
) => {
  try {
    const data = await getFollowings(offset + 1, 1, sortOrder, studentId);
    if (data.followings && data.followings.length > 0) {
      return data.followings[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching single following:", error);
    return null;
  }
};

/**
 * Toggle the follow status for a club.
 *
 * @param {number|string} clubId - ID of the club
 * @param {number|string} followerId - Optional follower ID for testing without auth
 */
export const unfollowOrganization = async (clubId, followerId = 1) => {
  try {
    const response = await api.post(`/followers/${clubId}/toggle`, {
      followerId,
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling follow status:", error);
    throw error;
  }
};

/**
 * Fetch a paginated list of followers for a specific club.
 *
 * @param {number} page - Current page number
 * @param {number} limit - Number of items per page
 * @param {number|string} clubId - Optional club ID for testing without auth
 */
export const getClubFollowers = async (
  page = 1,
  limit = 14,
  clubId = 5, // Defaulting to 2 for testing purposes (assuming ID 2 is a seeded club)
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (clubId) {
      params.append("clubId", clubId.toString());
    }

    const response = await api.get(
      `/followers/my-followers?${params.toString()}`,
    );
    return response.data.data; // Return the { followers, total, hasMore } object
  } catch (error) {
    console.error("Error fetching club followers:", error);
    throw error;
  }
};

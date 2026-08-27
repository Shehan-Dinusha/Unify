import api from "./api";

/**
 * Fetch a paginated list of organizations the student is following.
 *
 * @param {number} page - Current page number
 * @param {number} limit - Number of items per page
 * @param {string} sortOrder - "asc", "desc", "newest", "oldest"
 */
export const getFollowings = async (
  page = 1,
  limit = 14,
  sortOrder = "asc",
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortOrder,
  });

  const response = await api.get(
    `/followers/my-followings?${params.toString()}`,
  );
  return response.data.data; // Return the { followings, total, hasMore } object
};

/**
 * Fetch exactly one following item at a given offset.
 * Useful for seamless layout filling when removing items.
 */
export const getSingleFollowing = async (offset, sortOrder = "asc") => {
  try {
    const data = await getFollowings(offset + 1, 1, sortOrder);
    if (data.followings && data.followings.length > 0) {
      return data.followings[0];
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Toggle the follow status for a club.
 *
 * @param {number|string} clubId - ID of the club
 */
export const unfollowOrganization = async (clubId) => {
  const response = await api.post(`/followers/${clubId}/toggle`, {});
  return response.data;
};

/**
 * Fetch a paginated list of followers for a specific club.
 *
 * @param {number} page - Current page number
 * @param {number} limit - Number of items per page
 */
export const getClubFollowers = async (page = 1, limit = 14) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await api.get(
    `/followers/my-followers?${params.toString()}`,
  );
  return response.data.data; // Return the { followers, total, hasMore } object
};

/**
 * Fetch a paginated list of public followers for a specific user.
 */
export const getPublicFollowers = async (userId, page = 1, limit = 20) => {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  const response = await api.get(`/followers/${userId}/followers?${params.toString()}`);
  return response.data.data;
};


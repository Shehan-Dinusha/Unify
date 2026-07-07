import {
  NormalPost,
  ClubProductPost,
  ClubEventPost,
  Boarding,
  User,
  Comment,
  PostLike,
  SavedItem,
} from "../../modules/index.js";
import { resolveAssetUrl } from "../../utils/assetUrl.util.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";
import logger from "../../utils/logger.js";

const resolvePostImages = async (post) => {
  const resolved = { ...post };
  if (Array.isArray(resolved.images) && resolved.images.length > 0) {
    resolved.images = await Promise.all(resolved.images.map(resolveAssetUrl));
  }
  if (resolved.coverImage) {
    resolved.coverImage = await resolveAssetUrl(resolved.coverImage);
  }
  // Resolve author avatar
  if (resolved.author?.avatar !== undefined) {
    resolved.author = {
      ...resolved.author,
      avatar: await resolveAvatarUrl(resolved.author.avatar, resolved.author.name),
    };
  }
  // Resolve host avatar (Boarding posts use 'host')
  if (resolved.host?.avatar !== undefined) {
    resolved.host = {
      ...resolved.host,
      avatar: await resolveAvatarUrl(resolved.host.avatar, resolved.host.name),
    };
  }
  return resolved;
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.id; // Viewer's ID (could be same as userId or different)

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const fetchPosts = async (
      Model,
      postType,
      authorKey = "author",
      where = {},
    ) => {
      const posts = await Model.findAll({
        where,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            as: authorKey,
            attributes: ["id", "name", "email", "avatar", "role"],
          },
        ],
        raw: true,
        nest: true,
      });

      return posts.map((post) => ({
        ...post,
        postType,
        author: post[authorKey],
      }));
    };

    const tasks = [];

    // Fetch public posts from all categories for this specific user
    // We assume if someone is looking at the profile, they can see standard visible posts
    // Note: NormalPost doesn't have isVisible, but ClubProductPost/ClubEventPost do.
    tasks.push(
      fetchPosts(NormalPost, "normal", "author", { authorId: userId }),
    );
    tasks.push(
      fetchPosts(ClubProductPost, "club-product", "author", {
        authorId: userId,
        isVisible: true,
      }),
    );
    tasks.push(
      fetchPosts(ClubEventPost, "club-event", "author", {
        authorId: userId,
        isVisible: true,
      }),
    );
    tasks.push(fetchPosts(Boarding, "boarding", "host", { hostId: userId }));

    // Wait for all fetches
    const results = await Promise.all(tasks);
    const combinedFeed = results.flat();

    // Sort all combined posts by createdAt
    combinedFeed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Trim to a reasonable limit for public profiles
    const finalFeed = combinedFeed.slice(0, 30);

    // Resolve S3 images
    const resolvedFeed = await Promise.all(finalFeed.map(resolvePostImages));

    // Inject interactions (like count, comment count) using the current user's perspective
    const feedWithInteractions = await Promise.all(
      resolvedFeed.map(async (post) => {
        let commentsCount = 0;
        let isLiked = false;
        let isSaved = false;

        try {
          commentsCount = await Comment.count({
            where: { postId: post.id, postType: post.postType },
          });

          if (currentUserId) {
            const likeRecord = await PostLike.findOne({
              where: {
                userId: currentUserId,
                postId: post.id,
                postType: post.postType,
              },
            });
            isLiked = !!likeRecord;

            const saveRecord = await SavedItem.findOne({
              where: {
                userId: currentUserId,
                postId: post.id,
                postType: post.postType,
              },
            });
            isSaved = !!saveRecord;
          }
        } catch (err) {
          logger.error("Error fetching interactions for post:", err);
        }

        return {
          ...post,
          commentsCount,
          isLiked,
          isSaved,
          isPromoted: false,
        };
      }),
    );

    res.status(200).json({ success: true, posts: feedWithInteractions });
  } catch (error) {
    logger.error("Error in getUserPosts:", error);
    res.status(500).json({ error: error.message });
  }
};

import { NormalPost, ClubProductPost, ClubEventPost, Boarding, SavedItem, User, Comment, PostLike } from "../../modules/index.js";
import { resolveAssetUrl } from "../../utils/assetUrl.util.js";
import logger from "../../utils/logger.js";

const resolvePostImages = async (post) => {
  const resolved = { ...post };
  if (Array.isArray(resolved.images) && resolved.images.length > 0) {
    resolved.images = await Promise.all(resolved.images.map(resolveAssetUrl));
  }
  if (resolved.coverImage) {
    resolved.coverImage = await resolveAssetUrl(resolved.coverImage);
  }
  return resolved;
};

const getModelConfig = (type) => {
  switch (type) {
    case "normal":
    case "food-cafe":
    case "services":
    case "service":
      return NormalPost;
    case "club-product":
      return ClubProductPost;
    case "club-event":
      return ClubEventPost;
    case "boarding":
      return Boarding;
    default:
      return null;
  }
};

export const toggleSave = async (req, res) => {
  try {
    const { type, id } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const Model = getModelConfig(type);
    if (!Model) {
      return res.status(400).json({ error: "Invalid post type." });
    }

    const post = await Model.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const existingSave = await SavedItem.findOne({
      where: { userId, postId: id, postType: type },
    });

    if (existingSave) {
      // Unsave
      await existingSave.destroy();
      return res.status(200).json({ success: true, saved: false });
    } else {
      // Save
      await SavedItem.create({ userId, postId: id, postType: type });
      return res.status(200).json({ success: true, saved: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const savedItems = await SavedItem.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    const populatedPosts = [];
    for (const item of savedItems) {
      const Model = getModelConfig(item.postType);
      if (!Model) continue;

      const authorKey = item.postType === "boarding" ? "host" : "author";
      const post = await Model.findByPk(item.postId, {
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

      if (post) {
        populatedPosts.push({
          ...post,
          postType: item.postType,
          author: post[authorKey],
        });
      }
    }

    const resolvedFeed = await Promise.all(populatedPosts.map(resolvePostImages));

    const feedWithInteractions = await Promise.all(
      resolvedFeed.map(async (post) => {
        const [commentsCount, likeRecord] = await Promise.all([
          Comment.count({ where: { postId: post.id, postType: post.postType } }),
          PostLike.findOne({ where: { userId, postId: post.id, postType: post.postType } }),
        ]);

        return {
          ...post,
          commentsCount,
          isLiked: !!likeRecord,
          isSaved: true,
        };
      })
    );

    return res.status(200).json({ success: true, savedItems: feedWithInteractions });
  } catch (error) {
    logger.error("Error fetching saved posts:", error);
    res.status(500).json({ error: error.message });
  }
};

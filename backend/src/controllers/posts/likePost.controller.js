import { NormalPost, ClubProductPost, ClubEventPost, Boarding, PostLike, User } from "../../modules/index.js";
import { notifyLike } from "../../services/notification.service.js";

const getModelConfig = (type) => {
  switch (type) {
    case "normal":
    case "food-cafe":
    case "services":
    case "service": // Handle both 'services' and 'service'
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

export const toggleLike = async (req, res) => {
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

    const existingLike = await PostLike.findOne({
      where: { userId, postId: id, postType: type },
    });

    if (existingLike) {
      // Unlike
      await existingLike.destroy();
      post.likesCount = Math.max(0, (post.likesCount || 0) - 1);
      await post.save();
      return res.status(200).json({ success: true, liked: false, likesCount: post.likesCount });
    } else {
      // Like
      await PostLike.create({ userId, postId: id, postType: type });
      post.likesCount = (post.likesCount || 0) + 1;
      await post.save();

      // Send notification to the post owner (non-blocking)
      const postOwnerId = post.authorId || post.hostId;
      if (postOwnerId) {
        const actor = await User.findByPk(userId, { attributes: ["name"] });
        notifyLike({
          postOwnerId,
          actorId: userId,
          actorName: actor?.name || "Someone",
          postId: parseInt(id, 10),
          postType: type,
          postTitle: post.title || post.name || "your post",
        });
      }

      return res.status(200).json({ success: true, liked: true, likesCount: post.likesCount });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

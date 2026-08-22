import { NormalPost, ClubProductPost, ClubEventPost, Boarding, Comment, User } from "../../modules/index.js";
import { notifyComment } from "../../services/notification.service.js";

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

export const addComment = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Comment content is required." });
    }

    const Model = getModelConfig(type);
    if (!Model) {
      return res.status(400).json({ error: "Invalid post type." });
    }

    const post = await Model.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // If parentId is provided, validate it (one-level depth enforcement)
    let parentComment = null;
    if (parentId) {
      parentComment = await Comment.findOne({
        where: { id: parentId, postId: id, postType: type },
      });

      if (!parentComment) {
        return res.status(404).json({ error: "Parent comment not found." });
      }

      // Enforce one-level depth: parent must be a root comment
      if (parentComment.parentId !== null) {
        return res.status(400).json({ error: "Cannot reply to a reply. Only top-level comments can be replied to." });
      }
    }

    const comment = await Comment.create({
      userId,
      postId: id,
      postType: type,
      content: content.trim(),
      parentId: parentId || null,
    });

    // Fetch the created comment with user details
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "avatar"],
        },
      ],
    });

    // Send notifications (non-blocking)
    const actor = await User.findByPk(userId, { attributes: ["name"] });

    if (parentId && parentComment) {
      // Notify the parent comment author about the reply
      if (parentComment.userId && parentComment.userId !== userId) {
        notifyComment({
          postOwnerId: parentComment.userId,
          actorId: userId,
          actorName: actor?.name || "Someone",
          postId: parseInt(id, 10),
          postType: type,
          commentText: content.trim(),
          commentId: comment.id,
        });
      }
    } else {
      // Notify the post owner about the new comment
      const postOwnerId = post.authorId || post.hostId;
      if (postOwnerId && postOwnerId !== userId) {
        notifyComment({
          postOwnerId,
          actorId: userId,
          actorName: actor?.name || "Someone",
          postId: parseInt(id, 10),
          postType: type,
          commentText: content.trim(),
          commentId: comment.id,
        });
      }
    }

    return res.status(201).json({ success: true, comment: commentWithUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { type, id } = req.params;

    const Model = getModelConfig(type);
    if (!Model) {
      return res.status(400).json({ error: "Invalid post type." });
    }

    // Fetch only root-level comments, with their replies eagerly loaded
    const comments = await Comment.findAll({
      where: { postId: id, postType: type, parentId: null },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "avatar"],
        },
        {
          model: Comment,
          as: "replies",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email", "avatar"],
            },
          ],
          order: [["createdAt", "ASC"]],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

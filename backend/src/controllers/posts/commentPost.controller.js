import { NormalPost, ClubProductPost, ClubEventPost, Boarding, Comment, User } from "../../modules/index.js";

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
    const { content } = req.body;
    const userId = req.user?.id || 1; // Default to 1 for development

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

    const comment = await Comment.create({
      userId,
      postId: id,
      postType: type,
      content: content.trim(),
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

    const comments = await Comment.findAll({
      where: { postId: id, postType: type },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "avatar"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

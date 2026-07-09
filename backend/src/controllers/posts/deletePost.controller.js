import { NormalPost, ClubProductPost, ClubEventPost, Boarding } from "../../modules/index.js";

const getModelConfig = (type) => {
  switch (type) {
    case "normal":
    case "food-cafe":
    case "services":
      return { Model: NormalPost, authorField: "authorId" };
    case "club-product":
      return { Model: ClubProductPost, authorField: "authorId" };
    case "club-event":
      return { Model: ClubEventPost, authorField: "authorId" };
    case "boarding":
      return { Model: Boarding, authorField: "hostId" };
    default:
      return null;
  }
};

export const deletePost = async (req, res) => {
  try {
    const { type, id } = req.params;
    const userId = req.user ? req.user.id : req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const config = getModelConfig(type);
    if (!config) {
      return res.status(400).json({ error: "Invalid post type." });
    }

    const { Model, authorField } = config;

    const post = await Model.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Ensure only the author can delete their post
    if (post[authorField] !== parseInt(userId, 10)) {
      return res.status(403).json({ error: "You are not authorized to delete this post." });
    }

    await post.destroy();

    res.status(200).json({ success: true, message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

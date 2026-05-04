import { NormalPost, ClubProductPost, ClubEventPost, Boarding, SavedItem } from "../../modules/index.js";

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
    const userId = req.user?.id || 1; // Default to 1 for development

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
    const userId = req.user?.id || 1;

    const savedItems = await SavedItem.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ success: true, savedItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

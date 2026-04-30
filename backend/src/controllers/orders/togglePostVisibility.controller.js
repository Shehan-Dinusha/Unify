import { ClubProductPost, ClubEventPost } from "../../modules/index.js";

export const togglePostVisibility = async (req, res) => {
  try {
    const { type, postId } = req.params;

    let post;
    if (type === "club-product") {
      post = await ClubProductPost.findByPk(postId);
    } else if (type === "club-event") {
      post = await ClubEventPost.findByPk(postId);
    } else {
      return res.status(400).json({ error: "Invalid post type. Use 'club-product' or 'club-event'." });
    }

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    await post.update({ isVisible: !post.isVisible });

    res.status(200).json({
      success: true,
      postId: post.id,
      isVisible: post.isVisible,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

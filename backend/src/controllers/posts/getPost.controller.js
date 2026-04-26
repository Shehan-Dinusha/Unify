import { NormalPost, ClubProductPost, ClubEventPost, Boarding, User } from "../../modules/index.js";

const getModelConfig = (type) => {
  switch (type) {
    case "normal":
    case "food-cafe":
    case "services":
      return { Model: NormalPost, authorKey: "author" };
    case "club-product":
      return { Model: ClubProductPost, authorKey: "author" };
    case "club-event":
      return { Model: ClubEventPost, authorKey: "author" };
    case "boarding":
      return { Model: Boarding, authorKey: "host" };
    default:
      return null;
  }
};

export const getPost = async (req, res) => {
  try {
    const { type, id } = req.params;
    
    const config = getModelConfig(type);
    if (!config) {
      return res.status(400).json({ error: "Invalid post type." });
    }

    const { Model, authorKey } = config;

    const post = await Model.findByPk(id, {
      include: [
        {
          model: User,
          as: authorKey,
          attributes: ["id", "name", "email", "avatar", "role"],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Convert to plain object to inject properties
    const postData = post.get({ plain: true });
    postData.postType = type;
    
    // Normalize author property for consistency
    if (authorKey !== "author") {
      postData.author = postData[authorKey];
    }

    res.status(200).json({ success: true, post: postData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

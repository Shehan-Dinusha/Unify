import { NormalPost } from "../../modules/index.js";

const getUploadedFileUrls = (files) => {
  if (!files) return [];
  return files.map((file) => file.location || `/uploads/verifications/${file.filename}`);
};

export const createNormalPost = async (req, res) => {
  try {
    const { description, postType, category: bodyCategory } = req.body;

    let category = bodyCategory || "CLUB";
    const userId = req.user ? req.user.id : (req.body.userId || 1);

    if (postType === "food-cafe") {
      category = "FOOD";
    } else if (postType === "service") {
      category = "SELF_EMPLOYED";
    } else if (postType === "club") {
      category = "CLUB";
    }



    const images = getUploadedFileUrls(req.files);

    const post = await NormalPost.create({
      authorId: userId,
      description,
      images,
      category,
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

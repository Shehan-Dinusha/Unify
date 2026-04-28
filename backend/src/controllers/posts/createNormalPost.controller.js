import { NormalPost } from "../../modules/index.js";

const getUploadedFileUrls = (files) => {
  if (!files) return [];
  return files.map((file) => file.location || `/uploads/verifications/${file.filename}`);
};

export const createNormalPost = async (req, res) => {
  try {
    const { description, hours, phone, tags: tagsRaw, postType, category: bodyCategory } = req.body;

    // Determine category and hardcoded userId based on postType
    // userId=1: Club Owner, userId=3: Food Owner, userId=4: Self Employed Pro
    let category = bodyCategory || "CLUB";
    let userId = 1; // default: club owner

    if (postType === "food-cafe") {
      category = "FOOD";
      userId = 3; // Food Owner (hardcoded for development)
    } else if (postType === "service") {
      category = "SELF_EMPLOYED";
      userId = 4; // Self Employed Pro (hardcoded for development)
    } else if (postType === "club") {
      category = "CLUB";
      userId = 1; // Club Owner (hardcoded for development)
    }

    let tags = [];
    if (tagsRaw) {
      try {
        tags = typeof tagsRaw === "string" ? JSON.parse(tagsRaw) : tagsRaw;
      } catch (e) {
        tags = [];
      }
    }

    const images = getUploadedFileUrls(req.files);

    const post = await NormalPost.create({
      authorId: userId,
      description,
      images,
      category,
      hours,
      phone,
      tags,
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

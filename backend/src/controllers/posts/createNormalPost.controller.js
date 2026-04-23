import { NormalPost, ClubProfile, BusinessProfile } from "../../modules/index.js";

const getUploadedFileUrls = (files) => {
  if (!files) return [];
  return files.map((file) => `/uploads/verifications/${file.filename}`);
};

export const createNormalPost = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const { description } = req.body;

    // Validate if the user is a Club Owner or a Food/Cafe Business Owner
    const clubProfile = await ClubProfile.findOne({ where: { userId } });
    const businessProfile = await BusinessProfile.findOne({ 
      where: { userId, category: "FOOD" } 
    });

    if (!clubProfile && !businessProfile) {
      return res.status(403).json({ 
        error: "Only Club or Food/Cafe Service owners can create normal posts." 
      });
    }

    const images = getUploadedFileUrls(req.files);

    const post = await NormalPost.create({
      authorId: userId,
      description,
      images,
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

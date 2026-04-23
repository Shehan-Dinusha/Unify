import { ClubEventPost, ClubProfile } from "../../modules/index.js";

const getUploadedFileUrls = (files) => {
  if (!files) return [];
  return files.map((file) => `/uploads/verifications/${file.filename}`);
};

export const createClubEventPost = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Validate if the user is a Club Owner
    const clubProfile = await ClubProfile.findOne({ where: { userId } });
    if (!clubProfile) {
      return res.status(403).json({ error: "Only Club owners can create club event posts." });
    }

    const files = req.files || [];
    const coverImage = files.length > 0 ? { url: `/uploads/verifications/${files[0].filename}` } : null;

    let tiers = req.body.tiers;
    if (typeof tiers === 'string') tiers = JSON.parse(tiers);

    const post = await ClubEventPost.create({
      authorId: userId,
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      tiers,
      coverImage,
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

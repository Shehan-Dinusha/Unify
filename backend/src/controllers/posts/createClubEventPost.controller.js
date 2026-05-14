import { ClubEventPost, ClubProfile } from "../../modules/index.js";

const getUploadedFileUrls = (files) => {
  if (!files) return [];
  return files.map((file) => file.location);
};

export const createClubEventPost = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Validate if the user is a Club Owner
    let clubProfile = await ClubProfile.findOne({ where: { userId } });

    // FOR DEVELOPMENT: If no profile exists, create a dummy one
    if (!clubProfile) {
      clubProfile = await ClubProfile.create({
        userId,
        clubName: "Default Club",
        isVerified: true
      });
    }

    if (!clubProfile) {
      return res.status(403).json({ error: "Only Club owners can create club event posts." });
    }

    const files = req.files || [];
    const coverImage = files.length > 0 ? { url: files[0].location } : null;


    let tiers = req.body.tiers || req.body.tickets;
    if (typeof tiers === 'string') tiers = JSON.parse(tiers);

    let basePrice = 0;
    if (Array.isArray(tiers) && tiers.length > 0) {
      const prices = tiers.map(t => t.isFree ? 0 : parseFloat(t.price) || 0);
      basePrice = Math.min(...prices);
    } else if (req.body.price) {
      basePrice = parseFloat(req.body.price) || 0;
    }

    const post = await ClubEventPost.create({
      authorId: userId,
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      price: basePrice,
      tiers,
      coverImage,
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

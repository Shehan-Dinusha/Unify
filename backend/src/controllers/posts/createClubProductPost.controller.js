import { ClubProductPost } from "../../modules/index.js";

const getUploadedFileUrls = (files) => {
  if (!files) return [];
  return files.map((file) => file.location || `/uploads/verifications/${file.filename}`);
};

export const createClubProductPost = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : (req.body.userId || 1);

    // FOR DEVELOPMENT: Skip club profile check when using a dummy setup
    // In production this would validate against the authenticated user's club profile

    const images = getUploadedFileUrls(req.files);
    
    let sizes = req.body.sizes;
    let colors = req.body.colors;
    
    if (typeof sizes === 'string') sizes = JSON.parse(sizes);
    if (typeof colors === 'string') colors = JSON.parse(colors);

    const post = await ClubProductPost.create({
      authorId: userId,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      enableSizes: req.body.enableSizes === 'true' || req.body.enableSizes === true,
      sizes,
      colors,
      deadline: req.body.deadline || null,
      pickupNote: req.body.pickupNote,
      images,
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

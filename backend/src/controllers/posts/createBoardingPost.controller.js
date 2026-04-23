import { Boarding, BusinessProfile } from "../../modules/index.js";

const getUploadedFileUrls = (files) => {
  if (!files) return [];
  return files.map((file) => `/uploads/verifications/${file.filename}`);
};

export const createBoardingPost = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Validate if the user is a Boarding Business Owner
    const businessProfile = await BusinessProfile.findOne({ 
      where: { userId, category: "BOARDING" } 
    });
    
    if (!businessProfile) {
      return res.status(403).json({ error: "Only Boarding service owners can create boarding posts." });
    }

    const images = getUploadedFileUrls(req.files);

    let amenities = req.body.amenities;
    if (typeof amenities === 'string') amenities = JSON.parse(amenities);

    const post = await Boarding.create({
      hostId: userId,
      title: req.body.title,
      location: req.body.location,
      description: req.body.description,
      price: req.body.price,
      capacity: req.body.capacity,
      slots: req.body.slots,
      phone: req.body.phone,
      gender: req.body.gender,
      roomType: req.body.roomType,
      amenities,
      images,
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

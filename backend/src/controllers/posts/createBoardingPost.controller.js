import { Boarding } from "../../modules/index.js";

const getUploadedFileUrls = (files) => {
  if (!files) return [];
  return files.map((file) => file.location || `/uploads/verifications/${file.filename}`);
};

export const createBoardingPost = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
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
      latitude: req.body.latitude ? parseFloat(req.body.latitude) : null,
      longitude: req.body.longitude ? parseFloat(req.body.longitude) : null,
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

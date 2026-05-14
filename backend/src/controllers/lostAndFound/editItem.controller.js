import { LostAndFound, User, StudentProfile, Degree } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";
import s3Service from "../../services/s3.service.js";
import { formatRelativeDate } from "../../utils/date.js";

export const editItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body; // sanitized by express-validator
  
  const userId = req.user.id;



  const item = await LostAndFound.findByPk(id);

  if (!item) {
    return sendResponse(res, 404, false, "Item not found.");
  }

  // Security Check: Only the original poster can edit
  if (item.userId !== userId) {
    return sendResponse(res, 403, false, "You do not have permission to edit this item.");
  }

  let finalImages = [];
  
  if (updates.existingImages) {
    const existingUrls = Array.isArray(updates.existingImages) 
      ? updates.existingImages 
      : [updates.existingImages];
      
    finalImages = item.images.filter(key => {
       return existingUrls.some(url => {
         try {
           const parsed = new URL(url);
           const pathWithoutSlash = parsed.pathname.slice(1);
           return decodeURIComponent(pathWithoutSlash) === key || pathWithoutSlash === key;
         } catch(e) {
           return url.includes(key);
         }
       });
    });
  }

  if (req.files && req.files.length > 0) {
    const newKeys = req.files.map((file) => file.location).filter((key) => key !== null);
    finalImages = [...finalImages, ...newKeys];
  }

  updates.images = finalImages;

  // Apply updates and save
  await item.update(updates);

  // Reload the item with relations to format the response
  const updatedItem = await LostAndFound.findOne({
    where: { id: item.id },
    include: [{
      model: User,
      as: "user",
      attributes: ["name", "avatar"],
      include: [{
        model: StudentProfile,
        as: "studentProfile",
        attributes: [],
        include: [{ model: Degree, as: "degree", attributes: ["name"] }]
      }]
    }]
  });

  let signedImageUrls = [];
  if (updatedItem.images && updatedItem.images.length > 0) {
    signedImageUrls = await Promise.all(
      updatedItem.images.map(async (s3Key) => {
         return await s3Service.getFileUrl(s3Key);
      })
    );
  }

  const formattedItem = {
    id: updatedItem.id,
    type: updatedItem.type.toLowerCase(),
    title: updatedItem.title,
    description: updatedItem.description,
    location: updatedItem.location,
    date: updatedItem.date,
    timeOfDay: updatedItem.timeOfDay,
    time: formatRelativeDate(updatedItem.createdAt),
    images: signedImageUrls,
    status: updatedItem.status,
    postedBy: {
      name: updatedItem.user?.name || "Unknown",
      avatar: updatedItem.user?.avatar || "https://placehold.co/40x40",
      degree: updatedItem.user?.studentProfile?.degree?.name || "Unknown Degree"
    }
  };

  return sendResponse(res, 200, true, "Item updated successfully.", formattedItem);
});

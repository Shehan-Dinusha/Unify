import { LostAndFound, User, StudentProfile, Degree } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";
import { resolveAssetUrl } from "../../utils/assetUrl.util.js";
import { formatRelativeDate } from "../../utils/date.js";

export const getMyItems = catchAsync(async (req, res, next) => {
  const userId = req.user.id; 

  const items = await LostAndFound.findAll({
    where: { userId },
    include: [{
      model: User,
      as: "user",
      attributes: ["name", "avatar"],
      include: [{
        model: StudentProfile,
        as: "studentProfile",
        include: [{ model: Degree, as: "degree", attributes: ["name"] }]
      }]
    }],
    order: [["createdAt", "DESC"]]
  });

  const formattedItemsPromises = items.map(async (item) => {
    let signedImageUrls = [];
    if (item.images && item.images.length > 0) {
      signedImageUrls = await Promise.all(
        item.images.map(async (s3Key) => {
           return await resolveAssetUrl(s3Key);
        })
      );
    }

    return {
      id: item.id,
      type: item.type.toLowerCase(),
      title: item.title,
      description: item.description,
      location: item.location,
      date: item.date,
      timeOfDay: item.timeOfDay,
      time: formatRelativeDate(item.createdAt),
      images: signedImageUrls,
      status: item.status, // Included so frontend knows if it is "Resolved"
      postedBy: {
        name: item.user?.name || "Unknown",
        avatar: item.user?.avatar || "https://placehold.co/40x40",
        degree: item.user?.studentProfile?.degree?.name || "Unknown Degree"
      }
    };
  });

  const formattedItems = await Promise.all(formattedItemsPromises);

  return sendResponse(res, 200, true, "My items fetched successfully.", formattedItems);
});

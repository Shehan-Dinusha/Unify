import { LostAndFound, User, StudentProfile, Degree } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";
import { resolveAssetUrl } from "../../utils/assetUrl.util.js";
import { formatRelativeDate } from "../../utils/date.js";

export const getItemById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const item = await LostAndFound.findOne({
    where: { id },
    include: [{
      model: User,
      as: "user",
      attributes: ["name", "avatar"],
      include: [{
        model: StudentProfile,
        as: "studentProfile",
        include: [{
          model: Degree,
          as: "degree",
          attributes: ["name"]
        }]
      }]
    }]
  });

  if (!item) {
    return sendResponse(res, 404, false, "Item not found.");
  }

  let signedImageUrls = [];
  if (item.images && item.images.length > 0) {
    signedImageUrls = await Promise.all(
      item.images.map(async (s3Key) => {
         return await resolveAssetUrl(s3Key);
      })
    );
  }

  const formattedItem = {
    id: item.id,
    ownerId: item.userId,
    postId: `LF-${item.id}`,
    type: item.type.toLowerCase(),
    title: item.title,
    description: item.description,
    location: item.location,
    date: item.date,
    timeOfDay: item.timeOfDay,
    time: formatRelativeDate(item.createdAt),
    images: signedImageUrls,
    postedBy: {
      name: item.user?.name || "Unknown",
      avatar: item.user?.avatar || "https://placehold.co/40x40",
      degree: item.user?.studentProfile?.degree?.name || "Unknown Degree"
    }
  };

  return sendResponse(res, 200, true, "Item details fetched successfully.", formattedItem);
});

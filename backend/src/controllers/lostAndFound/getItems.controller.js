import { LostAndFound, User, StudentProfile, Degree } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";
import { resolveAssetUrl } from "../../utils/assetUrl.util.js";
import { formatRelativeDate } from "../../utils/date.js";

export const getItems = catchAsync(async (req, res, next) => {
  const { type } = req.query; // "Lost", "Found", or "All"
  
  const whereClause = { status: "Active" };
  if (type && type !== "All") {
    whereClause.type = type;
  }

  const items = await LostAndFound.findAll({
    where: whereClause,
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
    }],
    order: [["createdAt", "DESC"]]
  });

  // Map to precisely match the frontend UI expectation
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
      location: item.location,
      time: formatRelativeDate(item.createdAt), // Or format how UI desires
      images: signedImageUrls,
      postedBy: {
        name: item.user?.name || "Unknown",
        avatar: item.user?.avatar || "https://placehold.co/40x40",
        degree: item.user?.studentProfile?.degree?.name || "Unknown Degree"
      }
    };
  });

  const formattedItems = await Promise.all(formattedItemsPromises);

  return sendResponse(res, 200, true, "Items fetched successfully.", formattedItems);
});

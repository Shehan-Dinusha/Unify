import { LostAndFound, User, StudentProfile, Degree } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";

export const getMyItems = catchAsync(async (req, res, next) => {
  //if (!req.user) return sendResponse(res, 401, false, "Unauthorized");

  // Assume a middleware provides req.user; fallback to 1 as default for testing
  const userId = req.user?.id || 1; 

  const items = await LostAndFound.findAll({
    //where: { userId: req.user.id }, // Security filter!

    //For Testing
    where: { userId },
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
    }],
    order: [["createdAt", "DESC"]]
  });

  const formattedItems = items.map(item => ({
    id: item.id,
    type: item.type.toLowerCase(),
    title: item.title,
    location: item.location,
    time: item.createdAt,
    image: item.image,
    status: item.status, // Included so frontend knows if it is "Resolved"
    postedBy: {
      name: item.user?.name || "Unknown",
      avatar: item.user?.avatar || "https://placehold.co/40x40",
      degree: item.user?.studentProfile?.degree?.name || "Unknown Degree"
    }
  }));

  return sendResponse(res, 200, true, "My items fetched successfully.", formattedItems);
});

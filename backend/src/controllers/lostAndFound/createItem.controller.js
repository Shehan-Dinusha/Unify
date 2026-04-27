import LostAndFound from "../../modules/LostAndFound.model.js";
import { sendResponse, catchAsync } from "../../utils/response.js";

export const createItem = catchAsync(async (req, res, next) => {
  // express-validator and multer guarantee this payload is clean
  const { type, title, description, location, date, timeOfDay } = req.body;
  
  // Assume a middleware provides req.user; fallback to 1 as default for testing
  const userId = req.user?.id || 1; 

  //------------------------------------------------------------------------------
/*
  //  Check authentication
  if (!req.user) {
    return sendResponse(res, 401, false, "Unauthorized");
  }

  // ✅ Allow only students
  if (!req.user.studentProfile) {
    return sendResponse(res, 403, false, "Only students can create lost and found posts");
  }
  
  const userId = req.user.id;
*/
  //------------------------------------------------------------------------------

  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/lost-found/${req.file.filename}`;
  }

  //------------------------------------------------------------------------------

  const newItem = await LostAndFound.create({
    userId,
    type,
    title,
    description,
    location,
    date,
    timeOfDay,
    image: imageUrl,
    status: "Active"
  });

  return sendResponse(res, 201, true, "Item reported successfully.", newItem);
});

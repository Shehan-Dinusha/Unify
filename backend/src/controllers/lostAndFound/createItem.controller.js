import LostAndFound from "../../modules/LostAndFound.model.js";
import { sendResponse, catchAsync } from "../../utils/response.js";
import { runMatchingEngine } from "../../services/lostAndFoundMatcher.service.js";

export const createItem = catchAsync(async (req, res, next) => {
  // express-validator and multer guarantee this payload is clean
  const { type, title, description, location, date, timeOfDay } = req.body;
  
  const userId = req.user.id; 

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

  let s3ImageKeys = [];

  if (req.files && req.files.length > 0) {
    s3ImageKeys = req.files.map((file) => file.location).filter((key) => key !== null);
  }
  // Create item in DB storing S3 KEYS (not public URLs)
  const newItem = await LostAndFound.create({
    userId,
    type,
    title,
    description,
    location,
    date,
    timeOfDay,
    images: s3ImageKeys,
    status: "Active"
  });

  // Respond immediately — do NOT await the matching engine
  sendResponse(res, 201, true, "Item created successfully.", newItem);

  // Fire-and-forget: run TF-IDF matching in the background.
  // Any errors inside runMatchingEngine are caught and logged internally.
  runMatchingEngine(newItem);
});

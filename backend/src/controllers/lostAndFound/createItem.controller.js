import LostAndFound from "../../modules/LostAndFound.model.js";
import { sendResponse, catchAsync } from "../../utils/response.js";
import s3Service from "../../services/s3.service.js";
import { runMatchingEngine } from "../../services/lostAndFoundMatcher.service.js";
import fs from "fs";

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

  // Handle multiple uploaded files
  if (req.files && req.files.length > 0) {
    // Process all files concurrently
    const uploadPromises = req.files.map(async (file) => {
      try {
        // Upload to an S3 folder specifically named 'lost-and-found'
        const fileKey = await s3Service.uploadFile(
          file.path,
          file.originalname,
          file.mimetype,
          "lost-and-found"
        );
        // Delete the temporary local file
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return fileKey; // Returns something like 'lost-and-found/timestamp-photo.jpg'
      } catch (err) {
        console.error("Failed to upload to S3 or cleanup local file:", err);
        return null;
      }
    });
    // Wait for all S3 uploads to complete
    const results = await Promise.all(uploadPromises);
    s3ImageKeys = results.filter((key) => key !== null); // Remove failures
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

import multer from "multer";
import { uploadBuffer } from "../services/s3.service.js";
import { isImage, optimizeImage } from "../services/imageOptimizer.service.js";

/**
 * S3-backed Upload Service
 * Uses memory storage to avoid local disk usage before S3 upload.
 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "application/pdf",
    "video/mp4",
    "video/webm",
    "video/ogg",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only Images and PDFs are allowed."),
      false,
    );
  }
};

const s3Upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

/**
 * Middleware to handle S3 uploads after multer processes the request.
 * It replaces req.file or req.files with S3 URLs/Keys.
 *
 * @param {string} folder - S3 folder to upload to
 */
export const s3UploadMiddleware = (folder) => async (req, res, next) => {
  try {
    if (req.file) {
      let buffer = req.file.buffer;
      if (isImage(req.file.mimetype)) {
        buffer = await optimizeImage(buffer, req.file.mimetype);
      }
      const fileKey = await uploadBuffer(
        buffer,
        req.file.originalname,
        isImage(req.file.mimetype) ? "image/webp" : req.file.mimetype,
        folder,
      );
      req.file.s3Key = fileKey;
      req.file.location = fileKey; // Store just the S3 key; presigned URL generated at read time
    }

    if (req.files && Array.isArray(req.files)) {
      const uploadPromises = req.files.map(async (file) => {
        let buffer = file.buffer;
        if (isImage(file.mimetype)) {
          buffer = await optimizeImage(buffer, file.mimetype);
        }
        const fileKey = await uploadBuffer(
          buffer,
          file.originalname,
          isImage(file.mimetype) ? "image/webp" : file.mimetype,
          folder,
        );
        file.s3Key = fileKey;
        file.location = fileKey;
        return file;
      });
      await Promise.all(uploadPromises);
    } else if (req.files && typeof req.files === "object") {
      const keys = Object.keys(req.files);
      for (const key of keys) {
        const uploadPromises = req.files[key].map(async (file) => {
          let buffer = file.buffer;
          if (isImage(file.mimetype)) {
            buffer = await optimizeImage(buffer, file.mimetype);
          }
          const fileKey = await uploadBuffer(
            buffer,
            file.originalname,
            isImage(file.mimetype) ? "image/webp" : file.mimetype,
            folder,
          );
          file.s3Key = fileKey;
          file.location = fileKey;
          return file;
        });
        await Promise.all(uploadPromises);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Unified S3 Upload Middleware
 * Combines multer parsing and S3 uploading into a single middleware call.
 *
 * @param {Object} options
 * @param {string} options.type - 'single', 'array', or 'fields'
 * @param {string} options.fieldName - Name of the form field
 * @param {string} options.folder - S3 destination folder
 * @param {number} [options.maxCount] - Max files for 'array' type
 */
export const uploadToS3 = ({ type, fieldName, folder, maxCount }) => {
  let multerMiddleware;

  if (type === "single") {
    multerMiddleware = s3Upload.single(fieldName);
  } else if (type === "array") {
    multerMiddleware = s3Upload.array(fieldName, maxCount || 10);
  } else if (type === "fields") {
    multerMiddleware = s3Upload.fields(fieldName);
  } else {
    throw new Error("Invalid upload type. Use 'single', 'array', or 'fields'.");
  }

  return [multerMiddleware, s3UploadMiddleware(folder)];
};

export default s3Upload;

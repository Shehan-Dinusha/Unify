import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * Universal Upload Service
 * Handles file storage for Verifications, Reports, and other modules.
 */

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine folder based on the fieldname
    let subFolder = "general";

    // Verifications use 'document' or 'verificationDoc'
    if (file.fieldname === "document" || file.fieldname === "verificationDoc" || file.fieldname === "clubDoc") {
      subFolder = "verifications";
    }
    // Reports use 'evidenceFiles' (array upload)
    else if (file.fieldname === "evidenceFiles" || file.fieldname === "evidenceFile") {
      subFolder = "reports";
    }
    // Avatars use 'avatar' or 'profileImage'
    else if (file.fieldname === "avatar" || file.fieldname === "profileImage") {
      subFolder = "avatars";
    }
    // Materials use 'materialFile'
    else if (file.fieldname === "materialFile") {
      subFolder = "materials";
    }

    const uploadPath = path.join(process.cwd(), "uploads", subFolder);

    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Prefix based on fieldname for easy identification
    let prefix = "file";
    if (file.fieldname === "document" || file.fieldname === "verificationDoc" || file.fieldname === "clubDoc") {
      prefix = "vdoc";
    } else if (file.fieldname === "evidenceFiles" || file.fieldname === "evidenceFile") {
      prefix = "rpt";
    } else if (file.fieldname === "avatar" || file.fieldname === "profileImage") {
      prefix = "avtr";
    } else if (file.fieldname === "materialFile") {
      prefix = "mat";
    }

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const defaultMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];

  const materialMimeTypes = [
    ...defaultMimeTypes,
    // docs and text files
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "text/plain", // .txt
    "text/csv", // .csv
    // videos
    "video/mp4",
    "video/x-matroska", // .mkv
    "video/quicktime", // .mov
    "video/webm",
    "video/x-msvideo", // .avi
  ];

  const isMaterialFile =
    file.fieldname === "materialFile" || file.fieldname === "material";
  const allowedMimeTypes = isMaterialFile
    ? materialMimeTypes
    : defaultMimeTypes;

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported for this field"), false);
  }
};

const uploadService = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export default uploadService;

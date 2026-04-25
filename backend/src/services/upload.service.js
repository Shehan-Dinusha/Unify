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
    if (file.fieldname === "document" || file.fieldname === "verificationDoc") {
      subFolder = "verifications";
    }
    // Reports use 'evidenceFile'
    else if (file.fieldname === "evidenceFile") {
      subFolder = "reports";
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
    if (file.fieldname === "document" || file.fieldname === "verificationDoc") {
      prefix = "vdoc";
    } else if (file.fieldname === "evidenceFile") {
      prefix = "rpt";
    }

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  },
});

// File filter (Supports PDF, JPG, PNG, and SVG)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/svg+xml",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only PDF, JPG, PNG, and SVG are allowed."),
      false
    );
  }
};

const uploadService = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export default uploadService;

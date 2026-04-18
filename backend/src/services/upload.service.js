import multer from "multer";
import path from "path";
import fs from "fs";

// Local storage directory (this simulates an S3 bucket space)
const UPLOAD_DIR = path.join(process.cwd(), "uploads/verifications");

// Ensure directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // In actual S3, this would be the bucket configured. For now, it's a local folder.
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Generate a unique identifier mimicking an S3 Object Key
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `batchrep-${uniqueSuffix}${ext}`);
  },
});

// File filter to limit to images/PDFs
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only PDF, JPG, and PNG are allowed."),
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

import multer from "multer";
import path from "path";
import fs from "fs";

// Local storage directory for student reports
const UPLOAD_DIR = path.join(process.cwd(), "uploads/reports");

// Ensure directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `report-${uniqueSuffix}${ext}`);
  },
});

// File filter matching the UI (SVG, PNG, JPG, PDF)
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

const reportUploadService = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit as per UI
});

export default reportUploadService;

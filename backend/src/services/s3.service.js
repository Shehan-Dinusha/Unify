import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

/**
 * Generates a unique file key using crypto to handle replacing files with the same name securely.
 * 
 * @param {string} folder - The folder prefix (e.g., "materials")
 * @param {string} originalName - Original filename
 * @returns {string} - Generated unique S3 object key
 */
const generateFileKey = (folder, originalName) => {
  const ext = path.extname(originalName);
  const hash = crypto.randomBytes(16).toString("hex");
  return `${folder}/${hash}${ext}`;
};

/**
 * Uploads a local file stream to S3.
 * 
 * @param {string} filePath - The local file path to upload
 * @param {string} originalName - Original file name for determining extension
 * @param {string} mimeType - The file's MIME type
 * @param {string} folder - The folder prefix inside S3
 * @returns {Promise<string>} - The object key of the uploaded file
 */
export const uploadFile = async (filePath, originalName, mimeType, folder = "materials") => {
  const fileStream = fs.createReadStream(filePath);
  const fileKey = generateFileKey(folder, originalName);

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileKey,
    Body: fileStream,
    ContentType: mimeType,
  });

  await s3Client.send(command);
  return fileKey;
};

/**
 * Generates a presigned URL for an S3 object.
 * 
 * @param {string} fileKey - The S3 object key
 * @param {number} expiresIn - Expiration time in seconds (default 1 hour)
 * @returns {Promise<string>} - The presigned URL
 */
export const getFileUrl = async (fileKey, expiresIn = 3600) => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileKey,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
};

/**
 * Deletes a file from S3.
 * 
 * @param {string} fileKey - The S3 object key
 * @returns {Promise<void>}
 */
export const deleteFile = async (fileKey) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileKey,
  });

  await s3Client.send(command);
};

export default {
  uploadFile,
  getFileUrl,
  deleteFile,
};

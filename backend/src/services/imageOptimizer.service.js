import sharp from "sharp";

const FULL_MAX_WIDTH = 1920;
const FULL_QUALITY = 80;

export const isImage = (mimeType) => mimeType?.startsWith("image/");

export const optimizeImage = async (buffer, mimeType) => {
  if (mimeType === "image/gif") return buffer;

  return sharp(buffer)
    .resize({ width: FULL_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: FULL_QUALITY })
    .toBuffer();
};

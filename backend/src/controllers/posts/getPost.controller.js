import { NormalPost, ClubProductPost, ClubEventPost, Boarding, User } from "../../modules/index.js";
import { getFileUrl } from "../../services/s3.service.js";

/**
 * Converts an image value (S3 key, private S3 URL, or legacy local path) to
 * a presigned URL. Falls back to the original value for non-S3 paths.
 */
const resolveImageUrl = async (img) => {
  if (!img) return img;

  let imgPath = img;
  // Handle case where img is stored as a JSON object (e.g. { url: "..." } from ClubEventPost)
  if (typeof img === 'object' && img !== null) {
    if (img.url) imgPath = img.url;
    else return imgPath;
  }

  if (typeof imgPath !== 'string') return imgPath;

  // Already a presigned URL (contains X-Amz-Signature) — pass through
  if (imgPath.includes("X-Amz-Signature")) return imgPath;

  // Full private S3 URL like https://bucket.s3.region.amazonaws.com/key
  const s3UrlPattern = /https?:\/\/[^/]+\.amazonaws\.com\/(.+)/;
  const s3UrlMatch = imgPath.match(s3UrlPattern);
  if (s3UrlMatch) {
    try { return await getFileUrl(s3UrlMatch[1]); } catch { return imgPath; }
  }

  // Raw S3 object key (no protocol prefix, e.g. "posts/products/abc123.webp")
  if (!imgPath.startsWith("http") && !imgPath.startsWith("/")) {
    try { return await getFileUrl(imgPath); } catch { return imgPath; }
  }

  // Local path or anything else — return as-is
  return imgPath;
};

const resolveImages = async (images) => {
  if (!Array.isArray(images) || images.length === 0) return images;
  return Promise.all(images.map(resolveImageUrl));
};

const getModelConfig = (type) => {
  switch (type) {
    case "normal":
    case "food-cafe":
    case "services":
      return { Model: NormalPost, authorKey: "author" };
    case "club-product":
      return { Model: ClubProductPost, authorKey: "author" };
    case "club-event":
      return { Model: ClubEventPost, authorKey: "author" };
    case "boarding":
      return { Model: Boarding, authorKey: "host" };
    default:
      return null;
  }
};

export const getPost = async (req, res) => {
  try {
    const { type, id } = req.params;
    
    const config = getModelConfig(type);
    if (!config) {
      return res.status(400).json({ error: "Invalid post type." });
    }

    const { Model, authorKey } = config;

    const post = await Model.findByPk(id, {
      include: [
        {
          model: User,
          as: authorKey,
          attributes: ["id", "name", "email", "avatar", "role"],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Convert to plain object to inject properties
    const postData = post.get({ plain: true });
    postData.postType = type;
    
    // Normalize author property for consistency
    if (authorKey !== "author") {
      postData.author = postData[authorKey];
    }

    // Resolve images to presigned URLs (handles S3 keys, private S3 URLs, etc.)
    if (postData.images) {
      postData.images = await resolveImages(postData.images);
    }
    if (postData.coverImage) {
      postData.coverImage = await resolveImageUrl(postData.coverImage);
    }

    res.status(200).json({ success: true, post: postData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

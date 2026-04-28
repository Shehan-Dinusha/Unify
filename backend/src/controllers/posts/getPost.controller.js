import { NormalPost, ClubProductPost, ClubEventPost, Boarding, User } from "../../modules/index.js";
import { getFileUrl } from "../../services/s3.service.js";

/**
 * Converts an image value (S3 key, private S3 URL, or legacy local path) to
 * a presigned URL. Falls back to the original value for non-S3 paths.
 */
const resolveImageUrl = async (img) => {
  if (!img) return img;

  // Already a presigned URL (contains X-Amz-Signature) — pass through
  if (img.includes("X-Amz-Signature")) return img;

  // Full private S3 URL like https://bucket.s3.region.amazonaws.com/key
  const s3UrlPattern = /https?:\/\/[^/]+\.amazonaws\.com\/(.+)/;
  const s3UrlMatch = img.match(s3UrlPattern);
  if (s3UrlMatch) {
    try { return await getFileUrl(s3UrlMatch[1]); } catch { return img; }
  }

  // Raw S3 object key (no protocol prefix, e.g. "posts/products/abc123.webp")
  if (!img.startsWith("http") && !img.startsWith("/")) {
    try { return await getFileUrl(img); } catch { return img; }
  }

  // Local path or anything else — return as-is
  return img;
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

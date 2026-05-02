import { ClubProductPost, ClubEventPost } from "../../modules/index.js";
import { getFileUrl } from "../../services/s3.service.js";

const resolveUrl = async (img) => {
  if (!img) return img;
  
  let imgPath = img;
  // Handle case where img is stored as a JSON object (e.g. { url: "..." } from ClubEventPost)
  if (typeof img === 'object' && img !== null) {
    if (img.url) imgPath = img.url;
    else return imgPath;
  }

  if (typeof imgPath !== 'string') return imgPath;

  if (imgPath.includes("X-Amz-Signature")) return imgPath;
  const s3Match = imgPath.match(/https?:\/\/[^/]+\.amazonaws\.com\/(.+)/);
  if (s3Match) {
    try { return await getFileUrl(s3Match[1]); } catch { return imgPath; }
  }
  if (!imgPath.startsWith("http") && !imgPath.startsWith("/")) {
    try { return await getFileUrl(imgPath); } catch { return imgPath; }
  }
  return imgPath;
};

export const getClubPosts = async (req, res) => {
  try {
    const authorId = parseInt(req.params.userId, 10);

    if (!authorId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // raw: false so Sequelize auto-parses JSON columns (images, coverImage, etc.)
    const [productPosts, eventPosts] = await Promise.all([
      ClubProductPost.findAll({
        where: { authorId },
        order: [["createdAt", "DESC"]],
      }),
      ClubEventPost.findAll({
        where: { authorId },
        order: [["createdAt", "DESC"]],
      }),
    ]);

    // Resolve product post images
    const resolvedProducts = await Promise.all(
      productPosts.map(async (post) => {
        const plain = post.toJSON();
        if (Array.isArray(plain.images) && plain.images.length > 0) {
          plain.images = await Promise.all(plain.images.map(resolveUrl));
        }
        return { ...plain, postType: "club-product" };
      })
    );

    // Resolve event post cover images
    const resolvedEvents = await Promise.all(
      eventPosts.map(async (post) => {
        const plain = post.toJSON();
        if (plain.coverImage) {
          plain.coverImage = await resolveUrl(plain.coverImage);
        }
        return { ...plain, postType: "club-event" };
      })
    );

    // Merge and sort by newest first
    const posts = [...resolvedProducts, ...resolvedEvents].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("[getClubPosts] Error:", error);
    res.status(500).json({ error: error.message });
  }
};

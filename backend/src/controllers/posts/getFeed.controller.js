import { NormalPost, ClubProductPost, ClubEventPost, Boarding, User, Comment, PostLike, SavedItem } from "../../modules/index.js";
import { getFileUrl } from "../../services/s3.service.js";

const resolveImageUrl = async (img) => {
  if (!img) return img;

  let imgPath = img;
  // Handle case where img is stored as a JSON object (e.g. { url: "..." } from ClubEventPost)
  if (typeof img === "object" && img !== null) {
    if (img.url) imgPath = img.url;
    else return imgPath;
  }

  if (typeof imgPath !== "string") return imgPath;

  if (imgPath.includes("X-Amz-Signature")) return imgPath;
  const s3UrlMatch = imgPath.match(/https?:\/\/[^/]+\.amazonaws\.com\/(.+)/);
  if (s3UrlMatch) {
    try {
      return await getFileUrl(s3UrlMatch[1]);
    } catch {
      return imgPath;
    }
  }
  if (!imgPath.startsWith("http") && !imgPath.startsWith("/")) {
    try {
      return await getFileUrl(imgPath);
    } catch {
      return imgPath;
    }
  }
  return imgPath;
};

const resolvePostImages = async (post) => {
  const resolved = { ...post };
  if (Array.isArray(resolved.images) && resolved.images.length > 0) {
    resolved.images = await Promise.all(resolved.images.map(resolveImageUrl));
  }
  if (resolved.coverImage) {
    resolved.coverImage = await resolveImageUrl(resolved.coverImage);
  }
  return resolved;
};

export const getFeed = async (req, res) => {
  try {
    const { type = "all" } = req.query;
    const userId = req.user?.id || 1; // Default to 1 for development
    const limit = 20;

    // Helper to fetch posts and inject type
    const fetchPosts = async (
      Model,
      postType,
      authorKey = "author",
      where = {},
      order = [["createdAt", "DESC"]],
    ) => {
      const posts = await Model.findAll({
        where,
        limit: type === "popular" ? 10 : 20,
        order,
        include: [
          {
            model: User,
            as: authorKey,
            attributes: ["id", "name", "email", "avatar", "role"],
          },
        ],
        raw: true,
        nest: true,
      });

      return posts.map((post) => ({
        ...post,
        postType,
        // Normalize author reference for the frontend since Boarding uses 'host'
        author: post[authorKey],
      }));
    };

    const tasks = [];

    // ── Feed Logic Mapping ───────────────────────────────────────────────────

    if (type === "all") {
      tasks.push(fetchPosts(NormalPost, "normal"));
      tasks.push(fetchPosts(ClubProductPost, "club-product", "author", { isVisible: true }));
      tasks.push(fetchPosts(ClubEventPost, "club-event", "author", { isVisible: true }));
      tasks.push(fetchPosts(Boarding, "boarding", "host"));
    } else if (type === "club") {
      tasks.push(fetchPosts(NormalPost, "normal", "author", { category: "CLUB" }));
      tasks.push(fetchPosts(ClubProductPost, "club-product", "author", { isVisible: true }));
      tasks.push(fetchPosts(ClubEventPost, "club-event", "author", { isVisible: true }));
    } else if (type === "boarding") {
      tasks.push(fetchPosts(Boarding, "boarding", "host"));
    } else if (type === "food-cafe") {
      tasks.push(
        fetchPosts(NormalPost, "food-cafe", "author", { category: "FOOD" }),
      );
    } else if (type === "services") {
      tasks.push(
        fetchPosts(NormalPost, "services", "author", {
          category: "SELF_EMPLOYED",
        }),
      );
    } else if (type === "marketplace") {
      tasks.push(fetchPosts(ClubProductPost, "club-product", "author", { isVisible: true }));
    } else if (type === "event") {
      tasks.push(fetchPosts(ClubEventPost, "club-event", "author", { isVisible: true }));
    } else if (type === "popular") {
      tasks.push(fetchPosts(ClubProductPost, "club-product", "author", { isVisible: true }, [["likesCount", "DESC"], ["createdAt", "DESC"]]));
      tasks.push(fetchPosts(ClubEventPost, "club-event", "author", { isVisible: true }, [["likesCount", "DESC"], ["createdAt", "DESC"]]));
    }

    // Fetch concurrently
    const results = await Promise.all(tasks);

    // Combine results from different models
    let combinedFeed = results.flat();

    // Sort accordingly
    if (type === "popular") {
      combinedFeed.sort((a, b) => {
        const likesDiff = (b.likesCount || 0) - (a.likesCount || 0);
        if (likesDiff !== 0) return likesDiff;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      combinedFeed = combinedFeed.slice(0, 7);
    } else {
      combinedFeed.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    // Resolve S3 image keys/private URLs to presigned URLs
    const resolvedFeed = await Promise.all(combinedFeed.map(resolvePostImages));

    // Inject interaction state (comments count, isLiked, isSaved)
    const feedWithInteractions = await Promise.all(
      resolvedFeed.map(async (post) => {
        const [commentsCount, likeRecord, saveRecord] = await Promise.all([
          Comment.count({ where: { postId: post.id, postType: post.postType } }),
          PostLike.findOne({ where: { userId, postId: post.id, postType: post.postType } }),
          SavedItem.findOne({ where: { userId, postId: post.id, postType: post.postType } }),
        ]);

        return {
          ...post,
          commentsCount,
          isLiked: !!likeRecord,
          isSaved: !!saveRecord,
        };
      })
    );

    res.status(200).json({ success: true, feed: feedWithInteractions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

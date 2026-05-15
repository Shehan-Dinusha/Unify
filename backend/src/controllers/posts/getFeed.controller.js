import { NormalPost, ClubProductPost, ClubEventPost, Boarding, User, Comment, PostLike, SavedItem } from "../../modules/index.js";
import { getFileUrl } from "../../services/s3.service.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";
import boostService from "../../services/boost.service.js";

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
  // Resolve author avatar
  if (resolved.author?.avatar !== undefined) {
    resolved.author = {
      ...resolved.author,
      avatar: await resolveAvatarUrl(resolved.author.avatar, resolved.author.name),
    };
  }
  // Resolve host avatar (Boarding posts use 'host')
  if (resolved.host?.avatar !== undefined) {
    resolved.host = {
      ...resolved.host,
      avatar: await resolveAvatarUrl(resolved.host.avatar, resolved.host.name),
    };
  }
  return resolved;
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * getFeed — The BOOST-AWARE Feed Controller
 * ═══════════════════════════════════════════════════════════════════════
 *
 * HOW THE 6 BOOST FEATURES WORK HERE:
 *
 * ┌─────────────────────────┬──────────────────────────────────────────┐
 * │ boostConfig Parameter   │ What it does in this controller          │
 * ├─────────────────────────┼──────────────────────────────────────────┤
 * │ feedPriority (1-10)     │ Boosted posts sort to the TOP of feed.  │
 * │                         │ Lower number = higher position.          │
 * │                         │ feedPriority=1 always shows first.      │
 * ├─────────────────────────┼──────────────────────────────────────────┤
 * │ visibilityMultiplier    │ The post can appear MULTIPLE times in   │
 * │ (1-5)                   │ the feed. 2x = post shows twice, once   │
 * │                         │ at its priority slot and again lower.   │
 * ├─────────────────────────┼──────────────────────────────────────────┤
 * │ highlightStyle          │ Injected into the post response so the  │
 * │ ("none"|"subtle"|       │ frontend PostCard renders a matching    │
 * │  "blue"|"gold")         │ border/glow/badge style.                │
 * ├─────────────────────────┼──────────────────────────────────────────┤
 * │ crossCategoryReach      │ If true, the post appears in EVERY      │
 * │ (boolean)               │ category feed (club, boarding, etc.)    │
 * │                         │ even if it belongs to a different one.  │
 * ├─────────────────────────┼──────────────────────────────────────────┤
 * │ analyticsLevel          │ Passed through to frontend. "basic"     │
 * │ ("none"|"basic"|        │ shows impression count. "detailed"      │
 * │  "detailed")            │ shows impressions + clicks + CTR.       │
 * └─────────────────────────┴──────────────────────────────────────────┘
 */
export const getFeed = async (req, res) => {
  try {
    const { type = "all" } = req.query;
    const userId = req.user?.id;
    const limit = 20;

    // ═══════ STEP 1: Fetch the active boost map from DB ═══════
    // Returns Map<postId, boostMeta> for all posts with active boosts
    const boostMap = await boostService.getActiveBoostsForFeed();

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
        fetchPosts(NormalPost, "service", "author", {
          category: "SELF_EMPLOYED",
        }),
      );
    } else if (type === "marketplace") {
      tasks.push(fetchPosts(ClubProductPost, "club-product", "author", { isVisible: true }));
    } else if (type === "event") {
      tasks.push(fetchPosts(ClubEventPost, "club-event", "author", { isVisible: true }));
    } else if (type === "my-posts") {
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      // Fetch ALL posts by the current user, including hidden ones
      tasks.push(fetchPosts(NormalPost, "normal", "author", { authorId: userId }));
      tasks.push(fetchPosts(ClubProductPost, "club-product", "author", { authorId: userId }));
      tasks.push(fetchPosts(ClubEventPost, "club-event", "author", { authorId: userId }));
      tasks.push(fetchPosts(Boarding, "boarding", "host", { hostId: userId }));
    } else if (type === "popular") {
      tasks.push(fetchPosts(ClubProductPost, "club-product", "author", { isVisible: true }, [["likesCount", "DESC"], ["createdAt", "DESC"]]));
      tasks.push(fetchPosts(ClubEventPost, "club-event", "author", { isVisible: true }, [["likesCount", "DESC"], ["createdAt", "DESC"]]));
    }

    // Fetch concurrently
    const results = await Promise.all(tasks);

    // Combine results from different models
    let combinedFeed = results.flat();

    // ═══════ STEP 2: FEATURE — crossCategoryReach ═══════
    // If a boosted post has crossCategoryReach=true and we're filtering
    // by a specific category, INJECT that post into this feed too.
    if (type !== "all" && type !== "popular") {
      const existingIds = new Set(combinedFeed.map((p) => `${p.postType}-${p.id}`));

      for (const [postId, boostMeta] of boostMap.entries()) {
        if (boostMeta.crossCategoryReach) {
          // Check if this post is already in the current feed
          // We need to find it from any model
          const key1 = `normal-${postId}`;
          const key2 = `club-product-${postId}`;
          const key3 = `club-event-${postId}`;
          const key4 = `boarding-${postId}`;

          if (!existingIds.has(key1) && !existingIds.has(key2) && !existingIds.has(key3) && !existingIds.has(key4)) {
            // This boosted post isn't in the current category feed — inject it
            // Try to find the post from any model
            const models = [
              { Model: NormalPost, type: "normal", authorKey: "author" },
              { Model: ClubProductPost, type: "club-product", authorKey: "author" },
              { Model: ClubEventPost, type: "club-event", authorKey: "author" },
              { Model: Boarding, type: "boarding", authorKey: "host" },
            ];

            for (const { Model, type: pType, authorKey } of models) {
              const post = await Model.findOne({
                where: { id: postId },
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

              if (post) {
                combinedFeed.push({
                  ...post,
                  postType: pType,
                  author: post[authorKey],
                  _crossCategoryInjected: true,
                });
                break;
              }
            }
          }
        }
      }
    }

    // ═══════ STEP 3: FEATURE — feedPriority sorting ═══════
    // Split feed into boosted posts and regular posts
    const boostedPosts = [];
    const regularPosts = [];

    for (const post of combinedFeed) {
      const boostMeta = boostMap.get(post.id);
      if (boostMeta) {
        boostedPosts.push({ ...post, _boostMeta: boostMeta });
      } else {
        regularPosts.push(post);
      }
    }

    // Sort boosted posts by feedPriority (lower = higher in feed)
    boostedPosts.sort((a, b) => {
      const priorityDiff = (a._boostMeta.feedPriority || 10) - (b._boostMeta.feedPriority || 10);
      if (priorityDiff !== 0) return priorityDiff;
      // Same priority? Higher price wins
      return (b._boostMeta.packagePrice || 0) - (a._boostMeta.packagePrice || 0);
    });

    // Sort regular posts normally
    if (type === "popular") {
      regularPosts.sort((a, b) => {
        const likesDiff = (b.likesCount || 0) - (a.likesCount || 0);
        if (likesDiff !== 0) return likesDiff;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } else {
      regularPosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    // ═══════ STEP 3.5: FEATURE — autoRefreshHours ═══════
    // If a boosted post has autoRefreshHours > 0, treat its createdAt as
    // the most recent refresh cycle. This makes it appear as "fresh" content
    // even if the original post is days old — like OLX/Facebook ad bumping.
    const now = new Date();
    for (const post of boostedPosts) {
      const refreshHours = post._boostMeta.autoRefreshHours || 0;
      if (refreshHours > 0) {
        const purchaseDate = new Date(post._boostMeta.purchaseDate || post.createdAt);
        const hoursSincePurchase = (now - purchaseDate) / (1000 * 60 * 60);
        const refreshCycles = Math.floor(hoursSincePurchase / refreshHours);
        // Set createdAt to the latest refresh point (so it sorts as recent)
        const latestRefresh = new Date(purchaseDate.getTime() + refreshCycles * refreshHours * 60 * 60 * 1000);
        post.createdAt = latestRefresh > purchaseDate ? latestRefresh.toISOString() : post.createdAt;
      }
    }

    // ═══════ STEP 4: FEATURE — visibilityMultiplier ═══════
    // If a boosted post has visibilityMultiplier > 1, insert duplicate
    // entries at calculated positions deeper in the feed.
    // NOTE: This feature is disabled for "My Posts" view to avoid confusion.
    const boostDuplicates = [];
    if (type !== "my-posts") {
      for (const post of boostedPosts) {
        const multiplier = post._boostMeta.visibilityMultiplier || 1;
        if (multiplier > 1) {
          // Insert extra copies spaced evenly through the regular feed
          for (let i = 1; i < multiplier; i++) {
            boostDuplicates.push({
              ...post,
              _duplicateSlot: i, // Which duplicate this is (for position calc)
            });
          }
        }
      }
    }

    // Build the final feed: boosted first, then regular posts with duplicates inserted
    let finalFeed = [...boostedPosts, ...regularPosts];

    // Insert duplicates at spaced positions within the regular section
    for (const dup of boostDuplicates) {
      // Space them evenly: slot 1 goes at ~33% through, slot 2 at ~66%, etc.
      const insertIndex = Math.min(
        boostedPosts.length + Math.floor((regularPosts.length / (dup._boostMeta.visibilityMultiplier + 1)) * (dup._duplicateSlot + 1)),
        finalFeed.length
      );
      finalFeed.splice(insertIndex, 0, dup);
    }

    // Trim to limit
    if (type === "popular") {
      finalFeed = finalFeed.slice(0, 7);
    }

    // Resolve S3 image keys/private URLs to presigned URLs
    const resolvedFeed = await Promise.all(finalFeed.map(resolvePostImages));

    // ═══════ STEP 5: Inject boostMeta + interactions into each post ═══════
    const feedWithInteractions = await Promise.all(
      resolvedFeed.map(async (post) => {
        const [commentsCount, likeRecord, saveRecord] = await Promise.all([
          Comment.count({ where: { postId: post.id, postType: post.postType } }),
          PostLike.findOne({ where: { userId, postId: post.id, postType: post.postType } }),
          SavedItem.findOne({ where: { userId, postId: post.id, postType: post.postType } }),
        ]);

        const boostMeta = boostMap.get(post.id);

        return {
          ...post,
          commentsCount,
          isLiked: !!likeRecord,
          isSaved: !!saveRecord,
          // ═══════ FEATURE — highlightStyle + analyticsLevel ═══════
          // These are passed to the frontend PostCard so it knows how to render
          isPromoted: !!boostMeta,
          boostMeta: boostMeta
            ? {
                packageName: boostMeta.packageName,
                packageBadge: boostMeta.packageBadge,
                highlightStyle: boostMeta.highlightStyle,
                analyticsAccess: boostMeta.analyticsAccess,
                expiresAt: boostMeta.expiryDate,
              }
            : null,
          // Clean up internal fields
          _boostMeta: undefined,
          _duplicateSlot: undefined,
          _crossCategoryInjected: undefined,
        };
      })
    );

    res.status(200).json({ success: true, feed: feedWithInteractions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

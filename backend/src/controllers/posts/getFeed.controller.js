import { NormalPost, ClubProductPost, ClubEventPost, Boarding, User, Comment, PostLike, SavedItem } from "../../modules/index.js";
import { resolveAssetUrl } from "../../utils/assetUrl.util.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";
import boostService from "../../services/boost.service.js";

const resolvePostImages = async (post) => {
  const resolved = { ...post };
  if (Array.isArray(resolved.images) && resolved.images.length > 0) {
    resolved.images = await Promise.all(resolved.images.map(resolveAssetUrl));
  }
  if (resolved.coverImage) {
    resolved.coverImage = await resolveAssetUrl(resolved.coverImage);
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

      for (const [mapKey, boostMeta] of boostMap.entries()) {
        const lastDash = mapKey.lastIndexOf('-');
        const postType = mapKey.slice(0, lastDash);
        const postIdStr = mapKey.slice(lastDash + 1);
        const postId = parseInt(postIdStr, 10);

        if (boostMeta.crossCategoryReach) {
          if (!existingIds.has(mapKey)) {
            // This boosted post isn't in the current category feed — inject it
            const modelsMap = {
              'normal': { Model: NormalPost, authorKey: "author" },
              'club-product': { Model: ClubProductPost, authorKey: "author" },
              'club-event': { Model: ClubEventPost, authorKey: "author" },
              'boarding': { Model: Boarding, authorKey: "host" },
            };
            const modelInfo = modelsMap[postType];
            if (modelInfo) {
              const post = await modelInfo.Model.findOne({
                where: { id: postId },
                include: [
                  {
                    model: User,
                    as: modelInfo.authorKey,
                    attributes: ["id", "name", "email", "avatar", "role"],
                  },
                ],
                raw: true,
                nest: true,
              });

              if (post) {
                combinedFeed.push({
                  ...post,
                  postType: postType,
                  author: post[modelInfo.authorKey],
                  _crossCategoryInjected: true,
                });
              }
            }
          }
        }
      }
    }

    // ═══════ STEP 3: FEATURE — feedPriority sorting & autoRefreshHours ═══════
    // Split feed into boosted posts and regular posts
    const boostedPosts = [];
    const regularPosts = [];
    const now = new Date();

    for (const post of combinedFeed) {
      post._sortTimestamp = new Date(post.createdAt); // Default for all

      const boostMeta = boostMap.get(`${post.postType}-${post.id}`);
      if (boostMeta) {
        // Calculate autoRefreshHours impact on sortTimestamp
        const refreshHours = boostMeta.autoRefreshHours || 0;
        if (refreshHours > 0) {
          const purchaseDate = new Date(boostMeta.purchaseDate || post.createdAt);
          const hoursSincePurchase = (now - purchaseDate) / (1000 * 60 * 60);
          const refreshCycles = Math.floor(hoursSincePurchase / refreshHours);
          const latestRefresh = new Date(purchaseDate.getTime() + refreshCycles * refreshHours * 60 * 60 * 1000);
          if (latestRefresh > purchaseDate) {
            post._sortTimestamp = latestRefresh;
          }
        }

        // Calculate ranking score instead of inserting duplicates
        const priority = boostMeta.feedPriority || 10;
        const multiplier = boostMeta.visibilityMultiplier || 1;
        const score = (11 - priority) * 100 + multiplier * 10;
        
        boostedPosts.push({ ...post, _boostMeta: boostMeta, _score: score });
      } else {
        regularPosts.push(post);
      }
    }

    // Sort boosted posts by score descending
    boostedPosts.sort((a, b) => {
      const scoreDiff = b._score - a._score;
      if (scoreDiff !== 0) return scoreDiff;
      // Same score? Higher price wins
      const priceDiff = (b._boostMeta.packagePrice || 0) - (a._boostMeta.packagePrice || 0);
      if (priceDiff !== 0) return priceDiff;
      // Finally, sort by refresh timestamp
      return b._sortTimestamp - a._sortTimestamp;
    });

    // Sort regular posts normally using _sortTimestamp
    if (type === "popular") {
      regularPosts.sort((a, b) => {
        const likesDiff = (b.likesCount || 0) - (a.likesCount || 0);
        if (likesDiff !== 0) return likesDiff;
        return b._sortTimestamp - a._sortTimestamp;
      });
    } else {
      regularPosts.sort(
        (a, b) => b._sortTimestamp - a._sortTimestamp
      );
    }

    // Build the final feed: boosted first, then regular posts
    let finalFeed = [...boostedPosts, ...regularPosts];

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

        const boostMeta = boostMap.get(`${post.postType}-${post.id}`);

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
                purchaseId: boostMeta.purchaseId,
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
          _sortTimestamp: undefined,
          _score: undefined,
        };
      })
    );

    res.status(200).json({ success: true, feed: feedWithInteractions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

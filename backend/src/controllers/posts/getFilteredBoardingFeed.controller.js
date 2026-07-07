import { Boarding, User, Comment, PostLike, SavedItem } from "../../modules/index.js";
import { Op } from "sequelize";
import { resolveAssetUrl } from "../../utils/assetUrl.util.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";

const resolvePostImages = async (post) => {
  const resolved = { ...post };
  if (Array.isArray(resolved.images) && resolved.images.length > 0) {
    resolved.images = await Promise.all(resolved.images.map(resolveAssetUrl));
  }
  // Resolve the author (host) avatar — this is the profile picture shown on the post card
  if (resolved.author?.avatar !== undefined) {
    resolved.author = {
      ...resolved.author,
      avatar: await resolveAvatarUrl(resolved.author.avatar, resolved.author.name),
    };
  }
  return resolved;
};

export const getFilteredBoardingFeed = async (req, res) => {
  try {
    const { minPrice, maxPrice, gender } = req.query;
    const userId = req.user?.id;
    
    const whereClause = {};

    // Gender filtering
    if (gender && gender !== 'Any') {
      whereClause.gender = {
        [Op.in]: [gender, 'Any']
      };
    }

    const posts = await Boarding.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "host",
          attributes: ["id", "name", "email", "avatar", "role"],
        },
      ],
      raw: true,
      nest: true,
    });

    // Price filtering (done in JavaScript to safely handle strings like "7500 /mo")
    let filteredPosts = posts;
    if (minPrice || maxPrice) {
      const min = minPrice ? parseInt(minPrice) : 0;
      const max = maxPrice ? parseInt(maxPrice) : Number.MAX_SAFE_INTEGER;
      
      filteredPosts = posts.filter(post => {
        if (!post.price) return false;
        
        // Extract numeric part from price string (e.g. "7500" from "7500 /mo")
        const numericPrice = parseInt(post.price.toString().replace(/[^0-9]/g, ''));
        if (isNaN(numericPrice)) return false;
        
        return numericPrice >= min && numericPrice <= max;
      });
    }

    const formattedPosts = filteredPosts.map((post) => ({
      ...post,
      postType: "boarding",
      author: post.host, // Map host to author for frontend compatibility
    }));

    const resolvedFeed = await Promise.all(formattedPosts.map(resolvePostImages));

    // Inject interaction state (comments count, isLiked, isSaved)
    const feedWithInteractions = await Promise.all(
      resolvedFeed.map(async (post) => {
        const [commentsCount, likeRecord, saveRecord] = await Promise.all([
          Comment.count({ where: { postId: post.id, postType: post.postType } }),
          userId ? PostLike.findOne({ where: { userId, postId: post.id, postType: post.postType } }) : null,
          userId ? SavedItem.findOne({ where: { userId, postId: post.id, postType: post.postType } }) : null,
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

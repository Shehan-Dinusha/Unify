import { NormalPost, ClubProductPost, ClubEventPost, Boarding, User } from "../../modules/index.js";

export const getFeed = async (req, res) => {
  try {
    const { type = "all" } = req.query;
    const limit = 20;

    // Helper to fetch posts and inject type
    const fetchPosts = async (Model, postType, authorKey = "author", where = {}, order = [["createdAt", "DESC"]]) => {
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
      tasks.push(fetchPosts(ClubProductPost, "club-product"));
      tasks.push(fetchPosts(ClubEventPost, "club-event"));
      tasks.push(fetchPosts(Boarding, "boarding", "host"));
    } else if (type === "club") {
      tasks.push(fetchPosts(NormalPost, "normal", "author", { category: "CLUB" }));
      tasks.push(fetchPosts(ClubProductPost, "club-product"));
      tasks.push(fetchPosts(ClubEventPost, "club-event"));
    } else if (type === "boarding") {
      tasks.push(fetchPosts(Boarding, "boarding", "host"));
    } else if (type === "food-cafe") {
      tasks.push(fetchPosts(NormalPost, "food-cafe", "author", { category: "FOOD" }));
    } else if (type === "services") {
      tasks.push(fetchPosts(NormalPost, "services", "author", { category: "SELF_EMPLOYED" }));
    } else if (type === "marketplace") {
      tasks.push(fetchPosts(ClubProductPost, "club-product"));
    } else if (type === "event") {
      tasks.push(fetchPosts(ClubEventPost, "club-event"));
    } else if (type === "popular") {
      tasks.push(fetchPosts(ClubProductPost, "club-product", "author", {}, [["likesCount", "DESC"]]));
      tasks.push(fetchPosts(ClubEventPost, "club-event", "author", {}, [["likesCount", "DESC"]]));
    }

    // Fetch concurrently
    const results = await Promise.all(tasks);
    
    // Combine results from different models
    let combinedFeed = results.flat();

    // Sort accordingly
    if (type === "popular") {
      combinedFeed.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
      combinedFeed = combinedFeed.slice(0, 10);
    } else {
      combinedFeed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.status(200).json({ success: true, feed: combinedFeed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

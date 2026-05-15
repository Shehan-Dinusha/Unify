import {
  sequelize,
  User,
  BusinessProfile,
  Post,
  ClubProductPost,
  BoostPackage,
  BoostPurchase,
  BoostLog,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import bcrypt from "bcryptjs";

/**
 * seedBoostData
 *
 * Seeds comprehensive boost system test data:
 * - 2 business users with posts
 * - 3 boost packages (Starter/Growth/Dominate) with boostConfig
 * - Active boost purchases linking posts to packages
 * - Audit logs
 *
 * Call: POST /api/v1/base/seed-boost-data
 */
export const seedBoostData = async (req, res, next) => {
  logger.info("Starting Boost System data seeding...");

  try {
    await sequelize.authenticate();
    logger.info("Database connected successfully for boost seeding.");

    // Fix sequences if needed
    try {
      await sequelize.query(
        `SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id),1) FROM users));`,
      );
      await sequelize.query(
        `SELECT setval('normal_posts_id_seq', (SELECT COALESCE(MAX(id),1) FROM normal_posts));`,
      );
      await sequelize.query(
        `SELECT setval('club_product_posts_id_seq', (SELECT COALESCE(MAX(id),1) FROM club_product_posts));`,
      );
      await sequelize.query(
        `SELECT setval('boost_purchases_id_seq', (SELECT COALESCE(MAX(id),1) FROM boost_purchases));`,
      );
    } catch (err) {
      logger.info("Sequence fix skipped or not required.");
    }

    const passwordHash = await bcrypt.hash("password123", 10);

    // ── 1. Business Users ───────────────────────────────────────────────────

    const [foodBizUser] = await User.findOrCreate({
      where: { email: "eatstreet@unify.com" },
      defaults: {
        name: "Eat Street Kitchen",
        email: "eatstreet@unify.com",
        passwordHash,
        role: "Business",
        phone: "+94774444444",
      },
    });

    await BusinessProfile.findOrCreate({
      where: { userId: foodBizUser.id },
      defaults: {
        userId: foodBizUser.id,
        displayName: "Eat Street Kitchen",
        businessName: "Eat Street Kitchen Unify",
        category: "FOOD",
        addresses: { primary: "Near Main Gate, SLIIT Malabe" },
      },
    });

    const [techBizUser] = await User.findOrCreate({
      where: { email: "techrepair@unify.com" },
      defaults: {
        name: "TechFix Pro Services",
        email: "techrepair@unify.com",
        passwordHash,
        role: "Business",
        phone: "+94775555555",
      },
    });

    await BusinessProfile.findOrCreate({
      where: { userId: techBizUser.id },
      defaults: {
        userId: techBizUser.id,
        displayName: "TechFix Pro Services",
        businessName: "TechFix Pro Services Unify",
        category: "SELF_EMPLOYED",
        addresses: { primary: "IT Park, Malabe" },
      },
    });

    logger.info(`Business users created: ${foodBizUser.id}, ${techBizUser.id}`);

    // ── 2. Business Posts (NormalPosts with FOOD/SELF_EMPLOYED category) ───

    const [foodPost1] = await Post.findOrCreate({
      where: { authorId: foodBizUser.id, description: "🍔 SEMESTER SPECIAL! Buy 2 Burgers Get 1 Free — only this week at Eat Street Kitchen. Premium wagyu patties with our signature spicy sauce. Available for pickup 11AM-9PM!" },
      defaults: {
        authorId: foodBizUser.id,
        description: "🍔 SEMESTER SPECIAL! Buy 2 Burgers Get 1 Free — only this week at Eat Street Kitchen. Premium wagyu patties with our signature spicy sauce. Available for pickup 11AM-9PM!",
        type: "Business",
        isPromoted: false,
        likesCount: 42,
      },
    });

    const [foodPost2] = await Post.findOrCreate({
      where: { authorId: foodBizUser.id, description: "☕ NEW: Iced Coffee Bar now open! Try our Caramel Macchiato, Matcha Latte, or Brown Sugar Boba. First 50 orders get 30% off. Student ID required." },
      defaults: {
        authorId: foodBizUser.id,
        description: "☕ NEW: Iced Coffee Bar now open! Try our Caramel Macchiato, Matcha Latte, or Brown Sugar Boba. First 50 orders get 30% off. Student ID required.",
        type: "Business",
        isPromoted: false,
        likesCount: 28,
      },
    });

    const [techPost1] = await Post.findOrCreate({
      where: { authorId: techBizUser.id, description: "💻 Laptop Acting Slow? We fix it in 30 minutes! Screen replacement, battery swap, SSD upgrades — all at student-friendly prices. DM for quick quote. Walk-ins welcome at IT Park." },
      defaults: {
        authorId: techBizUser.id,
        description: "💻 Laptop Acting Slow? We fix it in 30 minutes! Screen replacement, battery swap, SSD upgrades — all at student-friendly prices. DM for quick quote. Walk-ins welcome at IT Park.",
        type: "Business",
        isPromoted: false,
        likesCount: 35,
      },
    });

    const [techPost2] = await Post.findOrCreate({
      where: { authorId: techBizUser.id, description: "📱 iPhone 15 Screen Protector + Case combo for Rs. 2,500 only! Limited stock. Tempered glass + military-grade drop protection. Also available for Samsung Galaxy S24." },
      defaults: {
        authorId: techBizUser.id,
        description: "📱 iPhone 15 Screen Protector + Case combo for Rs. 2,500 only! Limited stock. Tempered glass + military-grade drop protection. Also available for Samsung Galaxy S24.",
        type: "Business",
        isPromoted: false,
        likesCount: 19,
      },
    });

    // A marketplace product post for variety
    const [productPost] = await ClubProductPost.findOrCreate({
      where: { name: "Premium Laptop Stand — Ergonomic Aluminum" },
      defaults: {
        authorId: techBizUser.id,
        name: "Premium Laptop Stand — Ergonomic Aluminum",
        description: "Adjustable height, foldable, works with all laptops up to 17 inches. Heat dissipation design. Perfect for students who spend long hours coding.",
        price: 3500,
        category: "Tech Accessories",
        isPromoted: false,
        isVisible: true,
        likesCount: 15,
      },
    });

    // A couple of regular student posts (not boosted — for contrast in feed)
    const [regularPost1] = await Post.findOrCreate({
      where: { description: "Anyone knows a good place for a group study session near campus? We need wifi and AC 😅" },
      defaults: {
        authorId: foodBizUser.id, // reuse user
        description: "Anyone knows a good place for a group study session near campus? We need wifi and AC 😅",
        type: "General",
        isPromoted: false,
        likesCount: 5,
      },
    });

    logger.info(`Posts created: Posts ${foodPost1.id}, ${foodPost2.id}, ${techPost1.id}, ${techPost2.id} | ClubProduct ${productPost.id}`);

    // ── 3. Boost Packages with boostConfig ────────────────────────────────

    const [starterPkg] = await BoostPackage.findOrCreate({
      where: { name: "Starter Boost" },
      defaults: {
        id: "PKG-SEED-STARTER",
        name: "Starter Boost",
        price: 1000,
        durationValue: 24,
        durationUnit: "Hours",
        description: "Get your post noticed with basic promotion. Ideal for first-time advertisers.",
        badge: "No Badge",
        features: [
          "Priority #7 Feed Placement",
          "Sponsored Label on Post",
          "24 Hours Promotion Period",
        ],
        boostConfig: {
          feedPriority: 7,
          visibilityMultiplier: 1,
          highlightStyle: "subtle",
          crossCategoryReach: false,
          analyticsAccess: false,
          autoRefreshHours: 0,
        },
        status: "live",
      },
    });

    const [growthPkg] = await BoostPackage.findOrCreate({
      where: { name: "Growth Boost" },
      defaults: {
        id: "PKG-SEED-GROWTH",
        name: "Growth Boost",
        price: 2500,
        durationValue: 3,
        durationUnit: "Days",
        description: "Maximize your reach with priority placement and 2x visibility. Perfect for promotions.",
        badge: "Most Popular",
        features: [
          "Priority #3 Feed Placement",
          "2x Visibility Boost",
          "Blue Highlighted Card + Badge",
          "Boost Analytics Dashboard",
          "Auto-Refresh Every 12 Hours",
          "3 Days Promotion Period",
        ],
        boostConfig: {
          feedPriority: 3,
          visibilityMultiplier: 2,
          highlightStyle: "blue",
          crossCategoryReach: false,
          analyticsAccess: true,
          autoRefreshHours: 12,
        },
        status: "live",
      },
    });

    const [dominatePkg] = await BoostPackage.findOrCreate({
      where: { name: "Dominate Boost" },
      defaults: {
        id: "PKG-SEED-DOMINATE",
        name: "Dominate Boost",
        price: 5000,
        durationValue: 7,
        durationUnit: "Days",
        description: "Total domination. Your post is #1 in every feed, with gold styling and full analytics.",
        badge: "Premium",
        features: [
          "Always #1 in Feed",
          "3x Visibility Boost",
          "\u26A1 Gold Premium Card Styling",
          "Appears in All Category Feeds",
          "Boost Analytics Dashboard",
          "Auto-Refresh Every 6 Hours",
          "7 Days Promotion Period",
        ],
        boostConfig: {
          feedPriority: 1,
          visibilityMultiplier: 3,
          highlightStyle: "gold",
          crossCategoryReach: true,
          analyticsAccess: true,
          autoRefreshHours: 6,
        },
        status: "live",
      },
    });

    logger.info(`Boost packages created: ${starterPkg.id}, ${growthPkg.id}, ${dominatePkg.id}`);

    // ── 4. Active Boost Purchases ─────────────────────────────────────────

    const now = new Date();

    // Food Post 1 → Dominate package (gold glow, #1 in feed, cross-category)
    const dominateExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days
    const [dominatePurchase] = await BoostPurchase.findOrCreate({
      where: { transactionId: "TXN-SEED-DOMINATE-001" },
      defaults: {
        userId: foodBizUser.id,
        businessId: null,
        packageId: dominatePkg.id,
        postId: foodPost1.id,
        purchaseDate: now.toISOString(),
        expiryDate: dominateExpiry.toISOString(),
        status: "active",
        transactionId: "TXN-SEED-DOMINATE-001",
        amount: 5000,
      },
    });

    // Mark the post as promoted
    await Post.update(
      { isPromoted: true },
      { where: { id: foodPost1.id } },
    );

    // Tech Post 1 → Growth package (blue border, #3 in feed, 2x visibility)
    const growthExpiry = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // +3 days
    const [growthPurchase] = await BoostPurchase.findOrCreate({
      where: { transactionId: "TXN-SEED-GROWTH-001" },
      defaults: {
        userId: techBizUser.id,
        businessId: null,
        packageId: growthPkg.id,
        postId: techPost1.id,
        purchaseDate: now.toISOString(),
        expiryDate: growthExpiry.toISOString(),
        status: "active",
        transactionId: "TXN-SEED-GROWTH-001",
        amount: 2500,
      },
    });

    await Post.update(
      { isPromoted: true },
      { where: { id: techPost1.id } },
    );

    // Food Post 2 → Starter package (subtle label, #7 in feed)
    const starterExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 hours
    const [starterPurchase] = await BoostPurchase.findOrCreate({
      where: { transactionId: "TXN-SEED-STARTER-001" },
      defaults: {
        userId: foodBizUser.id,
        businessId: null,
        packageId: starterPkg.id,
        postId: foodPost2.id,
        purchaseDate: now.toISOString(),
        expiryDate: starterExpiry.toISOString(),
        status: "active",
        transactionId: "TXN-SEED-STARTER-001",
        amount: 1000,
      },
    });

    await Post.update(
      { isPromoted: true },
      { where: { id: foodPost2.id } },
    );

    logger.info(`Boost purchases created: Dominate(post ${foodPost1.id}), Growth(post ${techPost1.id}), Starter(post ${foodPost2.id})`);

    // ── 5. Audit Logs ─────────────────────────────────────────────────────

    await BoostLog.findOrCreate({
      where: { id: "log-seed-starter" },
      defaults: {
        id: "log-seed-starter",
        type: "package_added",
        packageId: starterPkg.id,
        changedBy: null,
        title: "New package 'Starter Boost' created",
        description: "Tier added with pricing: Rs. 1,000 / 24 Hours",
        changes: { name: "Starter Boost", price: 1000, boostConfig: starterPkg.boostConfig },
      },
    });

    await BoostLog.findOrCreate({
      where: { id: "log-seed-growth" },
      defaults: {
        id: "log-seed-growth",
        type: "package_added",
        packageId: growthPkg.id,
        changedBy: null,
        title: "New package 'Growth Boost' created",
        description: "Tier added with pricing: Rs. 2,500 / 3 Days",
        changes: { name: "Growth Boost", price: 2500, boostConfig: growthPkg.boostConfig },
      },
    });

    await BoostLog.findOrCreate({
      where: { id: "log-seed-dominate" },
      defaults: {
        id: "log-seed-dominate",
        type: "package_added",
        packageId: dominatePkg.id,
        changedBy: null,
        title: "New package 'Dominate Boost' created",
        description: "Tier added with pricing: Rs. 5,000 / 7 Days",
        changes: { name: "Dominate Boost", price: 5000, boostConfig: dominatePkg.boostConfig },
      },
    });

    logger.info("Boost audit logs created.");

    // ── Summary ───────────────────────────────────────────────────────────

    const summary = {
      businessUsers: [
        { id: foodBizUser.id, name: "Eat Street Kitchen", email: "eatstreet@unify.com" },
        { id: techBizUser.id, name: "TechFix Pro Services", email: "techrepair@unify.com" },
      ],
      posts: {
        boosted: [
          { id: foodPost1.id, desc: "Burger special", boost: "Dominate (gold, #1, cross-category)" },
          { id: techPost1.id, desc: "Laptop repair", boost: "Growth (blue, #3, 2x visibility)" },
          { id: foodPost2.id, desc: "Coffee bar", boost: "Starter (subtle, #7)" },
        ],
        nonBoosted: [
          { id: techPost2.id, desc: "iPhone accessories" },
          { id: productPost.id, desc: "Laptop stand (marketplace)" },
          { id: regularPost1.id, desc: "Study session question" },
        ],
      },
      packages: [
        { id: starterPkg.id, name: "Starter Boost", price: 1000 },
        { id: growthPkg.id, name: "Growth Boost", price: 2500 },
        { id: dominatePkg.id, name: "Dominate Boost", price: 5000 },
      ],
      loginCredentials: "All users use password: password123",
    };

    logger.info("Boost system data seeded successfully!");
    return sendResponse(res, 200, true, "Boost test data seeded successfully!", summary);
  } catch (error) {
    logger.error("Error seeding boost data:", error);
    return sendResponse(res, 500, false, "Failed to seed boost data", error.message);
  }
};

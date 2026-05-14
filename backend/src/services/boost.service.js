import { Op } from "sequelize";
import {
  BoostPackage,
  BoostPurchase,
  BoostLog,
  User,
  Post,
  NormalPost,
  ClubProductPost,
  ClubEventPost,
  Boarding,
  sequelize,
} from "../modules/index.js";
import logger from "../utils/logger.js";

/**
 * ─── DEFAULT BOOST CONFIG ──────────────────────────────────────────
 * These are the 6 engine parameters that control how a boost behaves.
 * Admins can customize these per package.
 */
const DEFAULT_BOOST_CONFIG = {
  feedPriority: 10,           // 1-10: lower = higher in feed. 1 = top.
  visibilityMultiplier: 1,    // 1-5: how many extra slots the post gets.
  highlightStyle: "none",     // "none" | "subtle" | "blue" | "gold"
  crossCategoryReach: false,  // true: post appears in ALL feed categories.
  analyticsAccess: false,     // true: business user can see boost analytics.
  autoRefreshHours: 0,        // 0 = off. 6/12/24 = post gets auto-bumped every X hours.
};

/**
 * ─── AUTO-GENERATE FEATURES TEXT FROM CONFIG ───────────────────────
 * Converts the boostConfig engine parameters into human-readable
 * feature strings for the package selection page.
 * This makes boostConfig the SINGLE SOURCE OF TRUTH.
 */
function generateFeaturesFromConfig(config, durationValue, durationUnit) {
  const features = [];

  // Feed Priority (only show if better than default)
  if (config.feedPriority && config.feedPriority < 10) {
    if (config.feedPriority === 1) {
      features.push("Always #1 in Feed");
    } else {
      features.push(`Priority #${config.feedPriority} Feed Placement`);
    }
  }

  // Visibility Multiplier (only show if > 1)
  if (config.visibilityMultiplier && config.visibilityMultiplier > 1) {
    features.push(`${config.visibilityMultiplier}x Visibility Boost`);
  }

  // Highlight Style (only show if not "none")
  if (config.highlightStyle && config.highlightStyle !== "none") {
    const styleLabels = {
      subtle: "Sponsored Label on Post",
      blue: "Blue Highlighted Card + Badge",
      gold: "\u26A1 Gold Premium Card Styling",
    };
    features.push(styleLabels[config.highlightStyle] || "Custom Card Styling");
  }

  // Cross-Category Reach
  if (config.crossCategoryReach) {
    features.push("Appears in All Category Feeds");
  }

  // Analytics Access
  if (config.analyticsAccess) {
    features.push("Boost Analytics Dashboard");
  }

  // Auto-Refresh (bumps post back to top periodically)
  if (config.autoRefreshHours && config.autoRefreshHours > 0) {
    features.push(`Auto-Refresh Every ${config.autoRefreshHours} Hours`);
  }

  // Duration (always add)
  if (durationValue && durationUnit) {
    features.push(`${durationValue} ${durationUnit} Promotion Period`);
  }

  return features;
}

/**
 * Boost Service
 *
 * Handles all business logic for boost packages, purchases, and logs.
 * ALL data comes from database — ZERO hardcoding.
 */
class BoostService {
  // ── ID Generators ────────────────────────────────────────────────────────

  async generatePackageId() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const id = `PKG-${date}-${random}`;

    const exists = await BoostPackage.findByPk(id);
    if (exists) return this.generatePackageId();
    return id;
  }

  generateTransactionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TXN-${timestamp}-${random}`;
  }

  generateLogId() {
    return `log-${Date.now()}`;
  }

  // ── Duration Helpers ─────────────────────────────────────────────────────

  /**
   * Calculate expiry date from purchase date based on package duration.
   */
  calculateExpiryDate(purchaseDate, durationValue, durationUnit) {
    const expiry = new Date(purchaseDate);
    switch (durationUnit) {
      case "Hours":
        expiry.setHours(expiry.getHours() + durationValue);
        break;
      case "Days":
        expiry.setDate(expiry.getDate() + durationValue);
        break;
      case "Weeks":
        expiry.setDate(expiry.getDate() + durationValue * 7);
        break;
      default:
        expiry.setDate(expiry.getDate() + durationValue);
    }
    return expiry;
  }

  // ── Package CRUD ─────────────────────────────────────────────────────────

  async getAllPackages(includeArchived = false) {
    const where = {};
    if (!includeArchived) {
      where.status = "live";
    }

    const packages = await BoostPackage.findAll({
      where,
      order: [["createdAt", "ASC"]],
    });

    return packages.map((pkg) => {
      const plain = pkg.toJSON();
      plain.price = Number(plain.price);
      plain.duration = `${plain.durationValue} ${plain.durationUnit}`;
      return plain;
    });
  }

  async getPackageById(id) {
    const pkg = await BoostPackage.findByPk(id);
    if (!pkg) {
      const error = new Error("Boost package not found");
      error.statusCode = 404;
      throw error;
    }

    const plain = pkg.toJSON();
    plain.price = Number(plain.price);
    plain.duration = `${plain.durationValue} ${plain.durationUnit}`;
    return plain;
  }

  async createPackage(data, adminId = null) {
    const {
      name,
      price,
      durationValue,
      durationUnit,
      description,
      badge,
      features,
      boostConfig,
    } = data;

    const roundedPrice = Math.round(Number(price) * 100) / 100;

    // Merge user-provided boostConfig with defaults
    const finalBoostConfig = { ...DEFAULT_BOOST_CONFIG, ...(boostConfig || {}) };

    // Duplicate check
    const existing = await BoostPackage.findOne({
      where: {
        name: name.trim(),
        price: roundedPrice,
        durationValue: Number(durationValue),
        durationUnit,
        status: "live",
      },
    });

    if (existing) {
      const error = new Error(
        `A live package with the name "${name}" and this price/duration already exists.`
      );
      error.statusCode = 409;
      throw error;
    }

    const id = await this.generatePackageId();
    const duration = `${durationValue} ${durationUnit}`;

    const pkg = await BoostPackage.create({
      id,
      name: name.trim(),
      price: roundedPrice,
      durationValue: Number(durationValue),
      durationUnit,
      description: description || null,
      badge: badge || "No Badge",
      features: generateFeaturesFromConfig(finalBoostConfig, Number(durationValue), durationUnit),
      boostConfig: finalBoostConfig,
      status: "live",
    });

    // Audit log
    await BoostLog.create({
      id: this.generateLogId(),
      type: "package_added",
      packageId: pkg.id,
      changedBy: adminId,
      title: `New package '${pkg.name}' created`,
      description: `Tier added with pricing: Rs. ${Number(
        pkg.price
      ).toLocaleString()} / ${duration}`,
      changes: {
        name: pkg.name,
        price: Number(pkg.price),
        durationValue: pkg.durationValue,
        durationUnit: pkg.durationUnit,
        badge: pkg.badge,
        features: pkg.features,
        boostConfig: finalBoostConfig,
      },
    });

    logger.info(`Boost package ${id} created: ${name}`);

    return {
      id: pkg.id,
      name: pkg.name,
      price: Number(pkg.price),
      durationValue: pkg.durationValue,
      durationUnit: pkg.durationUnit,
      duration,
      badge: pkg.badge,
      description: pkg.description,
      features: pkg.features,
      boostConfig: pkg.boostConfig,
      status: pkg.status,
      createdAt: pkg.createdAt,
    };
  }

  async updatePackage(id, data, adminId = null) {
    const pkg = await BoostPackage.findByPk(id);

    if (!pkg) {
      const error = new Error("Boost package not found");
      error.statusCode = 404;
      throw error;
    }

    if (pkg.status === "archived") {
      const error = new Error(
        "Cannot update an archived package. Restore it first."
      );
      error.statusCode = 400;
      throw error;
    }

    const { name, price, durationValue, durationUnit, badge, description, features, boostConfig } = data;

    const finalName = name !== undefined ? name.trim() : pkg.name;
    const finalPrice =
      price !== undefined
        ? Math.round(Number(price) * 100) / 100
        : Number(pkg.price);
    const finalDurationVal =
      durationValue !== undefined ? Number(durationValue) : pkg.durationValue;
    const finalDurationUnit =
      durationUnit !== undefined ? durationUnit : pkg.durationUnit;
    const finalBadge = badge !== undefined ? badge : pkg.badge;
    const finalDescription =
      description !== undefined ? description : pkg.description;
    const finalBoostConfig =
      boostConfig !== undefined
        ? { ...DEFAULT_BOOST_CONFIG, ...(boostConfig || {}) }
        : (pkg.boostConfig || DEFAULT_BOOST_CONFIG);

    // Auto-generate features from boostConfig (single source of truth)
    const finalFeatures = generateFeaturesFromConfig(
      finalBoostConfig,
      finalDurationVal,
      finalDurationUnit,
    );

    // No change detection
    const nothingChanged =
      finalName === pkg.name &&
      finalPrice === Number(pkg.price) &&
      finalDurationVal === pkg.durationValue &&
      finalDurationUnit === pkg.durationUnit &&
      finalBadge === pkg.badge &&
      finalDescription === pkg.description &&
      JSON.stringify(finalFeatures) === JSON.stringify(pkg.features) &&
      JSON.stringify(finalBoostConfig) === JSON.stringify(pkg.boostConfig || DEFAULT_BOOST_CONFIG);

    if (nothingChanged) {
      const plain = pkg.toJSON();
      plain.price = Number(plain.price);
      plain.duration = `${plain.durationValue} ${plain.durationUnit}`;
      return { noChange: true, package: plain };
    }

    // Duplicate check
    const duplicate = await BoostPackage.findOne({
      where: {
        name: finalName,
        price: finalPrice,
        durationValue: finalDurationVal,
        durationUnit: finalDurationUnit,
        status: "live",
        id: { [Op.ne]: id },
      },
    });

    if (duplicate) {
      const error = new Error(
        `Another live package with the name "${finalName}" and this price/duration already exists.`
      );
      error.statusCode = 409;
      throw error;
    }

    // Build changes diff for audit
    const changes = {};
    if (finalName !== pkg.name)
      changes.name = { old: pkg.name, new: finalName };
    if (finalPrice !== Number(pkg.price))
      changes.price = { old: Number(pkg.price), new: finalPrice };
    if (finalDurationVal !== pkg.durationValue)
      changes.durationValue = {
        old: pkg.durationValue,
        new: finalDurationVal,
      };
    if (finalDurationUnit !== pkg.durationUnit)
      changes.durationUnit = {
        old: pkg.durationUnit,
        new: finalDurationUnit,
      };
    if (finalBadge !== pkg.badge)
      changes.badge = { old: pkg.badge, new: finalBadge };

    // Apply updates
    pkg.name = finalName;
    pkg.price = finalPrice;
    pkg.durationValue = finalDurationVal;
    pkg.durationUnit = finalDurationUnit;
    pkg.badge = finalBadge;
    pkg.description = finalDescription;
    pkg.features = finalFeatures;
    pkg.boostConfig = finalBoostConfig;
    await pkg.save();

    await BoostLog.create({
      id: this.generateLogId(),
      type: "package_updated",
      packageId: pkg.id,
      changedBy: adminId,
      title: `Package '${pkg.name}' updated`,
      description: `Configured: Rs. ${Number(
        pkg.price
      ).toLocaleString()} / ${pkg.durationValue} ${pkg.durationUnit}`,
      changes,
    });

    logger.info(`Boost package ${id} updated. Name: ${pkg.name}`);

    return {
      noChange: false,
      package: {
        id: pkg.id,
        name: pkg.name,
        price: Number(pkg.price),
        durationValue: pkg.durationValue,
        durationUnit: pkg.durationUnit,
        duration: `${pkg.durationValue} ${pkg.durationUnit}`,
        badge: pkg.badge,
        description: pkg.description,
        features: pkg.features,
        boostConfig: pkg.boostConfig,
        status: pkg.status,
        updatedAt: pkg.updatedAt,
      },
    };
  }

  async deletePackage(id, adminId = null) {
    const pkg = await BoostPackage.findByPk(id);

    if (!pkg) {
      const error = new Error("Boost package not found");
      error.statusCode = 404;
      throw error;
    }

    if (pkg.status === "archived") {
      const error = new Error("Package is already archived");
      error.statusCode = 400;
      throw error;
    }

    pkg.status = "archived";
    await pkg.save();

    await BoostLog.create({
      id: this.generateLogId(),
      type: "package_deleted",
      packageId: pkg.id,
      changedBy: adminId,
      title: `Package '${pkg.name}' removed`,
      description:
        "Package tier has been decommissioned from active lists",
      changes: {
        name: pkg.name,
        price: Number(pkg.price),
        status: { old: "live", new: "archived" },
      },
    });

    logger.info(`Boost package ${id} archived. Name: ${pkg.name}`);

    const plain = pkg.toJSON();
    plain.price = Number(plain.price);
    plain.duration = `${plain.durationValue} ${plain.durationUnit}`;
    return plain;
  }

  // ── Purchase ─────────────────────────────────────────────────────────────

  async purchaseBoost(userId, packageId, postId = null, postType = null) {
    const transaction = await sequelize.transaction();
    try {
      // Validate package
      const pkg = await BoostPackage.findByPk(packageId);
      if (!pkg) {
        const error = new Error("Selected boost package not found.");
        error.statusCode = 404;
        throw error;
      }
      if (pkg.status !== "live") {
        const error = new Error("Selected package is no longer available.");
        error.statusCode = 400;
        throw error;
      }

      // Validate user
      const user = await User.findByPk(userId);
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }

      // Optional: validate post if provided
      if (postId) {
        // Try to find the post in the base table or specific table
        const post = await Post.findByPk(postId);
        if (!post) {
          const error = new Error("Post not found.");
          error.statusCode = 404;
          throw error;
        }
      }

      // Calculate dates
      const purchaseDate = new Date();
      const expiryDate = this.calculateExpiryDate(
        purchaseDate,
        pkg.durationValue,
        pkg.durationUnit
      );

      const transactionId = this.generateTransactionId();
      const amount = Number(pkg.price);

      const purchase = await BoostPurchase.create(
        {
          userId,
          businessId: null,
          packageId,
          postId: postId || null,
          purchaseDate: purchaseDate.toISOString(),
          expiryDate: expiryDate.toISOString(),
          status: "active",
          transactionId,
          amount,
        },
        { transaction }
      );

      // ── Mark the post as promoted in all relevant tables ──
      if (postId) {
        const updateData = { isPromoted: true };
        const where = { id: postId };
        
        // Update specific tables based on type if known, or try all if not
        if (postType === "normal") {
          await NormalPost.update(updateData, { where, transaction });
        } else if (postType === "club-product") {
          await ClubProductPost.update(updateData, { where, transaction });
        } else if (postType === "club-event") {
          await ClubEventPost.update(updateData, { where, transaction });
        } else if (postType === "boarding") {
          await Boarding.update(updateData, { where, transaction });
        } else {
          // If type unknown, update base and try all specific (matches expiry enforcement pattern)
          await Post.update(updateData, { where, transaction });
          await NormalPost.update(updateData, { where, transaction }).catch(() => {});
          await ClubProductPost.update(updateData, { where, transaction }).catch(() => {});
          await ClubEventPost.update(updateData, { where, transaction }).catch(() => {});
          await Boarding.update(updateData, { where, transaction }).catch(() => {});
        }
      }

      await transaction.commit();

      logger.info(
        `Boost purchased by user ${userId}: package ${packageId}, txn ${transactionId}`
      );

      return {
        purchaseId: purchase.id,
        transactionId,
        packageId,
        packageName: pkg.name,
        postId: postId || null,
        amount,
        purchaseDate: purchaseDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        status: "active",
        duration: `${pkg.durationValue} ${pkg.durationUnit}`,
        durationDays:
          pkg.durationUnit === "Hours"
            ? 1
            : pkg.durationUnit === "Days"
              ? pkg.durationValue
              : pkg.durationValue * 7,
      };
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback().catch(() => {});
      }
      throw error;
    }
  }

  // ── Active Boosts ────────────────────────────────────────────────────────

  async getUserActiveBoosts(userId) {
    const now = new Date();

    const purchases = await BoostPurchase.findAll({
      where: {
        userId,
        status: "active",
        expiryDate: { [Op.gt]: now },
      },
      include: [
        {
          model: BoostPackage,
          as: "package",
          attributes: [
            "id",
            "name",
            "price",
            "durationValue",
            "durationUnit",
            "badge",
            "features",
            "boostConfig",
          ],
        },
      ],
      order: [["purchaseDate", "DESC"]],
    });

    return purchases.map((p) => {
      const plain = p.toJSON();
      if (plain.package) {
        plain.package.price = Number(plain.package.price);
        plain.package.duration = `${plain.package.durationValue} ${plain.package.durationUnit}`;
      }
      plain.amount = Number(plain.amount);
      return plain;
    });
  }

  // ── Feed Boost Engine ───────────────────────────────────────────────────

  /**
   * Get ALL active boosts for the feed, keyed by postId.
   * Called by getFeed controller to inject boost metadata into each post.
   *
   * Returns a Map<postId, { boostConfig, packageName, expiryDate, ... }>
   */
  async getActiveBoostsForFeed() {
    const now = new Date();

    // First, auto-expire stale boosts
    await this.enforceExpiredBoosts();

    const activePurchases = await BoostPurchase.findAll({
      where: {
        status: "active",
        expiryDate: { [Op.gt]: now },
        postId: { [Op.ne]: null },
      },
      include: [
        {
          model: BoostPackage,
          as: "package",
          attributes: ["id", "name", "price", "badge", "boostConfig", "features"],
        },
      ],
    });

    // Build a map of postId → boostMeta
    const boostMap = new Map();

    for (const purchase of activePurchases) {
      const pkg = purchase.package;
      if (!pkg) continue;

      const config = pkg.boostConfig || DEFAULT_BOOST_CONFIG;

      boostMap.set(purchase.postId, {
        purchaseId: purchase.id,
        packageId: pkg.id,
        packageName: pkg.name,
        packageBadge: pkg.badge,
        packagePrice: Number(pkg.price),
        expiryDate: purchase.expiryDate,
        purchaseDate: purchase.purchaseDate,
        // The 6 engine parameters
        feedPriority: config.feedPriority || 10,
        visibilityMultiplier: config.visibilityMultiplier || 1,
        highlightStyle: config.highlightStyle || "none",
        crossCategoryReach: config.crossCategoryReach || false,
        analyticsAccess: config.analyticsAccess || false,
        autoRefreshHours: config.autoRefreshHours || 0,
      });
    }

    return boostMap;
  }

  // ── Expiry Enforcement ──────────────────────────────────────────────────

  /**
   * Find all BoostPurchases where expiryDate < NOW and status is still 'active',
   * set them to 'expired', and un-promote the linked posts.
   */
  async enforceExpiredBoosts() {
    const now = new Date();

    const expired = await BoostPurchase.findAll({
      where: {
        status: "active",
        expiryDate: { [Op.lte]: now },
      },
    });

    if (expired.length === 0) return;

    const postIds = expired.map((p) => p.postId).filter(Boolean);

    // Batch update purchases to expired
    await BoostPurchase.update(
      { status: "expired" },
      {
        where: {
          status: "active",
          expiryDate: { [Op.lte]: now },
        },
      }
    );

    // Un-promote posts that have NO other active boosts
    for (const postId of postIds) {
      const otherActive = await BoostPurchase.count({
        where: {
          postId,
          status: "active",
          expiryDate: { [Op.gt]: now },
        },
      });

      if (otherActive === 0) {
        // Try all post tables (polymorphic posts)
        await NormalPost.update({ isPromoted: false }, { where: { id: postId } }).catch(() => {});
        await ClubProductPost.update({ isPromoted: false }, { where: { id: postId } }).catch(() => {});
        await ClubEventPost.update({ isPromoted: false }, { where: { id: postId } }).catch(() => {});
        await Post.update({ isPromoted: false }, { where: { id: postId } }).catch(() => {});
      }
    }

    logger.info(`Expired ${expired.length} boost purchase(s) and un-promoted ${postIds.length} post(s)`);
  }

  // ── Logs ─────────────────────────────────────────────────────────────────

  async getBoostLogs(filters = {}) {
    const { page = 1, limit = 50, type } = filters;
    const where = {};
    if (type) where.type = type;

    const offset = (page - 1) * limit;

    const { count, rows } = await BoostLog.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const formattedLogs = rows.map((log) => {
      const date = new Date(log.createdAt);

      // Calculate relative time
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.round(diffMs / 60000);
      const diffHours = Math.round(diffMins / 60);
      const diffDays = Math.round(diffHours / 24);

      let relativeTime = "";
      if (diffMins < 5) relativeTime = "Just now";
      else if (diffMins < 60) relativeTime = `${diffMins} minutes ago`;
      else if (diffHours < 24) relativeTime = `${diffHours} hours ago`;
      else if (diffDays === 1) relativeTime = "Yesterday";
      else relativeTime = `${diffDays} days ago`;

      // Format absolute time
      const timeStr = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const displayTime = `${relativeTime} • ${timeStr}, ${dateStr}`;

      return {
        id: log.id,
        type: log.type,
        packageId: log.packageId,
        changedBy: log.changedBy,
        title: log.title,
        description: log.description,
        changes: log.changes,
        time: displayTime,
        createdAt: log.createdAt,
      };
    });

    return {
      logs: formattedLogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // ── Admin Dashboard Stats (DB-driven) ───────────────────────────────────

  async getAdminStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Active Packages count
    const activePackages = await BoostPackage.count({ where: { status: "live" } });

    // Revenue this month (sum of amount from purchases in last 30 days)
    const revenueThisMonth = await BoostPurchase.sum("amount", {
      where: { purchaseDate: { [Op.gte]: thirtyDaysAgo } },
    }) || 0;

    // Revenue last month (for comparison)
    const revenueLastMonth = await BoostPurchase.sum("amount", {
      where: {
        purchaseDate: { [Op.gte]: sixtyDaysAgo, [Op.lt]: thirtyDaysAgo },
      },
    }) || 0;

    const revenueChange = revenueLastMonth > 0
      ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100)
      : (revenueThisMonth > 0 ? 100 : 0);

    // Total Boosts (purchases in last 30 days)
    const totalBoosts30d = await BoostPurchase.count({
      where: { purchaseDate: { [Op.gte]: thirtyDaysAgo } },
    });

    const totalBoostsPrev = await BoostPurchase.count({
      where: {
        purchaseDate: { [Op.gte]: sixtyDaysAgo, [Op.lt]: thirtyDaysAgo },
      },
    });

    const boostsChange = totalBoostsPrev > 0
      ? Math.round(((totalBoosts30d - totalBoostsPrev) / totalBoostsPrev) * 100)
      : (totalBoosts30d > 0 ? 100 : 0);

    // Average Duration (from live packages)
    const livePkgs = await BoostPackage.findAll({
      where: { status: "live" },
      attributes: ["durationValue", "durationUnit"],
    });

    let avgDurationDays = 0;
    if (livePkgs.length > 0) {
      const totalDays = livePkgs.reduce((sum, pkg) => {
        const val = Number(pkg.durationValue) || 0;
        const unit = pkg.durationUnit;
        if (unit === "Hours") return sum + val / 24;
        if (unit === "Days") return sum + val;
        if (unit === "Weeks") return sum + val * 7;
        return sum + val;
      }, 0);
      avgDurationDays = Math.round((totalDays / livePkgs.length) * 10) / 10;
    }

    return {
      activePackages,
      monthlyRevenue: Math.round(revenueThisMonth),
      revenueChange,
      totalBoosts30d,
      boostsChange,
      avgDurationDays,
    };
  }
}

export default new BoostService();

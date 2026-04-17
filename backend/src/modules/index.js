/**
 * modules/index.js
 *
 * Central registry: imports all models, defines all associations,
 * and re-exports everything. Import this file once in server.js so
 * Sequelize registers all models before sync() is called.
 */

import sequelize from "../config/database.js";

// ── Models ────────────────────────────────────────────────────────────────────
import User from "./User.model.js";
import StudentProfile from "./StudentProfile.model.js";
import BusinessProfile from "./BusinessProfile.model.js";
import ClubProfile from "./ClubProfile.model.js";
import Post from "./Post.model.js";
import Comment from "./Comment.model.js";
import Boarding from "./Boarding.model.js";
import LostAndFound from "./LostAndFound.model.js";
import MarketplaceItem from "./MarketplaceItem.model.js";
import Semester from "./Semester.model.js";
import AcademicModule from "./AcademicModule.model.js";
import ModuleCategory from "./ModuleCategory.model.js";
import Material from "./Material.model.js";
import Report from "./Report.model.js";
import Order from "./Order.model.js";
import Review from "./Review.model.js";
import Conversation from "./Conversation.model.js";
import Message from "./Message.model.js";
import BoostPackage from "./BoostPackage.model.js";
import BoostCampaign from "./BoostCampaign.model.js";
import BoostInteraction from "./BoostInteraction.model.js";
import AdminLog from "./AdminLog.model.js";
import UserActivityLog from "./UserActivityLog.model.js";
import UserFollower from "./UserFollower.model.js";
import VerificationRequest from "./VerificationRequest.model.js";
import SavedItem from "./SavedItem.model.js";
import Wallet from "./Wallet.model.js";
import Transaction from "./Transaction.model.js";
import WithdrawalRequest from "./WithdrawalRequest.model.js";
import Notification from "./Notification.model.js";

// ── Associations ──────────────────────────────────────────────────────────────

// --- Profiles ---
User.hasOne(StudentProfile, {
  foreignKey: "userId",
  as: "studentProfile",
  onDelete: "CASCADE",
});
StudentProfile.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasOne(BusinessProfile, {
  foreignKey: "userId",
  as: "businessProfile",
  onDelete: "CASCADE",
});
BusinessProfile.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasOne(ClubProfile, {
  foreignKey: "userId",
  as: "clubProfile",
  onDelete: "CASCADE",
});
ClubProfile.belongsTo(User, { foreignKey: "userId", as: "user" });

// --- Activity Logs ---
User.hasMany(UserActivityLog, {
  foreignKey: "userId",
  as: "activityLogs",
  onDelete: "CASCADE",
});
UserActivityLog.belongsTo(User, { foreignKey: "userId", as: "user" });

// --- Following System ---
User.belongsToMany(User, {
  through: UserFollower,
  as: "Followers",
  foreignKey: "followingId",
  otherKey: "followerId",
});
User.belongsToMany(User, {
  through: UserFollower,
  as: "Following",
  foreignKey: "followerId",
  otherKey: "followingId",
});

// --- Posts & Comments ---
User.hasMany(Post, {
  foreignKey: "authorId",
  as: "posts",
  onDelete: "CASCADE",
});
Post.belongsTo(User, { foreignKey: "authorId", as: "author" });

Post.hasMany(Comment, {
  foreignKey: "postId",
  as: "comments",
  onDelete: "CASCADE",
});
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

User.hasMany(Comment, {
  foreignKey: "userId",
  as: "comments",
  onDelete: "CASCADE",
});
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });

// --- Boardings ---
User.hasMany(Boarding, {
  foreignKey: "hostId",
  as: "boardings",
  onDelete: "CASCADE",
});
Boarding.belongsTo(User, { foreignKey: "hostId", as: "host" });

// --- Lost & Found ---
User.hasMany(LostAndFound, {
  foreignKey: "userId",
  as: "lostAndFounds",
  onDelete: "CASCADE",
});
LostAndFound.belongsTo(User, { foreignKey: "userId", as: "user" });

// --- Marketplace ---
MarketplaceItem.belongsTo(User, { foreignKey: "sellerId", as: "seller" });
User.hasMany(MarketplaceItem, {
  foreignKey: "sellerId",
  as: "marketplaceItems",
  onDelete: "CASCADE",
});

MarketplaceItem.hasMany(Comment, {
  foreignKey: "itemId",
  as: "comments",
  onDelete: "CASCADE",
});
Comment.belongsTo(MarketplaceItem, { foreignKey: "itemId", as: "item" });

// --- Orders ---
Order.belongsTo(User, { foreignKey: "buyerId", as: "buyer" });
User.hasMany(Order, { foreignKey: "buyerId", as: "purchasedOrders" });

Order.belongsTo(User, { foreignKey: "sellerId", as: "seller" });
User.hasMany(Order, { foreignKey: "sellerId", as: "salesOrders" });

Order.belongsTo(MarketplaceItem, { foreignKey: "itemId", as: "item" });
MarketplaceItem.hasMany(Order, { foreignKey: "itemId", as: "orders" });

// --- Reviews ---
Review.belongsTo(User, { foreignKey: "reviewerId", as: "reviewer" });
User.hasMany(Review, { foreignKey: "reviewerId", as: "reviewsGiven" });

Review.belongsTo(User, { foreignKey: "targetId", as: "target" });
User.hasMany(Review, { foreignKey: "targetId", as: "reviewsReceived" });

// --- Chat System ---
Conversation.belongsTo(User, {
  foreignKey: "participantOneId",
  as: "participantOne",
});
Conversation.belongsTo(User, {
  foreignKey: "participantTwoId",
  as: "participantTwo",
});
User.hasMany(Conversation, {
  foreignKey: "participantOneId",
  as: "startedConversations",
});
User.hasMany(Conversation, {
  foreignKey: "participantTwoId",
  as: "receivedConversations",
});

Message.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
  onDelete: "CASCADE",
});
Conversation.hasMany(Message, { foreignKey: "conversationId", as: "messages" });

Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });
User.hasMany(Message, { foreignKey: "senderId", as: "sentMessages" });

// --- Advertising / Boosts ---
BoostCampaign.belongsTo(Post, {
  foreignKey: "postId",
  as: "post",
  onDelete: "CASCADE",
});
Post.hasOne(BoostCampaign, { foreignKey: "postId", as: "activeCampaign" });

BoostCampaign.belongsTo(BoostPackage, {
  foreignKey: "packageId",
  as: "package",
});
BoostPackage.hasMany(BoostCampaign, {
  foreignKey: "packageId",
  as: "campaigns",
});

BoostCampaign.hasMany(BoostInteraction, {
  foreignKey: "campaignId",
  as: "interactions",
  onDelete: "CASCADE",
});
BoostInteraction.belongsTo(BoostCampaign, {
  foreignKey: "campaignId",
  as: "campaign",
});

User.hasMany(BoostInteraction, {
  foreignKey: "userId",
  as: "adInteractions",
  onDelete: "CASCADE",
});
BoostInteraction.belongsTo(User, { foreignKey: "userId", as: "user" });

// --- Admin Logs ---
User.hasMany(AdminLog, {
  foreignKey: "adminId",
  as: "adminLogs",
  onDelete: "CASCADE",
});
AdminLog.belongsTo(User, { foreignKey: "adminId", as: "admin" });

// --- Academic Modules ---
Semester.hasMany(AcademicModule, {
  foreignKey: "semesterId",
  as: "modules",
  onDelete: "CASCADE",
});
AcademicModule.belongsTo(Semester, {
  foreignKey: "semesterId",
  as: "semester",
});

AcademicModule.hasMany(ModuleCategory, {
  foreignKey: "moduleId",
  as: "categories",
  onDelete: "CASCADE",
});
ModuleCategory.belongsTo(AcademicModule, {
  foreignKey: "moduleId",
  as: "module",
});

ModuleCategory.hasMany(Material, {
  foreignKey: "categoryId",
  as: "materials",
  onDelete: "CASCADE",
});
Material.belongsTo(ModuleCategory, {
  foreignKey: "categoryId",
  as: "category",
});

AcademicModule.hasMany(Material, {
  foreignKey: "moduleId",
  as: "allMaterials",
  onDelete: "CASCADE",
});
Material.belongsTo(AcademicModule, {
  foreignKey: "moduleId",
  as: "moduleForMaterial",
});

User.hasMany(Material, { foreignKey: "uploaderId", as: "uploadedMaterials" });
Material.belongsTo(User, { foreignKey: "uploaderId", as: "uploader" });

// --- Reports ---
User.hasMany(Report, {
  foreignKey: "reporterId",
  as: "reportsSubmitted",
  onDelete: "CASCADE",
});
Report.belongsTo(User, { foreignKey: "reporterId", as: "reporter" });

User.hasMany(Report, {
  foreignKey: "offenderId",
  as: "reportsReceived",
  onDelete: "CASCADE",
});
Report.belongsTo(User, { foreignKey: "offenderId", as: "offender" });

Post.hasMany(Report, {
  foreignKey: "postId",
  as: "reports",
  onDelete: "CASCADE",
});
Report.belongsTo(Post, { foreignKey: "postId", as: "post" });

Review.hasMany(Report, {
  foreignKey: "reviewId",
  as: "reports",
  onDelete: "CASCADE",
});
Report.belongsTo(Review, { foreignKey: "reviewId", as: "review" });

Comment.hasMany(Report, {
  foreignKey: "commentId",
  as: "reports",
  onDelete: "CASCADE",
});
Report.belongsTo(Comment, { foreignKey: "commentId", as: "comment" });

// --- Verifications ---
User.hasOne(VerificationRequest, {
  foreignKey: "userId",
  as: "verificationRequest",
  onDelete: "CASCADE",
});
VerificationRequest.belongsTo(User, { foreignKey: "userId", as: "user" });

// --- Saved Items ---
User.hasMany(SavedItem, {
  foreignKey: "userId",
  as: "savedItems",
  onDelete: "CASCADE",
});
SavedItem.belongsTo(User, { foreignKey: "userId", as: "user" });

Post.hasMany(SavedItem, {
  foreignKey: "postId",
  as: "savedByUsers",
  onDelete: "CASCADE",
});
SavedItem.belongsTo(Post, { foreignKey: "postId", as: "post" });

MarketplaceItem.hasMany(SavedItem, {
  foreignKey: "marketplaceItemId",
  as: "savedByUsers",
  onDelete: "CASCADE",
});
SavedItem.belongsTo(MarketplaceItem, {
  foreignKey: "marketplaceItemId",
  as: "marketplaceItem",
});

Boarding.hasMany(SavedItem, {
  foreignKey: "boardingId",
  as: "savedByUsers",
  onDelete: "CASCADE",
});
SavedItem.belongsTo(Boarding, { foreignKey: "boardingId", as: "boarding" });

Material.hasMany(SavedItem, {
  foreignKey: "materialId",
  as: "savedByUsers",
  onDelete: "CASCADE",
});
SavedItem.belongsTo(Material, { foreignKey: "materialId", as: "material" });

// --- Wallets & Transactions ---
User.hasOne(Wallet, {
  foreignKey: "userId",
  as: "wallet",
  onDelete: "CASCADE",
});
Wallet.belongsTo(User, { foreignKey: "userId", as: "user" });

Wallet.hasMany(Transaction, {
  foreignKey: "walletId",
  as: "transactions",
  onDelete: "CASCADE",
});
Transaction.belongsTo(Wallet, { foreignKey: "walletId", as: "wallet" });

Order.hasOne(Transaction, { foreignKey: "orderId", as: "transaction" });
Transaction.belongsTo(Order, { foreignKey: "orderId", as: "order" });

Wallet.hasMany(WithdrawalRequest, {
  foreignKey: "walletId",
  as: "withdrawalRequests",
  onDelete: "CASCADE",
});
WithdrawalRequest.belongsTo(Wallet, { foreignKey: "walletId", as: "wallet" });

// --- Notifications ---
User.hasMany(Notification, {
  foreignKey: "userId",
  as: "notifications",
  onDelete: "CASCADE",
});
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

// ── Exports ───────────────────────────────────────────────────────────────────
export {
  sequelize,
  User,
  StudentProfile,
  BusinessProfile,
  ClubProfile,
  Post,
  Comment,
  Boarding,
  LostAndFound,
  MarketplaceItem,
  Semester,
  AcademicModule,
  ModuleCategory,
  Material,
  Report,
  Order,
  Review,
  Conversation,
  Message,
  BoostPackage,
  BoostCampaign,
  BoostInteraction,
  AdminLog,
  UserActivityLog,
  UserFollower,
  VerificationRequest,
  SavedItem,
  Wallet,
  Transaction,
  WithdrawalRequest,
  Notification,
};

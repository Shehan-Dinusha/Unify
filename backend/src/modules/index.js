const db = require('../config/database');

// Import all models
const User = require('./User.model');
const StudentProfile = require('./StudentProfile.model');
const BusinessProfile = require('./BusinessProfile.model');
const ClubProfile = require('./ClubProfile.model');
const Post = require('./Post.model');
const Comment = require('./Comment.model');
const Boarding = require('./Boarding.model');
const LostAndFound = require('./LostAndFound.model');
const MarketplaceItem = require('./MarketplaceItem.model');
const Semester = require('./Semester.model');
const AcademicModule = require('./AcademicModule.model');
const ModuleCategory = require('./ModuleCategory.model');
const Material = require('./Material.model');
const Report = require('./Report.model');
const Order = require('./Order.model');
const Review = require('./Review.model');
const Conversation = require('./Conversation.model');
const Message = require('./Message.model');
const BoostPackage = require('./BoostPackage.model');
const BoostCampaign = require('./BoostCampaign.model');
const BoostInteraction = require('./BoostInteraction.model');
const AdminLog = require('./AdminLog.model');
const UserActivityLog = require('./UserActivityLog.model');
const UserFollower = require('./UserFollower.model');
const VerificationRequest = require('./VerificationRequest.model');
const SavedItem = require('./SavedItem.model');
const Wallet = require('./Wallet.model');
const Transaction = require('./Transaction.model');
const WithdrawalRequest = require('./WithdrawalRequest.model');
const Notification = require('./Notification.model');

// Define Relationships

// --- Profiles ---
User.hasOne(StudentProfile, { foreignKey: 'userId', as: 'studentProfile', onDelete: 'CASCADE' });
StudentProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(UserActivityLog, { foreignKey: 'userId', as: 'activityLogs', onDelete: 'CASCADE' });
UserActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(BusinessProfile, { foreignKey: 'userId', as: 'businessProfile', onDelete: 'CASCADE' });
BusinessProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(ClubProfile, { foreignKey: 'userId', as: 'clubProfile', onDelete: 'CASCADE' });
ClubProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// --- Following System ---
User.belongsToMany(User, { through: UserFollower, as: 'Followers', foreignKey: 'followingId', otherKey: 'followerId' });
User.belongsToMany(User, { through: UserFollower, as: 'Following', foreignKey: 'followerId', otherKey: 'followingId' });

// --- Posts & Comments ---
User.hasMany(Post, { foreignKey: 'authorId', as: 'posts', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// --- Boardings & Marketplace & LostFound ---

// --- Boardings & Marketplace & LostFound ---
User.hasMany(Boarding, { foreignKey: 'hostId', as: 'boardings', onDelete: 'CASCADE' });
Boarding.belongsTo(User, { foreignKey: 'hostId', as: 'host' });

User.hasMany(LostAndFound, { foreignKey: 'userId', as: 'lostAndFounds', onDelete: 'CASCADE' });
LostAndFound.belongsTo(User, { foreignKey: 'userId', as: 'user' });

MarketplaceItem.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

MarketplaceItem.hasMany(Comment, { foreignKey: 'itemId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(MarketplaceItem, { foreignKey: 'itemId', as: 'item' });

// --- Orders ---
Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
User.hasMany(Order, { foreignKey: 'buyerId', as: 'purchasedOrders' });

Order.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
User.hasMany(Order, { foreignKey: 'sellerId', as: 'salesOrders' });

Order.belongsTo(MarketplaceItem, { foreignKey: 'itemId', as: 'item' });
MarketplaceItem.hasMany(Order, { foreignKey: 'itemId', as: 'orders' });

// --- Reviews ---
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });
User.hasMany(Review, { foreignKey: 'reviewerId', as: 'reviewsGiven' });

Review.belongsTo(User, { foreignKey: 'targetId', as: 'target' }); // User could be a service owner or boarding host
User.hasMany(Review, { foreignKey: 'targetId', as: 'reviewsReceived' });

// --- Chat System ---
Conversation.belongsTo(User, { foreignKey: 'participantOneId', as: 'participantOne' });
Conversation.belongsTo(User, { foreignKey: 'participantTwoId', as: 'participantTwo' });
User.hasMany(Conversation, { foreignKey: 'participantOneId', as: 'startedConversations' });
User.hasMany(Conversation, { foreignKey: 'participantTwoId', as: 'receivedConversations' });

Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation', onDelete: 'CASCADE' });
Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });

Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });

// --- Advertising/Boosts ---
BoostCampaign.belongsTo(Post, { foreignKey: 'postId', as: 'post', onDelete: 'CASCADE' });
Post.hasOne(BoostCampaign, { foreignKey: 'postId', as: 'activeCampaign' });

BoostCampaign.belongsTo(BoostPackage, { foreignKey: 'packageId', as: 'package' });
BoostPackage.hasMany(BoostCampaign, { foreignKey: 'packageId', as: 'campaigns' });

BoostCampaign.hasMany(BoostInteraction, { foreignKey: 'campaignId', as: 'interactions', onDelete: 'CASCADE' });
BoostInteraction.belongsTo(BoostCampaign, { foreignKey: 'campaignId', as: 'campaign' });

User.hasMany(BoostInteraction, { foreignKey: 'userId', as: 'adInteractions', onDelete: 'CASCADE' });
BoostInteraction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// --- Admin Logs ---
User.hasMany(AdminLog, { foreignKey: 'adminId', as: 'adminLogs', onDelete: 'CASCADE' });
AdminLog.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });

// --- Academic Modules ---
Semester.hasMany(AcademicModule, { foreignKey: 'semesterId', as: 'modules', onDelete: 'CASCADE' });
AcademicModule.belongsTo(Semester, { foreignKey: 'semesterId', as: 'semester' });

AcademicModule.hasMany(ModuleCategory, { foreignKey: 'moduleId', as: 'categories', onDelete: 'CASCADE' });
ModuleCategory.belongsTo(AcademicModule, { foreignKey: 'moduleId', as: 'module' });

ModuleCategory.hasMany(Material, { foreignKey: 'categoryId', as: 'materials', onDelete: 'CASCADE' });
Material.belongsTo(ModuleCategory, { foreignKey: 'categoryId', as: 'category' });

AcademicModule.hasMany(Material, { foreignKey: 'moduleId', as: 'allMaterials', onDelete: 'CASCADE' });
Material.belongsTo(AcademicModule, { foreignKey: 'moduleId', as: 'moduleForMaterial' });

User.hasMany(Material, { foreignKey: 'uploaderId', as: 'uploadedMaterials' });
Material.belongsTo(User, { foreignKey: 'uploaderId', as: 'uploader' });

// --- Reports ---
User.hasMany(Report, { foreignKey: 'reporterId', as: 'reportsSubmitted', onDelete: 'CASCADE' });
Report.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });

User.hasMany(Report, { foreignKey: 'offenderId', as: 'reportsReceived', onDelete: 'CASCADE' });
Report.belongsTo(User, { foreignKey: 'offenderId', as: 'offender' });

Post.hasMany(Report, { foreignKey: 'postId', as: 'reports', onDelete: 'CASCADE' });
Report.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

Review.hasMany(Report, { foreignKey: 'reviewId', as: 'reports', onDelete: 'CASCADE' });
Report.belongsTo(Review, { foreignKey: 'reviewId', as: 'review' });

Comment.hasMany(Report, { foreignKey: 'commentId', as: 'reports', onDelete: 'CASCADE' });
Report.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });

// --- Verifications ---
User.hasMany(VerificationRequest, { foreignKey: 'userId', as: 'verificationRequests', onDelete: 'CASCADE' });
VerificationRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// --- Saved Items ---
User.hasMany(SavedItem, { foreignKey: 'userId', as: 'savedItems', onDelete: 'CASCADE' });
SavedItem.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Post.hasMany(SavedItem, { foreignKey: 'postId', as: 'savedByUsers', onDelete: 'CASCADE' });
SavedItem.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

MarketplaceItem.hasMany(SavedItem, { foreignKey: 'marketplaceItemId', as: 'savedByUsers', onDelete: 'CASCADE' });
SavedItem.belongsTo(MarketplaceItem, { foreignKey: 'marketplaceItemId', as: 'marketplaceItem' });

Boarding.hasMany(SavedItem, { foreignKey: 'boardingId', as: 'savedByUsers', onDelete: 'CASCADE' });
SavedItem.belongsTo(Boarding, { foreignKey: 'boardingId', as: 'boarding' });

Material.hasMany(SavedItem, { foreignKey: 'materialId', as: 'savedByUsers', onDelete: 'CASCADE' });
SavedItem.belongsTo(Material, { foreignKey: 'materialId', as: 'material' });

// --- Wallets & Transactions ---
User.hasOne(Wallet, { foreignKey: 'userId', as: 'wallet', onDelete: 'CASCADE' });
Wallet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Wallet.hasMany(Transaction, { foreignKey: 'walletId', as: 'transactions', onDelete: 'CASCADE' });
Transaction.belongsTo(Wallet, { foreignKey: 'walletId', as: 'wallet' });

Order.hasOne(Transaction, { foreignKey: 'orderId', as: 'transaction' });
Transaction.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Wallet.hasMany(WithdrawalRequest, { foreignKey: 'walletId', as: 'withdrawalRequests', onDelete: 'CASCADE' });
WithdrawalRequest.belongsTo(Wallet, { foreignKey: 'walletId', as: 'wallet' });

// --- Notifications ---
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  db,
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

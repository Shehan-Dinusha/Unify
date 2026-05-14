/** Auto-generated migration: creates all 48 tables */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(100), allowNull: true },
      email: { type: Sequelize.STRING(255), allowNull: true, unique: true },
      phone: { type: Sequelize.STRING(20), allowNull: true, unique: true },
      passwordHash: { type: Sequelize.STRING(255), allowNull: false },
      role: { type: Sequelize.ENUM("Student", "Business", "Club", "Admin"), allowNull: false },
      avatar: { type: Sequelize.STRING(255), allowNull: true },
      status: { type: Sequelize.ENUM("Active", "Suspended"), allowNull: false, defaultValue: "Active" },
      isOnline: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      isVerified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      refreshToken: { type: Sequelize.TEXT, allowNull: true },
      lastActive: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("business_profiles", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, unique: true, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      displayName: { type: Sequelize.STRING(150), allowNull: false },
      businessName: { type: Sequelize.STRING(150), allowNull: true },
      category: { type: Sequelize.ENUM("BOARDING", "FOOD", "SELF_EMPLOYED"), allowNull: false },
      about: { type: Sequelize.TEXT, allowNull: true },
      serviceType: { type: Sequelize.STRING(150), allowNull: true },
      addresses: { type: Sequelize.JSON, allowNull: true },
      ownerFirstName: { type: Sequelize.STRING(100), allowNull: true },
      ownerLastName: { type: Sequelize.STRING(100), allowNull: true },
      nic: { type: Sequelize.STRING(50), allowNull: true },
      dob: { type: Sequelize.DATE, allowNull: true },
      gender: { type: Sequelize.ENUM("Male", "Female", "Other"), allowNull: true },
      averageRating: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
      adminNotes: { type: Sequelize.JSON, allowNull: true, defaultValue: [] },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("club_profiles", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, unique: true, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      clubName: { type: Sequelize.STRING(150), allowNull: false },
      about: { type: Sequelize.TEXT, allowNull: true },
      email: { type: Sequelize.STRING(255), allowNull: true },
      logo: { type: Sequelize.TEXT, allowNull: true },
      coverImage: { type: Sequelize.TEXT, allowNull: true },
      stripeAccountId: { type: Sequelize.STRING(255), allowNull: true, unique: true },
      isVerified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("posts", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      authorId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      title: { type: Sequelize.STRING(255), allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      images: { type: Sequelize.JSON, allowNull: true },
      location: { type: Sequelize.STRING(255), allowNull: true },
      type: { type: Sequelize.ENUM("General", "Club", "Advertisement", "Marketplace", "LostFound", "Event", "Business", "Service"), allowNull: false, defaultValue: "General" },
      eventDate: { type: Sequelize.DATE, allowNull: true },
      options: { type: Sequelize.JSON, allowNull: true },
      isPromoted: { type: Sequelize.BOOLEAN, defaultValue: false },
      likesCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("club_product_posts", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      authorId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      name: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      images: { type: Sequelize.JSON, allowNull: true },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      category: { type: Sequelize.STRING(255), allowNull: true },
      enableSizes: { type: Sequelize.BOOLEAN, defaultValue: false },
      sizes: { type: Sequelize.JSON, allowNull: true },
      colors: { type: Sequelize.JSON, allowNull: true },
      deadline: { type: Sequelize.DATE, allowNull: true },
      pickupNote: { type: Sequelize.STRING(255), allowNull: true },
      isPromoted: { type: Sequelize.BOOLEAN, defaultValue: false },
      isVisible: { type: Sequelize.BOOLEAN, defaultValue: true },
      likesCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("club_event_posts", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      authorId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      name: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      coverImage: { type: Sequelize.JSON, allowNull: true },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      time: { type: Sequelize.STRING(50), allowNull: true },
      location: { type: Sequelize.STRING(255), allowNull: true },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
      tiers: { type: Sequelize.JSON, allowNull: true },
      isPromoted: { type: Sequelize.BOOLEAN, defaultValue: false },
      isVisible: { type: Sequelize.BOOLEAN, defaultValue: true },
      likesCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("normal_posts", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      authorId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      description: { type: Sequelize.TEXT, allowNull: true },
      images: { type: Sequelize.JSON, allowNull: true },
      isPromoted: { type: Sequelize.BOOLEAN, defaultValue: false },
      likesCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      category: { type: Sequelize.ENUM("CLUB", "FOOD", "SELF_EMPLOYED"), allowNull: false, defaultValue: "CLUB" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("post_likes", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      postId: { type: Sequelize.INTEGER, allowNull: false },
      postType: { type: Sequelize.ENUM("normal", "club-product", "club-event", "boarding", "food-cafe", "service"), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("boardings", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      hostId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      title: { type: Sequelize.STRING(100), allowNull: true },
      location: { type: Sequelize.STRING(255), allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      price: { type: Sequelize.STRING(255), allowNull: true },
      capacity: { type: Sequelize.INTEGER, allowNull: true },
      slots: { type: Sequelize.INTEGER, allowNull: true },
      phone: { type: Sequelize.STRING(20), allowNull: true },
      gender: { type: Sequelize.ENUM("Male Only", "Female Only", "Any"), allowNull: true, defaultValue: "Any" },
      roomType: { type: Sequelize.STRING(100), allowNull: true },
      amenities: { type: Sequelize.JSON, allowNull: true },
      images: { type: Sequelize.JSON, allowNull: true },
      latitude: { type: Sequelize.DECIMAL(10, 8), allowNull: true },
      longitude: { type: Sequelize.DECIMAL(11, 8), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("lost_and_founds", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      type: { type: Sequelize.ENUM("Lost", "Found"), allowNull: false },
      title: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      location: { type: Sequelize.STRING(255), allowNull: true },
      date: { type: Sequelize.STRING(255), allowNull: true },
      timeOfDay: { type: Sequelize.STRING(255), allowNull: true },
      images: { type: Sequelize.JSON, allowNull: true },
      status: { type: Sequelize.ENUM("Active", "Resolved"), allowNull: false, defaultValue: "Active" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("marketplace_items", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      sellerId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "NO ACTION", onUpdate: "CASCADE" },
      title: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      price: { type: Sequelize.STRING(255), allowNull: true },
      category: { type: Sequelize.STRING(100), allowNull: true },
      images: { type: Sequelize.JSON, allowNull: true },
      options: { type: Sequelize.JSON, allowNull: true },
      likesCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("comments", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      postId: { type: Sequelize.INTEGER, allowNull: true },
      postType: { type: Sequelize.ENUM("normal", "club-product", "club-event", "boarding", "food-cafe", "service"), allowNull: true },
      itemId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "marketplace_items", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      content: { type: Sequelize.TEXT, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("semesters", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("academic_modules", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      semesterId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "semesters", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      code: { type: Sequelize.STRING(50), allowNull: false },
      name: { type: Sequelize.STRING(100), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("module_categories", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      moduleId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "academic_modules", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      title: { type: Sequelize.STRING(100), allowNull: false },
      iconName: { type: Sequelize.STRING(100), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("materials", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      moduleId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "academic_modules", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      uploaderId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      categoryId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "module_categories", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      name: { type: Sequelize.STRING(100), allowNull: false },
      fileType: { type: Sequelize.STRING(100), allowNull: true },
      fileSize: { type: Sequelize.STRING(255), allowNull: true },
      url: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("orders", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      orderId: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      buyerId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "NO ACTION", onUpdate: "CASCADE" },
      sellerId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "NO ACTION", onUpdate: "CASCADE" },
      itemId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "club_product_posts", key: "id" }, onDelete: "SET NULL", onUpdate: "CASCADE" },
      status: { type: Sequelize.ENUM("PENDING", "IN PROGRESS", "COMPLETED", "CANCELLED", "Order Placed", "Seller Confirmed", "Ready for Pickup", "Order Completed"), defaultValue: "PENDING" },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      qty: { type: Sequelize.INTEGER, defaultValue: 1 },
      subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      platformFee: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      taxes: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      total: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      paymentMethod: { type: Sequelize.STRING(255), allowNull: true },
      pickupLocation: { type: Sequelize.STRING(255), allowNull: true },
      pickupRoom: { type: Sequelize.STRING(255), allowNull: true },
      pickupTime: { type: Sequelize.STRING(255), allowNull: true },
      color: { type: Sequelize.STRING(255), allowNull: true },
      colorHex: { type: Sequelize.STRING(255), allowNull: true },
      size: { type: Sequelize.STRING(255), allowNull: true },
      timeline: { type: Sequelize.JSON, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("reviews", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      reviewerId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "NO ACTION", onUpdate: "CASCADE" },
      targetId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "NO ACTION", onUpdate: "CASCADE" },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      helpfulCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      notHelpfulCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      isAnonymous: { type: Sequelize.BOOLEAN, defaultValue: false },
      isLikedByOwner: { type: Sequelize.BOOLEAN, defaultValue: false },
      ownerReply: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("reports", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      reporterId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      offenderId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      postId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "posts", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      reviewId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "reviews", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      commentId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "comments", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      type: { type: Sequelize.STRING(100), allowNull: false },
      title: { type: Sequelize.STRING(100), allowNull: true },
      category: { type: Sequelize.STRING(100), allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: false },
      evidence: { type: Sequelize.JSON, allowNull: true },
      status: { type: Sequelize.ENUM("Pending", "Pending Review", "In Review", "In Progress", "Resolved", "Dismissed", "Withdrawn", "Disabled"), allowNull: false, defaultValue: "Pending" },
      priority: { type: Sequelize.ENUM("Low", "Medium", "High"), allowNull: false, defaultValue: "Low" },
      notes: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("review_feedbacks", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      reviewId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "reviews", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      isHelpful: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("conversations", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      participantOneId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "NO ACTION", onUpdate: "CASCADE" },
      participantTwoId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "NO ACTION", onUpdate: "CASCADE" },
      lastMessageAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      lastMessageText: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.ENUM("seen", "delivered"), defaultValue: "delivered" },
      deletedByParticipantOne: { type: Sequelize.BOOLEAN, defaultValue: false },
      deletedByParticipantTwo: { type: Sequelize.BOOLEAN, defaultValue: false },
      participantOneClearedAt: { type: Sequelize.DATE, allowNull: true },
      participantTwoClearedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("messages", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      conversationId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "conversations", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      senderId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "NO ACTION", onUpdate: "CASCADE" },
      text: { type: Sequelize.TEXT, allowNull: true },
      attachments: { type: Sequelize.JSON, allowNull: true },
      isRead: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("boost_packages", {
      id: { type: Sequelize.STRING(255), primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      durationValue: { type: Sequelize.INTEGER, allowNull: false },
      durationUnit: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      badge: { type: Sequelize.STRING(255), allowNull: true },
      features: { type: Sequelize.JSON, allowNull: true },
      boostConfig: { type: Sequelize.JSON, allowNull: true, defaultValue: {"feedPriority":10,"visibilityMultiplier":1,"highlightStyle":"none","crossCategoryReach":false,"analyticsLevel":"none"} },
      status: { type: Sequelize.ENUM("live", "archived"), allowNull: false, defaultValue: "live" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("boost_campaigns", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      campaignId: { type: Sequelize.STRING(50), allowNull: false },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      postId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "posts", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      packageId: { type: Sequelize.STRING(255), allowNull: false, references: { model: "boost_packages", key: "id" }, onDelete: "NO ACTION", onUpdate: "CASCADE" },
      name: { type: Sequelize.STRING(255), allowNull: true },
      postTitle: { type: Sequelize.STRING(255), allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      image: { type: Sequelize.STRING(500), allowNull: true },
      status: { type: Sequelize.ENUM("Pending", "Active", "Paused", "Completed", "Cancelled"), allowNull: false, defaultValue: "Pending" },
      budget: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      dailyRate: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      durationDays: { type: Sequelize.INTEGER, allowNull: false },
      estReach: { type: Sequelize.STRING(255), allowNull: true },
      placement: { type: Sequelize.STRING(255), allowNull: true },
      subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      tax: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      total: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      startDate: { type: Sequelize.DATE, allowNull: true },
      endDate: { type: Sequelize.DATE, allowNull: true },
      impressions: { type: Sequelize.INTEGER, defaultValue: 0 },
      clicks: { type: Sequelize.INTEGER, defaultValue: 0 },
      organicReach: { type: Sequelize.INTEGER, defaultValue: 0 },
      salesAttributed: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      paymentStatus: { type: Sequelize.ENUM("pending", "completed", "failed", "refunded"), allowNull: false, defaultValue: "pending" },
      stripeSessionId: { type: Sequelize.STRING(255), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("boost_interactions", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      campaignId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "boost_campaigns", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      action: { type: Sequelize.STRING(255), allowNull: false },
      content: { type: Sequelize.STRING(500), allowNull: true },
      impact: { type: Sequelize.STRING(255), allowNull: true },
      date: { type: Sequelize.STRING(255), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("boost_logs", {
      id: { type: Sequelize.STRING(255), primaryKey: true },
      type: { type: Sequelize.STRING(50), allowNull: false },
      packageId: { type: Sequelize.STRING(255), allowNull: true },
      changedBy: { type: Sequelize.INTEGER, allowNull: true },
      title: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      changes: { type: Sequelize.JSON, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("boost_purchases", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      businessId: { type: Sequelize.INTEGER, allowNull: true },
      packageId: { type: Sequelize.STRING(255), allowNull: false, references: { model: "boost_packages", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      postId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "posts", key: "id" }, onDelete: "CASCADE" },
      purchaseDate: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      expiryDate: { type: Sequelize.DATE, allowNull: false },
      status: { type: Sequelize.ENUM("active", "expired", "used"), allowNull: false, defaultValue: "active" },
      transactionId: { type: Sequelize.STRING(100), allowNull: false },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("admin_logs", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      adminId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      type: { type: Sequelize.STRING(100), allowNull: false },
      title: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      targetUserId: { type: Sequelize.INTEGER, allowNull: true },
      referenceId: { type: Sequelize.INTEGER, allowNull: true },
      severity: { type: Sequelize.ENUM("Low", "Medium", "High", "Critical"), allowNull: true },
      caseRef: { type: Sequelize.STRING(255), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("user_activity_logs", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      icon: { type: Sequelize.STRING(255), allowNull: true },
      iconColor: { type: Sequelize.STRING(255), allowNull: true },
      title: { type: Sequelize.STRING(100), allowNull: false },
      type: { type: Sequelize.STRING(100), allowNull: true },
      ip: { type: Sequelize.STRING(255), allowNull: true },
      device: { type: Sequelize.STRING(255), allowNull: true },
      detail: { type: Sequelize.STRING(255), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("user_followers", {
      followerId: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      followingId: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("verification_requests", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      requestedRole: { type: Sequelize.STRING(50), allowNull: false },
      documentUrl: { type: Sequelize.TEXT, allowNull: true },
      documentMetadata: { type: Sequelize.JSON, allowNull: true },
      status: { type: Sequelize.ENUM("PENDING", "APPROVED", "DECLINED"), defaultValue: "PENDING" },
      adminMessage: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      deletedAt: { type: Sequelize.DATE }
    }, { paranoid: true });

    await queryInterface.createTable("saved_items", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      postId: { type: Sequelize.INTEGER, allowNull: true },
      postType: { type: Sequelize.STRING(100), allowNull: true },
      marketplaceItemId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "marketplace_items", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      boardingId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "boardings", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      materialId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "materials", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("wallets", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, unique: true, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      balance: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      pendingClearance: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      lifetimeEarnings: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      currency: { type: Sequelize.STRING(3), defaultValue: "LKR" },
      stripeCustomerId: { type: Sequelize.STRING(255), allowNull: true },
      stripeAccountId: { type: Sequelize.STRING(255), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("withdrawal_requests", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      walletId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "wallets", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      serviceFee: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      totalDeducted: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      bankAccountDetails: { type: Sequelize.JSON, allowNull: false },
      status: { type: Sequelize.ENUM("PENDING", "PROCESSED", "FAILED"), defaultValue: "PENDING" },
      stripePayoutId: { type: Sequelize.STRING(255), allowNull: true },
      currency: { type: Sequelize.STRING(3), defaultValue: "LKR" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("notifications", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      actorId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "users", key: "id" }, onDelete: "SET NULL", onUpdate: "CASCADE" },
      type: { type: Sequelize.ENUM("Reply", "Like", "Match", "Verification", "General"), allowNull: false, defaultValue: "General" },
      title: { type: Sequelize.STRING(255), allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: true },
      isUnread: { type: Sequelize.BOOLEAN, defaultValue: true },
      referenceId: { type: Sequelize.INTEGER, allowNull: true },
      referenceType: { type: Sequelize.STRING(100), allowNull: true },
      dedupeKey: { type: Sequelize.STRING(255), allowNull: true, unique: true },
      image: { type: Sequelize.STRING(500), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("event_bookings", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      bookingId: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      eventId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "club_event_posts", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      tierId: { type: Sequelize.STRING(100), allowNull: true },
      status: { type: Sequelize.ENUM("PENDING", "CONFIRMED", "ATTENDED", "CANCELLED"), defaultValue: "PENDING" },
      paymentStatus: { type: Sequelize.ENUM("PAID", "UNPAID"), defaultValue: "UNPAID" },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      qty: { type: Sequelize.INTEGER, defaultValue: 1 },
      total: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      qrCode: { type: Sequelize.STRING(255), allowNull: true },
      timeline: { type: Sequelize.JSON, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("transactions", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      walletId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "wallets", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      orderId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "orders", key: "id" }, onDelete: "SET NULL", onUpdate: "CASCADE" },
      bookingId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "event_bookings", key: "id" }, onDelete: "SET NULL", onUpdate: "CASCADE" },
      type: { type: Sequelize.ENUM("CREDIT", "DEBIT", "WITHDRAWAL", "REFUND", "PLATFORM_FEE"), allowNull: false },
      category: { type: Sequelize.STRING(100), allowNull: false, defaultValue: "General" },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      currency: { type: Sequelize.STRING(3), allowNull: false, defaultValue: "LKR" },
      tax: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      platformFee: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      netAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      status: { type: Sequelize.ENUM("PENDING", "PROCESSED", "COMPLETED", "FAILED", "REFUNDED"), defaultValue: "PENDING" },
      description: { type: Sequelize.STRING(255), allowNull: true },
      stripePaymentIntentId: { type: Sequelize.STRING(255), allowNull: true },
      stripeChargeId: { type: Sequelize.STRING(255), allowNull: true },
      stripeTransferId: { type: Sequelize.STRING(255), allowNull: true },
      metadata: { type: Sequelize.JSON, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("student_reports", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      reportId: { type: Sequelize.STRING(20), allowNull: false },
      studentId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      reportType: { type: Sequelize.ENUM("post", "comment", "user"), allowNull: false },
      category: { type: Sequelize.ENUM("inappropriate", "spam", "harassment", "misinformation", "other"), allowNull: false },
      title: { type: Sequelize.STRING(255), allowNull: false },
      additionalDetails: { type: Sequelize.TEXT, allowNull: true },
      evidenceFiles: { type: Sequelize.JSON, allowNull: true },
      evidenceUrl: { type: Sequelize.STRING(500), allowNull: true },
      reportedEntityId: { type: Sequelize.STRING(100), allowNull: false },
      status: { type: Sequelize.ENUM("Pending Review", "In Progress", "Resolved", "Withdrawn", "Dismissed"), allowNull: false, defaultValue: "Pending Review" },
      priority: { type: Sequelize.ENUM("Low", "Medium", "High", "Critical"), allowNull: false, defaultValue: "Medium" },
      adminNotes: { type: Sequelize.TEXT, allowNull: true },
      withdrawnAt: { type: Sequelize.DATE, allowNull: true },
      withdrawalReason: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      deletedAt: { type: Sequelize.DATE }
    }, { paranoid: true });

    await queryInterface.createTable("user_suspensions", {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      caseReference: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      reason: { type: Sequelize.TEXT, allowNull: false },
      reasonTag: { type: Sequelize.ENUM("ToS Violation", "Payment Failure", "Suspicious Activity", "Harassment"), allowNull: false },
      severity: { type: Sequelize.ENUM("Critical", "High", "Medium", "Low"), allowNull: false },
      effectiveDate: { type: Sequelize.DATE, allowNull: false },
      suspensionDate: { type: Sequelize.DATE, allowNull: false },
      suspensionTime: { type: Sequelize.STRING(15), allowNull: false },
      adminNotes: { type: Sequelize.TEXT, allowNull: true },
      adminAction: { type: Sequelize.STRING(255), allowNull: true },
      identityVerificationComplete: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      securityAuditPassed: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      status: { type: Sequelize.ENUM("ACTIVE", "PENDING_APPEAL", "REACTIVATED"), allowNull: false, defaultValue: "ACTIVE" },
      reactivationDate: { type: Sequelize.DATE, allowNull: true },
      reactivationNotes: { type: Sequelize.TEXT, allowNull: true },
      reactivatedBy: { type: Sequelize.INTEGER, allowNull: true, references: { model: "users", key: "id" }, onDelete: "SET NULL", onUpdate: "CASCADE" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("user_suspension_histories", {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      suspensionId: { type: Sequelize.UUID, allowNull: false, references: { model: "user_suspensions", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      action: { type: Sequelize.STRING(255), allowNull: false },
      performedBy: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      timestamp: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    }, { timestamps: false });

    await queryInterface.createTable("universities", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("faculties", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      universityId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "universities", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      name: { type: Sequelize.STRING(255), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("degrees", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      facultyId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "faculties", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      name: { type: Sequelize.STRING(255), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("batches", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(50), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("student_profiles", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, unique: true, references: { model: "users", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      registrationNumber: { type: Sequelize.STRING(50), allowNull: true },
      universityId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "universities", key: "id" }, onDelete: "SET NULL", onUpdate: "CASCADE" },
      facultyId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "faculties", key: "id" }, onDelete: "SET NULL", onUpdate: "CASCADE" },
      degreeId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "degrees", key: "id" }, onDelete: "SET NULL", onUpdate: "CASCADE" },
      batchId: { type: Sequelize.INTEGER, allowNull: true, references: { model: "batches", key: "id" }, onDelete: "SET NULL", onUpdate: "CASCADE" },
      firstName: { type: Sequelize.STRING(100), allowNull: true },
      lastName: { type: Sequelize.STRING(100), allowNull: true },
      gender: { type: Sequelize.ENUM("Male", "Female", "Other"), allowNull: true },
      dateOfBirth: { type: Sequelize.DATE, allowNull: true },
      addresses: { type: Sequelize.JSON, allowNull: true },
      isBatchRep: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      joinDate: { type: Sequelize.DATE, allowNull: true },
      reputationScore: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 500 },
      tier: { type: Sequelize.STRING(50), allowNull: false, defaultValue: "Standard" },
      adminNotes: { type: Sequelize.JSON, allowNull: true, defaultValue: [] },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("semester_visibilities", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      degreeId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "degrees", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      semesterId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "semesters", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      batchId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "batches", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      isVisible: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("otps", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: Sequelize.STRING(255), allowNull: true },
      phone: { type: Sequelize.STRING(20), allowNull: true },
      code: { type: Sequelize.STRING(6), allowNull: false },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      isUsed: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      type: { type: Sequelize.ENUM("REGISTRATION", "PASSWORD_RESET"), allowNull: false, defaultValue: "REGISTRATION" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable("degree_academic_modules", {
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      degreeId: { type: Sequelize.INTEGER, primaryKey: true, references: { model: "degrees", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      moduleId: { type: Sequelize.INTEGER, primaryKey: true, references: { model: "academic_modules", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("degree_academic_modules");
    await queryInterface.dropTable("otps");
    await queryInterface.dropTable("semester_visibilities");
    await queryInterface.dropTable("student_profiles");
    await queryInterface.dropTable("batches");
    await queryInterface.dropTable("degrees");
    await queryInterface.dropTable("faculties");
    await queryInterface.dropTable("universities");
    await queryInterface.dropTable("user_suspension_histories");
    await queryInterface.dropTable("user_suspensions");
    await queryInterface.dropTable("student_reports");
    await queryInterface.dropTable("transactions");
    await queryInterface.dropTable("event_bookings");
    await queryInterface.dropTable("notifications");
    await queryInterface.dropTable("withdrawal_requests");
    await queryInterface.dropTable("wallets");
    await queryInterface.dropTable("saved_items");
    await queryInterface.dropTable("verification_requests");
    await queryInterface.dropTable("user_followers");
    await queryInterface.dropTable("user_activity_logs");
    await queryInterface.dropTable("admin_logs");
    await queryInterface.dropTable("boost_purchases");
    await queryInterface.dropTable("boost_logs");
    await queryInterface.dropTable("boost_interactions");
    await queryInterface.dropTable("boost_campaigns");
    await queryInterface.dropTable("boost_packages");
    await queryInterface.dropTable("messages");
    await queryInterface.dropTable("conversations");
    await queryInterface.dropTable("review_feedbacks");
    await queryInterface.dropTable("reports");
    await queryInterface.dropTable("reviews");
    await queryInterface.dropTable("orders");
    await queryInterface.dropTable("materials");
    await queryInterface.dropTable("module_categories");
    await queryInterface.dropTable("academic_modules");
    await queryInterface.dropTable("semesters");
    await queryInterface.dropTable("comments");
    await queryInterface.dropTable("marketplace_items");
    await queryInterface.dropTable("lost_and_founds");
    await queryInterface.dropTable("boardings");
    await queryInterface.dropTable("post_likes");
    await queryInterface.dropTable("normal_posts");
    await queryInterface.dropTable("club_event_posts");
    await queryInterface.dropTable("club_product_posts");
    await queryInterface.dropTable("posts");
    await queryInterface.dropTable("club_profiles");
    await queryInterface.dropTable("business_profiles");
    await queryInterface.dropTable("users");
  },
};

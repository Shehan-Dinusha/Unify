//node seedDummyData.js
import bcrypt from "bcryptjs";
import {
  sequelize,
  User,
  StudentProfile,
  BusinessProfile,
  MarketplaceItem,
  Review,
} from "./src/modules/index.js";

async function seedData() {
  console.log("Starting data seeding process for testing...");

  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // Sync database models
    await sequelize.sync({ alter: true });

    // Fix PostgreSQL sequence if it is out of sync
    try {
      await sequelize.query(
        `SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));`,
      );
      await sequelize.query(
        `SELECT setval('student_profiles_id_seq', (SELECT MAX(id) FROM student_profiles));`,
      );
      await sequelize.query(
        `SELECT setval('business_profiles_id_seq', (SELECT MAX(id) FROM business_profiles));`,
      );
      await sequelize.query(
        `SELECT setval('marketplace_items_id_seq', (SELECT MAX(id) FROM marketplace_items));`,
      );
      await sequelize.query(
        `SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews));`,
      );
    } catch (err) {
      console.log("Sequence fix skipped or not required.");
    }

    const passwordHash = await bcrypt.hash("password123", 10);

    // 1. Create a Student User
    const [studentUser] = await User.findOrCreate({
      where: { email: "student@unifytest.com" },
      defaults: {
        name: "Test Student",
        email: "student@unifytest.com",
        passwordHash,
        role: "Student",
        phone: "+94770000001",
      },
    });

    if (studentUser) {
      await StudentProfile.findOrCreate({
        where: { userId: studentUser.id },
        defaults: {
          userId: studentUser.id,
          studentCode: "ST12345",
          faculty: "Computing",
          department: "Computer Science",
        },
      });
    }

    // 2. Create a Business User
    const [businessUser] = await User.findOrCreate({
      where: { email: "business@unifytest.com" },
      defaults: {
        name: "Test Business",
        email: "business@unifytest.com",
        passwordHash,
        role: "Business",
        phone: "+94770000002",
      },
    });

    if (businessUser) {
      await BusinessProfile.findOrCreate({
        where: { userId: businessUser.id },
        defaults: {
          userId: businessUser.id,
          category: "Food & Beverage",
          location: "Near Campus",
        },
      });
    }

    // 3. Create another Student to act as a Target/Seller
    const [sellerStudent] = await User.findOrCreate({
      where: { email: "seller@unifytest.com" },
      defaults: {
        name: "Test Seller",
        email: "seller@unifytest.com",
        passwordHash,
        role: "Student",
        phone: "+94770000003",
      },
    });

    if (sellerStudent) {
      await StudentProfile.findOrCreate({
        where: { userId: sellerStudent.id },
        defaults: {
          userId: sellerStudent.id,
          studentCode: "ST99999",
          tier: "Premium",
        },
      });
    }

    // 4. Create Marketplace Items for the Seller
    const [item1] = await MarketplaceItem.findOrCreate({
      where: { title: "Used Engineering Math Book" },
      defaults: {
        sellerId: sellerStudent.id,
        title: "Used Engineering Math Book",
        description: "Good condition, no missing pages.",
        price: "Rs. 1500",
        category: "Books",
      },
    });

    const [item2] = await MarketplaceItem.findOrCreate({
      where: { title: "Campus Umbrella" },
      defaults: {
        sellerId: businessUser.id,
        title: "Campus Umbrella",
        description: "Sturdy and durable anomali umbrella.",
        price: "Rs. 950",
        category: "Essentials",
      },
    });

    // 5. Create Reviews

    // Student reviews Business User
    await Review.findOrCreate({
      where: { reviewerId: studentUser.id, targetId: businessUser.id },
      defaults: {
        reviewerId: studentUser.id,
        targetId: businessUser.id, // Target is the Business User
        rating: 5,
        content: "Great business, very affordable for students!",
        isLikedByOwner: true,
      },
    });

    // Student reviews a Marketplace Item Seller or Seller's item directly
    // Wait, by schema targetId is related to User. "targetId: User who provided a service or business"
    // So reviewing the seller.
    await Review.findOrCreate({
      where: { reviewerId: studentUser.id, targetId: sellerStudent.id },
      defaults: {
        reviewerId: studentUser.id,
        targetId: sellerStudent.id, // Target is the Seller User
        rating: 4,
        content: "Good product condition, prompt replies.",
        helpfulCount: 2,
      },
    });

    // Business replies or reviews Student
    await Review.findOrCreate({
      where: { reviewerId: businessUser.id, targetId: studentUser.id },
      defaults: {
        reviewerId: businessUser.id,
        targetId: studentUser.id,
        rating: 3,
        content: "Neutral experience, communication could be better.",
      },
    });

    console.log("Mock data seeded successfully.");
    console.log("-----------------------------------------");
    console.log("Available Test Users:");
    console.log(
      "Student: student@unifytest.com / password123 (ID: " +
        studentUser.id +
        ")",
    );
    console.log(
      "Business: business@unifytest.com / password123 (ID: " +
        businessUser.id +
        ")",
    );
    console.log(
      "Seller: seller@unifytest.com / password123 (ID: " +
        sellerStudent.id +
        ")",
    );
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await sequelize.close();
  }
}

seedData();

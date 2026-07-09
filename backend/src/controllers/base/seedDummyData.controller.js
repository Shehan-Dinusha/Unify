import bcrypt from "bcryptjs";
import {
  sequelize,
  User,
  StudentProfile,
  BusinessProfile,
  MarketplaceItem,
  Review,
  Boarding,
  University,
  Faculty,
  Degree,
  Batch,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

export const seedDummyData = async (req, res, next) => {
  logger.info("Starting comprehensive data seeding for Unify...");

  try {
    await sequelize.authenticate();
    logger.info("Database connected successfully.");

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
      await sequelize.query(
        `SELECT setval('boardings_id_seq', (SELECT MAX(id) FROM boardings));`,
      );
    } catch (err) {
      logger.info("Sequence fix skipped or not required.");
    }

    const passwordHash = await bcrypt.hash("password123", 10);

    // Fetch necessary academic data for students
    const moratuwa = await University.findOne({
      where: { name: "University of Moratuwa" },
    });
    const engineering = await Faculty.findOne({
      where: { name: "Engineering" },
    });
    const cseDegree = await Degree.findOne({
      where: { name: "BSc Eng (Hons) in Computer Science & Engineering" },
    });
    const batch22 = await Batch.findOne({ where: { name: "22" } });

    const itFaculty = await Faculty.findOne({
      where: { name: "Information Technology" },
    });
    const itDegree = await Degree.findOne({
      where: { name: "BSc (Hons) in Information Technology" },
    });
    const batch21 = await Batch.findOne({ where: { name: "21" } });

    // 1. Create a Student User
    const [studentUser] = await User.findOrCreate({
      where: { email: "alex.j@unify.com" },
      defaults: {
        name: "Alex Johnson",
        email: "alex.j@unify.com",
        passwordHash,
        role: "Student",
        phone: "+94771111111",
      },
    });

    await StudentProfile.findOrCreate({
      where: { userId: studentUser.id },
      defaults: {
        userId: studentUser.id,
        registrationNumber: "ENG-22-045",
        universityId: moratuwa?.id,
        facultyId: engineering?.id,
        degreeId: cseDegree?.id,
        batchId: batch22?.id,
        tier: "Premium",
      },
    });

    // 2. Create another Student (Seller)
    const [sellerStudent] = await User.findOrCreate({
      where: { email: "sarah.m@unify.com" },
      defaults: {
        name: "Sarah Miller",
        email: "sarah.m@unify.com",
        passwordHash,
        role: "Student",
        phone: "+94772222222",
      },
    });

    await StudentProfile.findOrCreate({
      where: { userId: sellerStudent.id },
      defaults: {
        userId: sellerStudent.id,
        registrationNumber: "IT-21-089",
        universityId: moratuwa?.id,
        facultyId: itFaculty?.id,
        degreeId: itDegree?.id,
        batchId: batch21?.id,
        tier: "Standard",
      },
    });

    // 3. Create a Business User (Host/Food Cafe)
    const [businessUser] = await User.findOrCreate({
      where: { email: "campus.cafe@unify.com" },
      defaults: {
        name: "Campus Bites & Cafe",
        email: "campus.cafe@unify.com",
        passwordHash,
        role: "Business",
        phone: "+94773333333",
      },
    });

    await BusinessProfile.findOrCreate({
      where: { userId: businessUser.id },
      defaults: {
        userId: businessUser.id,
        displayName: "Campus Bites & Cafe",
        businessName: "Campus Bites & Cafe Unify",
        category: "FOOD",
        addresses: { primary: "Main Gate, Malabe" },
      },
    });

    // 4. Create Marketplace Items (Services, Merch, Essentials)
    await MarketplaceItem.findOrCreate({
      where: { title: "Data Structures Tutoring" },
      defaults: {
        sellerId: sellerStudent.id,
        title: "Data Structures Tutoring",
        description:
          "1-on-1 tutoring session. Guaranteed results with practical examples.",
        price: "$30/hr",
        category: "Services",
      },
    });

    await MarketplaceItem.findOrCreate({
      where: { title: "Unify Tech Hoodie" },
      defaults: {
        sellerId: businessUser.id,
        title: "Unify Tech Hoodie",
        description: "Official tech club hoodie. Premium cotton blend.",
        price: "$45",
        category: "Clubs' Merchandise",
      },
    });

    await MarketplaceItem.findOrCreate({
      where: { title: "Dorm Essentials Pack" },
      defaults: {
        sellerId: sellerStudent.id,
        title: "Dorm Essentials Pack",
        description: "Bed sheets, lamp, mini-fan, and organizer.",
        price: "$80",
        category: "Essentials",
      },
    });

    // 5. Create Boardings
    await Boarding.findOrCreate({
      where: { title: "Cozy Student Pod - Walk to Campus" },
      defaults: {
        hostId: businessUser.id,
        title: "Cozy Student Pod - Walk to Campus",
        description:
          "Fully furnished single room in a student-friendly neighborhood. Only 10 mins walk from main campus.",
        pricePerMonth: "$450",
        location: "Kothalawala, Malabe",
        amenities: "WiFi, AC, Laundry",
        availableFrom: new Date(),
        isVerified: true,
      },
    });

    await Boarding.findOrCreate({
      where: { title: "Premium Shared Annex" },
      defaults: {
        hostId: businessUser.id,
        title: "Premium Shared Annex",
        description:
          "Shared room suitable for 2 students. Attached bathroom and kitchenette.",
        pricePerMonth: "$300",
        location: "Thalahena, Malabe",
        amenities: "Utility Included, Parking",
        availableFrom: new Date(),
        isVerified: false,
      },
    });

    // 6. Create Reviews
    await Review.findOrCreate({
      where: { reviewerId: studentUser.id, targetId: businessUser.id },
      defaults: {
        reviewerId: studentUser.id,
        targetId: businessUser.id,
        rating: 5,
        content: "Amazing food and affordable prices for students!",
        isLikedByOwner: true,
      },
    });

    await Review.findOrCreate({
      where: { reviewerId: studentUser.id, targetId: sellerStudent.id },
      defaults: {
        reviewerId: studentUser.id,
        targetId: sellerStudent.id,
        rating: 4,
        content: "Tutoring sessions were very helpful for my mid-terms.",
        helpfulCount: 5,
      },
    });

    logger.info(
      "Mock data heavily populated from frontend mock data equivalents!",
    );
    return sendResponse(res, 200, true, "Dummy data seeded successfully!");
  } catch (error) {
    logger.error("Error seeding data:", error);
    return sendResponse(
      res,
      500,
      false,
      "Failed to seed dummy data",
      error.message,
    );
  }
};

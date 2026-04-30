import {
  User,
  ClubProfile,
  UserFollower,
  StudentProfile,
} from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";
import bcrypt from "bcryptjs";

export const seedFollowers = catchAsync(async (req, res) => {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Create a test student (ID = 1 if possible, or just a known email)
  const [student, createdStudent] = await User.findOrCreate({
    where: { email: "teststudent@unify.com" },
    defaults: {
      name: "Alex Johnson",
      email: "teststudent@unify.com",
      passwordHash,
      role: "Student",
      isEmailVerified: true,
      status: "Active",
    },
  });

  await StudentProfile.findOrCreate({
    where: { userId: student.id },
    defaults: {
      userId: student.id,
      bio: "I am a test student.",
    },
  });

  // 2. Create mock clubs
  const mockClubsData = [
    {
      name: "Photography Society",
      email: "photo@unify.com",
      about: "Capturing moments.",
    },
    {
      name: "Robotics Club",
      email: "robotics@unify.com",
      about: "Building the future.",
    },
    {
      name: "Debate Team",
      email: "debate@unify.com",
      about: "Sharpen your rhetoric.",
    },
  ];

  const clubs = [];

  for (const clubData of mockClubsData) {
    const [clubUser] = await User.findOrCreate({
      where: { email: clubData.email },
      defaults: {
        name: clubData.name,
        email: clubData.email,
        passwordHash,
        role: "Club",
        isEmailVerified: true,
        status: "Active",
      },
    });

    await ClubProfile.findOrCreate({
      where: { userId: clubUser.id },
      defaults: {
        userId: clubUser.id,
        clubName: clubData.name,
        about: clubData.about,
        isVerified: true, // Must be verified to be followed
      },
    });

    clubs.push(clubUser);
  }

  // 3. Create followings for the student
  for (const club of clubs) {
    await UserFollower.findOrCreate({
      where: {
        followerId: student.id,
        followingId: club.id,
      },
      defaults: {
        followerId: student.id,
        followingId: club.id,
      },
    });
  }

  return sendResponse(
    res,
    201,
    true,
    "Seed data for followers created successfully.",
    {
      studentId: student.id,
      clubs: clubs.map((c) => ({ id: c.id, name: c.name })),
    },
  );
});

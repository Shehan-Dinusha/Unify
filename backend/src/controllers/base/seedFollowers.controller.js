import { User, UserFollower } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";

const CLUB_IDS = [31, 32, 33, 34];

export const seedFollowers = catchAsync(async (req, res) => {
  const students = await User.findAll({
    where: { role: "Student" },
    order: [["id", "ASC"]],
    attributes: ["id"],
  });

  const clubs = await User.findAll({
    where: { id: CLUB_IDS, role: "Club" },
    attributes: ["id", "name"],
  });

  if (!students.length) {
    return sendResponse(res, 400, false, "No students found. Run seed-users first.");
  }

  if (!clubs.length) {
    return sendResponse(res, 400, false, `No clubs found at IDs [${CLUB_IDS.join(", ")}].`);
  }

  let created = 0;
  let skipped = 0;

  for (const student of students) {
    for (const club of clubs) {
      const [, isNew] = await UserFollower.findOrCreate({
        where: { followerId: student.id, followingId: club.id },
        defaults: { followerId: student.id, followingId: club.id },
      });
      if (isNew) created++;
      else skipped++;
    }
  }

  return sendResponse(res, 201, true, "Followers seeded successfully!", {
    created,
    skipped,
    total: created + skipped,
    students: students.length,
    clubs: clubs.map((c) => ({ id: c.id, name: c.name })),
  });
});

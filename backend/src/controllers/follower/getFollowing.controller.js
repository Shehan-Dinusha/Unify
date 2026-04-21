import { User, UserFollower, ClubProfile } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";

export const getStudentFollowings = catchAsync(async (req, res) => {
  // Use `req.user?.id` normally, but allow `req.query.studentId` for testing since auth is pending
  const studentId = req.user?.id || req.query.studentId;

  if (!studentId) {
    return sendResponse(
      res,
      401,
      false,
      "Not authorized. No student ID provided.",
    );
  }

  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const offset = (page - 1) * limit;
  const sortOrder = req.query.sortOrder || "asc";

  const student = await User.findByPk(studentId);

  if (!student) {
    return sendResponse(res, 404, false, "Student not found.");
  }

  // Only students can have followings in this platform
  if (student.role !== "Student") {
    return sendResponse(
      res,
      403,
      false,
      "Only students can view their followings.",
    );
  }

  // Determine sorting strategy
  let orderClause = [];
  switch (sortOrder) {
    case "newest":
      orderClause = [[UserFollower, "createdAt", "DESC"]];
      break;
    case "oldest":
      orderClause = [[UserFollower, "createdAt", "ASC"]];
      break;
    case "desc":
      orderClause = [["name", "DESC"]];
      break;
    case "asc":
    default:
      orderClause = [["name", "ASC"]];
      break;
  }

  // Use Sequelize's automatically generated mixin countFollowing()
  const totalFollowings = await student.countFollowing();

  // Use getFollowing() to fetch paginated target records (Clubs)
  const followings = await student.getFollowing({
    attributes: ["id", "name", "avatar"],
    include: [
      {
        model: ClubProfile,
        as: "clubProfile",
        attributes: ["about"],
      },
    ],
    // joinTableAttributes keeps the output clean and only what we want from the through table limit.
    // However, Sequelize needs to know the through table exists if sorting by it.
    order: orderClause,
    limit,
    offset,
  });

  const hasMore = offset + followings.length < totalFollowings;

  // Map followings for frontend consumption as seen in FollowingsDirectory.jsx
  const mappedFollowings = followings.map((user) => ({
    id: user.id,
    name: user.name,
    avatar:
      user.avatar ||
      "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name),
    description: user.clubProfile?.about || "No description provided.",
  }));

  // Return the shape { followings, total, hasMore }
  return sendResponse(res, 200, true, "Followings retrieved successfully.", {
    followings: mappedFollowings,
    total: totalFollowings,
    hasMore,
  });
});

import bcrypt from "bcryptjs";
import { User } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";

export const seedAdmin = async (req, res) => {
  try {
    const passwordHash = await bcrypt.hash("Admin@123", 10);
    const [admin, created] = await User.findOrCreate({
      where: { email: "admin@unify.lk" },
      defaults: {
        name: "Super Admin",
        email: "admin@unify.lk",
        passwordHash,
        role: "Admin",
        isVerified: true,
      },
    });

    return sendResponse(
      res,
      created ? 201 : 200,
      true,
      created
        ? "Admin account created."
        : "Admin already exists.",
      { admin: { id: admin.id, name: admin.name, email: admin.email } },
    );
  } catch (error) {
    return sendResponse(res, 500, false, "Failed to seed admin.", error.message);
  }
};

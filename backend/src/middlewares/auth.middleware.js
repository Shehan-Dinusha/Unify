import jwt from "jsonwebtoken";
import { User } from "../modules/index.js";
import { sendResponse } from "../utils/response.js";
import logger from "../utils/logger.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendResponse(res, 401, false, "Not authorized, no token");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) {
      return sendResponse(res, 401, false, "User not found");
    }

    if (user.status === "Suspended") {
      return sendResponse(res, 403, false, "Account is suspended");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error("Auth Middleware Error:", error);
    return sendResponse(res, 401, false, "Not authorized, token failed");
  }
};

/**
 * @desc    Authorize roles
 * @param   {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendResponse(
        res,
        403,
        false,
        `User role '${req.user?.role || "unknown"}' is not authorized to access this route`,
      );
    }
    next();
  };
};

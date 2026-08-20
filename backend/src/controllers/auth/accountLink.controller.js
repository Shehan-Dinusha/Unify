import {
  linkAccounts,
  getLinkedAccounts,
  switchAccountSession,
  unlinkAccount,
} from "../../services/accountLink.service.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * @desc    Explicitly authenticates target account and links it to current user's group
 * @route   POST /api/v1/auth/link-account
 * @access  Private
 */
export const linkAccountController = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return sendResponse(res, 400, false, "Identifier and password are required.");
    }

    const result = await linkAccounts(req.user.id, identifier, password, req);
    return sendResponse(res, 200, true, "Account linked successfully", result);
  } catch (error) {
    logger.error(`Error in linkAccountController: ${error.message}`);
    return sendResponse(res, 400, false, error.message);
  }
};

/**
 * @desc    Retrieves all safe linked accounts for current user
 * @route   GET /api/v1/auth/linked-accounts
 * @access  Private
 */
export const getLinkedAccountsController = async (req, res, next) => {
  try {
    const accounts = await getLinkedAccounts(req.user.id);
    return sendResponse(res, 200, true, "Linked accounts retrieved successfully", accounts);
  } catch (error) {
    logger.error(`Error in getLinkedAccountsController: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Generates a new session and token pair for a linked account on current device
 * @route   POST /api/v1/auth/switch-account
 * @access  Private
 */
export const switchAccountController = async (req, res, next) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) {
      return sendResponse(res, 400, false, "Target user ID is required.");
    }

    const result = await switchAccountSession(req.user.id, parseInt(targetUserId), req);
    return sendResponse(res, 200, true, "Account switched successfully", result);
  } catch (error) {
    logger.error(`Error in switchAccountController: ${error.message}`);
    return sendResponse(res, 403, false, error.message);
  }
};

/**
 * @desc    Unlinks targetUserId from current user's AccountGroup server-side
 * @route   DELETE /api/v1/auth/unlink-account/:targetUserId
 * @access  Private
 */
export const unlinkAccountController = async (req, res, next) => {
  try {
    const { targetUserId } = req.params;
    if (!targetUserId) {
      return sendResponse(res, 400, false, "Target user ID is required.");
    }

    await unlinkAccount(req.user.id, parseInt(targetUserId));
    return sendResponse(res, 200, true, "Account unlinked successfully");
  } catch (error) {
    logger.error(`Error in unlinkAccountController: ${error.message}`);
    return sendResponse(res, 400, false, error.message);
  }
};

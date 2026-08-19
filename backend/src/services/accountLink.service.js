import bcrypt from "bcryptjs";
import sequelize from "../config/database.js";
import {
  User,
  AccountGroup,
  AccountGroupMember,
} from "../modules/index.js";
import { generateTokens } from "../controllers/auth/auth.utils.js";
import { resolveAvatarUrl } from "../utils/avatarUrl.util.js";
import { getRoleProfileData, checkUserProfileExists } from "./roleProfile.service.js";
import { phoneWhere } from "../utils/phoneWhere.util.js";

const ensureTablesSynced = async () => {
  try {
    await AccountGroup.sync();
    await AccountGroupMember.sync();
  } catch (err) {
    // Ignore if already synced
  }
};

/**
 * Explicitly authenticates target user B credentials and links Account B
 * into current User A's AccountGroup transactionally.
 */
export const linkAccounts = async (currentUserId, targetIdentifier, targetPassword, req = {}) => {
  await ensureTablesSynced();
  const transaction = await sequelize.transaction();
  try {
    const searchCriteria = targetIdentifier.includes("@")
      ? { email: targetIdentifier.trim() }
      : phoneWhere(targetIdentifier);

    const targetUser = await User.findOne({ where: searchCriteria, transaction });
    if (!targetUser) throw new Error("Invalid credentials for account to link.");
    if (!targetUser.isVerified) throw new Error("Target account is not verified.");
    if (targetUser.status === "Deleted") throw new Error("This account has been deleted.");
    if (targetUser.status === "Suspended") throw new Error("Target account is suspended.");

    const isMatch = await bcrypt.compare(targetPassword, targetUser.passwordHash);
    if (!isMatch) throw new Error("Invalid credentials for account to link.");

    if (currentUserId === targetUser.id) {
      throw new Error("Cannot link an account to itself.");
    }

    // Fetch existing group memberships
    let memberA = await AccountGroupMember.findOne({ where: { userId: currentUserId }, transaction });
    let memberB = await AccountGroupMember.findOne({ where: { userId: targetUser.id }, transaction });

    let finalGroupId;

    if (!memberA && !memberB) {
      // Neither belongs to a group -> Create new AccountGroup
      const newGroup = await AccountGroup.create({}, { transaction });
      finalGroupId = newGroup.id;
      await AccountGroupMember.bulkCreate(
        [
          { groupId: finalGroupId, userId: currentUserId },
          { groupId: finalGroupId, userId: targetUser.id },
        ],
        { transaction }
      );
    } else if (memberA && !memberB) {
      // A has a group -> Add B to A's group
      finalGroupId = memberA.groupId;
      await AccountGroupMember.create({ groupId: finalGroupId, userId: targetUser.id }, { transaction });
    } else if (!memberA && memberB) {
      // B has a group -> Add A to B's group
      finalGroupId = memberB.groupId;
      await AccountGroupMember.create({ groupId: finalGroupId, userId: currentUserId }, { transaction });
    } else if (memberA.groupId !== memberB.groupId) {
      // Both have different groups -> Merge B's group into A's group
      finalGroupId = memberA.groupId;
      const oldGroupId = memberB.groupId;

      await AccountGroupMember.update(
        { groupId: finalGroupId },
        { where: { groupId: oldGroupId }, transaction }
      );

      await AccountGroup.destroy({ where: { id: oldGroupId }, transaction });
    } else {
      finalGroupId = memberA.groupId;
    }

    await transaction.commit();

    // Issue a new UserSession for the newly linked Account B on this device
    const { accessToken, refreshToken } = await generateTokens(targetUser, req);
    const avatar = await resolveAvatarUrl(targetUser.avatar, targetUser.name);
    const profileData = await getRoleProfileData(targetUser);
    const hasProfile = await checkUserProfileExists(targetUser);

    return {
      accessToken,
      refreshToken,
      user: {
        id: targetUser.id,
        email: targetUser.email,
        phone: targetUser.phone,
        name: targetUser.name,
        role: targetUser.role,
        avatar,
        hasProfile,
        ...profileData,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Returns safe public metadata for all accounts linked to currentUserId.
 */
export const getLinkedAccounts = async (currentUserId) => {
  await ensureTablesSynced();
  const memberA = await AccountGroupMember.findOne({ where: { userId: currentUserId } });
  if (!memberA) return [];

  const members = await AccountGroupMember.findAll({
    where: { groupId: memberA.groupId },
    include: [{ model: User, as: "user" }],
  });

  const linkedUsers = members
    .map((m) => m.user)
    .filter((u) => u && u.id !== currentUserId && u.status === "Active");

  return Promise.all(
    linkedUsers.map(async (u) => {
      const avatar = await resolveAvatarUrl(u.avatar, u.name);
      const profileData = await getRoleProfileData(u);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        avatar,
        category: profileData.category || null,
        faculty: profileData.faculty?.name || profileData.faculty || null,
      };
    })
  );
};

/**
 * Generates a new UserSession for targetUserId if targetUserId belongs to the same AccountGroup as currentUserId.
 */
export const switchAccountSession = async (currentUserId, targetUserId, req = {}) => {
  await ensureTablesSynced();
  const memberA = await AccountGroupMember.findOne({ where: { userId: currentUserId } });
  const memberB = await AccountGroupMember.findOne({ where: { userId: targetUserId } });

  if (!memberA || !memberB || memberA.groupId !== memberB.groupId) {
    throw new Error("Target account is not linked to your account.");
  }

  const targetUser = await User.findByPk(targetUserId);
  if (!targetUser || targetUser.status === "Deleted" || targetUser.status === "Suspended") {
    throw new Error("Target account is inactive or suspended.");
  }

  const { accessToken, refreshToken } = await generateTokens(targetUser, req);
  const avatar = await resolveAvatarUrl(targetUser.avatar, targetUser.name);
  const profileData = await getRoleProfileData(targetUser);
  const hasProfile = await checkUserProfileExists(targetUser);

  return {
    accessToken,
    refreshToken,
    user: {
      id: targetUser.id,
      email: targetUser.email,
      phone: targetUser.phone,
      name: targetUser.name,
      role: targetUser.role,
      avatar,
      hasProfile,
      ...profileData,
    },
  };
};

/**
 * Transactionally unlinks targetUserId from currentUserId's AccountGroup.
 */
export const unlinkAccount = async (currentUserId, targetUserId) => {
  await ensureTablesSynced();
  const transaction = await sequelize.transaction();
  try {
    const memberA = await AccountGroupMember.findOne({ where: { userId: currentUserId }, transaction });
    const memberB = await AccountGroupMember.findOne({ where: { userId: targetUserId }, transaction });

    if (!memberA || !memberB || memberA.groupId !== memberB.groupId) {
      throw new Error("Accounts are not linked.");
    }

    const groupId = memberA.groupId;
    await AccountGroupMember.destroy({ where: { id: memberB.id }, transaction });

    const remainingCount = await AccountGroupMember.count({ where: { groupId }, transaction });
    if (remainingCount <= 1) {
      await AccountGroupMember.destroy({ where: { groupId }, transaction });
      await AccountGroup.destroy({ where: { id: groupId }, transaction });
    }

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

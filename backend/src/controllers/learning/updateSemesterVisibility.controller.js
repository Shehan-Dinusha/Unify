import { Op } from "sequelize";
import {
  sequelize,
  SemesterVisibility,
  Degree,
  Semester,
  Batch,
  StudentProfile,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { notifyUser } from "../../services/notification.service.js";

export const updateSemesterVisibility = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { degreeId, semesterId } = req.params;
    const { visibleBatchIds, notifyStudents } = req.body;

    const degree = await Degree.findByPk(parseInt(degreeId, 10), {
      transaction: t,
    });
    if (!degree) {
      await t.rollback();
      return sendResponse(res, 404, false, "Degree not found");
    }

    const semester = await Semester.findByPk(parseInt(semesterId, 10), {
      transaction: t,
    });
    if (!semester) {
      await t.rollback();
      return sendResponse(res, 404, false, "Semester not found");
    }

    // Fetch currently visible batches before updating
    const existingVisible = await SemesterVisibility.findAll({
      where: {
        degreeId: parseInt(degreeId, 10),
        semesterId: parseInt(semesterId, 10),
        isVisible: true,
      },
      attributes: ["batchId"],
      transaction: t,
    });
    const oldVisibleBatchIds = existingVisible.map((v) => v.batchId);

    await SemesterVisibility.destroy({
      where: {
        degreeId: parseInt(degreeId, 10),
        semesterId: parseInt(semesterId, 10),
      },
      transaction: t,
    });

    const allBatches = await Batch.findAll({
      attributes: ["id"],
      transaction: t,
    });

    // We explicitly insert records for ALL batches to lock out the unselected ones,
    // so we can distinguish "never configured" (0 rows) vs "configured" (rows exist).
    if (allBatches && allBatches.length > 0) {
      const recordsToInsert = allBatches.map((b) => ({
        degreeId: parseInt(degreeId, 10),
        semesterId: parseInt(semesterId, 10),
        batchId: b.id,
        isVisible:
          visibleBatchIds.includes(b.id) ||
          visibleBatchIds.includes(String(b.id)),
      }));
      await SemesterVisibility.bulkCreate(recordsToInsert, { transaction: t });
    }

    await t.commit();

    if (notifyStudents) {
      const parseId = (id) => parseInt(id, 10);
      const newBatchIds = visibleBatchIds.map(parseId);
      const gainedIds = newBatchIds.filter((id) => !oldVisibleBatchIds.includes(id));
      const lostIds = oldVisibleBatchIds.filter((id) => !newBatchIds.includes(id));

      // Notify students in gained batches
      if (gainedIds.length > 0) {
        const students = await StudentProfile.findAll({
          where: {
            degreeId: parseInt(degreeId, 10),
            batchId: { [Op.in]: gainedIds },
          },
          attributes: ["userId"],
        });

        const title = `Learning materials now available for ${semester.name}`;
        const content = `Materials for ${semester.name} are now accessible in your course dashboard.`;
        const refId = parseInt(semesterId, 10);

        for (const student of students) {
          await notifyUser({
            userId: student.userId,
            actorId: req.user.id,
            type: "General",
            title,
            content,
            referenceId: refId,
            referenceType: "Semester",
            dedupeKey: `semester-visibility:${student.userId}:${degreeId}:${semesterId}`,
          });
        }
      }

      // Notify students in lost batches
      if (lostIds.length > 0) {
        const students = await StudentProfile.findAll({
          where: {
            degreeId: parseInt(degreeId, 10),
            batchId: { [Op.in]: lostIds },
          },
          attributes: ["userId"],
        });

        const title = `Access removed for ${semester.name}`;
        const content = `Access to materials for ${semester.name} has been removed from your course dashboard.`;
        const refId = parseInt(semesterId, 10);

        for (const student of students) {
          await notifyUser({
            userId: student.userId,
            actorId: req.user.id,
            type: "General",
            title,
            content,
            referenceId: refId,
            referenceType: "Semester",
            dedupeKey: `semester-visibility-revoke:${student.userId}:${degreeId}:${semesterId}`,
          });
        }
      }
    }

    return sendResponse(
      res,
      200,
      true,
      "Semester visibility updated successfully",
    );
  } catch (error) {
    await t.rollback();
    logger.error(`Error in updateSemesterVisibility: ${error.message}`);
    next(error);
  }
};

import {
  sequelize,
  SemesterVisibility,
  Degree,
  Semester,
  Batch,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

export const updateSemesterVisibility = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { degreeId, semesterId } = req.params;
    const { visibleBatchIds, notifyReps } = req.body;

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

    if (notifyReps) {
      logger.info(
        `Notification triggered for reps of batches: ${visibleBatchIds.join(", ")}`,
      );
    }

    await t.commit();

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

import { sequelize, SemesterVisibility, Degree, Semester } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

export const updateSemesterVisibility = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { degreeId, semesterId } = req.params;
    const { visibleBatchIds, notifyReps } = req.body;

    const degree = await Degree.findByPk(parseInt(degreeId, 10), { transaction: t });
    if (!degree) {
      await t.rollback();
      return sendResponse(res, 404, false, "Degree not found");
    }

    const semester = await Semester.findByPk(parseInt(semesterId, 10), { transaction: t });
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

    if (visibleBatchIds.length > 0) {
      const recordsToInsert = visibleBatchIds.map((batchId) => ({
        degreeId: parseInt(degreeId, 10),
        semesterId: parseInt(semesterId, 10),
        batchId: parseInt(batchId, 10),
        isVisible: true,
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

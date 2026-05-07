import { sendResponse } from "../../utils/response.js";
import { User, StudentProfile, Degree, Batch } from "../../modules/index.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";

export const getBatchReps = async (req, res, next) => {
  try {
    const { degreeId } = req.query;

    const degreeExists = await Degree.findByPk(degreeId);
    if (!degreeExists) {
      return sendResponse(res, 404, false, "Degree not found");
    }

    const batchReps = await StudentProfile.findAll({
      where: {
        degreeId,
        isBatchRep: true,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "avatar"],
        },
        {
          model: Degree,
          as: "degree",
          attributes: ["name"],
        },
        {
          model: Batch,
          as: "batch",
          attributes: ["name"],
        },
      ],
    });

    const formattedReps = await Promise.all(
      batchReps.map(async (rep) => {
        let initials = "BR";
        if (rep.user?.name) {
          initials = rep.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
        }

        const avatarSrc = await resolveAvatarUrl(
          rep.user?.avatar,
          rep.user?.name,
        );

        return {
          userId: rep.user?.id,
          name: rep.user?.name || "Unknown User",
          avatarSrc,
          initials,
          degreeText: [rep.degree?.name, rep.batch?.name]
            .filter(Boolean)
            .join(" • "),
          roleText: "Rep",
        };
      }),
    );

    return sendResponse(
      res,
      200,
      true,
      "Batch reps retrieved successfully",
      formattedReps,
    );
  } catch (error) {
    next(error);
  }
};

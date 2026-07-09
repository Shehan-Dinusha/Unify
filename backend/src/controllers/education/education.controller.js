import {
  University,
  Faculty,
  Degree,
  Batch,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * @desc    Get all universities
 * @route   GET /api/v1/base/universities
 */
export const getUniversities = async (req, res) => {
  try {
    const universities = await University.findAll({
      order: [["name", "ASC"]],
    });
    return sendResponse(res, 200, true, "Universities fetched successfully", universities);
  } catch (error) {
    logger.error("Get Universities Error:", error);
    return sendResponse(res, 500, false, "Failed to fetch universities", error.message);
  }
};

/**
 * @desc    Get faculties for a university
 * @route   GET /api/v1/base/universities/:universityId/faculties
 */
export const getFaculties = async (req, res) => {
  try {
    const { universityId } = req.params;
    const faculties = await Faculty.findAll({
      where: { universityId },
      order: [["name", "ASC"]],
    });
    return sendResponse(res, 200, true, "Faculties fetched successfully", faculties);
  } catch (error) {
    logger.error("Get Faculties Error:", error);
    return sendResponse(res, 500, false, "Failed to fetch faculties", error.message);
  }
};

/**
 * @desc    Get degrees for a faculty
 * @route   GET /api/v1/base/faculties/:facultyId/degrees
 */
export const getDegrees = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const degrees = await Degree.findAll({
      where: { facultyId },
      order: [["name", "ASC"]],
    });
    return sendResponse(res, 200, true, "Degrees fetched successfully", degrees);
  } catch (error) {
    logger.error("Get Degrees Error:", error);
    return sendResponse(res, 500, false, "Failed to fetch degrees", error.message);
  }
};

/**
 * @desc    Get all batches
 * @route   GET /api/v1/base/batches
 */
export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.findAll({
      order: [["name", "DESC"]], // Show newest batches first
    });
    return sendResponse(res, 200, true, "Batches fetched successfully", batches);
  } catch (error) {
    logger.error("Get Batches Error:", error);
    return sendResponse(res, 500, false, "Failed to fetch batches", error.message);
  }
};

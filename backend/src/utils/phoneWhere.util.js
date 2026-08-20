import { Sequelize } from "sequelize";
import { normalizePhone } from "./phone.util.js";

/**
 * Builds a Sequelize WHERE condition for phone lookup that ignores spaces.
 * This allows matching "+94703215858" against "+94 70 321 5858" stored in DB.
 *
 * @param {string} phone - Raw phone input from the request
 * @returns {import("sequelize").WhereOptions} Sequelize where condition
 */
export const phoneWhere = (phone) => {
  const normalized = normalizePhone(phone);
  return Sequelize.where(
    Sequelize.fn("REPLACE", Sequelize.col("phone"), " ", ""),
    normalized
  );
};

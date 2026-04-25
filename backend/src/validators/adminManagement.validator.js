import Joi from 'joi';

/**
 * Validator for Student Directory filtering
 */
export const studentDirectorySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().allow('', null).optional(),
  facultyId: Joi.number().integer().optional(),
  status: Joi.string().valid('Active', 'Suspended', 'all').optional(),
});

/**
 * Validator for Business Directory filtering
 */
export const businessDirectorySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().allow('', null).optional(),
  category: Joi.string().valid('BOARDING', 'FOOD', 'SELF_EMPLOYED', 'all').optional(),
  status: Joi.string().valid('Active', 'Suspended', 'all').optional(),
});

/**
 * Validator for updating user status
 */
export const updateStatusSchema = Joi.object({
  status: Joi.string().valid('Active', 'Suspended', 'Inactive').required(),
  reason: Joi.string().allow('', null),
  suspensionCategory: Joi.string().valid(
    'Violation of Terms',
    'Spam Activity',
    'Harassment'
  ).allow('', null),
  sendEmail: Joi.boolean().default(false),
});

/**
 * Validator for adding an admin note
 */
export const addNoteSchema = Joi.object({
  text: Joi.string().min(3).max(1000).required(),
});

/**
 * Validator for sending a warning
 */
export const sendWarningSchema = Joi.object({
  message: Joi.string().min(5).max(1000).required(),
  category: Joi.string().valid(
    'Academic Integrity Violation',
    'Code of Conduct Violation',
    'Harassment or Bullying',
    'Spam or Misuse',
    'Inappropriate Content'
  ).required(),
  severity: Joi.string().valid(
    'Level 1 - Formal Caution',
    'Level 2 - Official Warning',
    'Level 3 - Severe Warning',
    'Level 4 - Final Warning'
  ).required(),
});

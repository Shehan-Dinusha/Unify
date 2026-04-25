import { body, query, param } from "express-validator";

/**
 * Validator for student directory filtering
 */
export const studentDirectoryValidator = [
  query('faculty').optional().notEmpty().withMessage('Faculty filter cannot be empty'),
  query('status').optional().isIn(['Active', 'Suspended', 'all']).withMessage('Invalid status filter'),
  query('search').optional().allow(''),
];

/**
 * Validator for business directory filtering
 */
export const businessDirectoryValidator = [
  query('category').optional().notEmpty().withMessage('Category filter cannot be empty'),
  query('status').optional().isIn(['Active', 'Suspended', 'all']).withMessage('Invalid status filter'),
  query('search').optional().allow(''),
];

/**
 * Validator for updating user status
 */
export const updateStatusValidator = [
  param('id').notEmpty().withMessage('User ID is required').isInt().withMessage('User ID must be an integer'),
  body('status').notEmpty().withMessage('Status is required').isIn(['Active', 'Suspended', 'Inactive']).withMessage('Invalid status'),
  body('reason').optional({ checkFalsy: true }),
  body('suspensionCategory').optional({ checkFalsy: true }).isIn([
    'Violation of Terms',
    'Spam Activity',
    'Harassment'
  ]).withMessage('Invalid suspension category'),
  body('sendEmail').optional().isBoolean().withMessage('sendEmail must be a boolean'),
];

/**
 * Validator for adding an internal note
 */
export const addNoteValidator = [
  param('id').notEmpty().withMessage('User ID is required').isInt().withMessage('User ID must be an integer'),
  body('text').notEmpty().withMessage('Note text is required').isLength({ min: 1, max: 2000 }).withMessage('Note must be between 1 and 2000 characters'),
];

/**
 * Validator for sending a warning
 */
export const sendWarningValidator = [
  param('id').notEmpty().withMessage('User ID is required').isInt().withMessage('User ID must be an integer'),
  body('message').notEmpty().withMessage('Warning message is required').isLength({ min: 5, max: 1000 }).withMessage('Warning message must be between 5 and 1000 characters'),
  body('category').notEmpty().withMessage('Violation category is required').isIn([
    'Academic Integrity Violation',
    'Code of Conduct Violation',
    'Harassment or Bullying',
    'Spam or Misuse',
    'Inappropriate Content'
  ]).withMessage('Invalid violation category'),
  body('severity').notEmpty().withMessage('Severity level is required').isIn([
    'Level 1 - Formal Caution',
    'Level 2 - Official Warning',
    'Level 3 - Severe Warning',
    'Level 4 - Final Warning'
  ]).withMessage('Invalid severity level'),
];

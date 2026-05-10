import { body, param } from "express-validator";

export const submitVerificationRequestValidator = [
  body("requestedRole")
    .optional()
    .isString()
    .withMessage("Requested role must be a string"),
];

export const approveVerificationRequestValidator = [
  param("id")
    .notEmpty()
    .withMessage("Verification ID is required")
    .isInt()
    .withMessage("Verification ID must be an integer"),
];

export const rejectVerificationRequestValidator = [
  param("id")
    .notEmpty()
    .withMessage("Verification ID is required")
    .isInt()
    .withMessage("Verification ID must be an integer"),
  body("reason")
    .notEmpty()
    .withMessage("A rejection reason must be provided")
    .isString()
    .withMessage("Reason must be a string"),
];

export const getVerificationStatusValidator = [];

export const deleteVerificationRequestValidator = [];

export const revokeBatchRepStatusValidator = [
  body("password")
    .notEmpty()
    .withMessage("Password is required to revoke status"),
];

export const getVerificationDocumentValidator = [
  param("id")
    .notEmpty()
    .withMessage("Verification ID is required")
    .isInt()
    .withMessage("Verification ID must be an integer"),
];

export const removeVerifiedAccountValidator = [
  param("id")
    .notEmpty()
    .withMessage("Verification ID is required")
    .isInt()
    .withMessage("Verification ID must be an integer"),
];

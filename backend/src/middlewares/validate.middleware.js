import { sendResponse } from '../utils/response.js';

/**
 * Middleware to validate request body/query/params using Joi schema.
 * @param {Object} schema - Joi schema object
 * @param {String} source - Request source to validate ('body', 'query', 'params')
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[source], {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      return sendResponse(res, 400, false, errorMessage);
    }

    next();
  };
};

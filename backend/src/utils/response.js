
/**
 * standardized response formatter
 * @param {Response} res - Express response object
 * @param {number} status - HTTP status code
 * @param {boolean} success - Success status
 * @param {string} message - Message
 * @param {object} data - Data to send
 */
export const sendResponse = (res, status, success, message, data = null) => {
  return res.status(status).json({
    success,
    message,
    data,
  });
};

export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

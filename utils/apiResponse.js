/**
 * Sends a standardized success API response.
 *
 * @param {Object} res - Express response object.
 * @param {*} data - Payload to return in response.
 * @param {string} message - User-friendly message explaining response context.
 * @param {number} [statusCode=200] - HTTP status code (defaults to 200).
 * @returns {Object} Express response JSON.
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends a standardized error API response.
 *
 * @param {Object} res - Express response object.
 * @param {string} message - User-friendly error message or description.
 * @param {number} [statusCode=500] - HTTP status code (defaults to 500).
 * @param {*} [errors=null] - Object or Array containing validation details/system errors.
 * @returns {Object} Express response JSON.
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Sends a standardized paginated response.
 * Useful for collection endpoints (e.g. searching, listing leads).
 *
 * @param {Object} res - Express response object.
 * @param {Array} data - Array of records for the current page.
 * @param {number} total - Total count of matching records in the database.
 * @param {number} page - Current active page index (1-indexed).
 * @param {number} limit - Number of records requested per page.
 * @returns {Object} Express response JSON.
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  const numericTotal = Number(total) || 0;
  const numericPage = Number(page) || 1;
  const numericLimit = Number(limit) || 10;
  const pages = Math.ceil(numericTotal / numericLimit) || 1;

  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total: numericTotal,
      page: numericPage,
      limit: numericLimit,
      pages,
    },
  });
};

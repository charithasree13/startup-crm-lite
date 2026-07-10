import { validationResult } from 'express-validator';

/**
 * Validation Middleware Wrapper.
 * Executes a series of express-validator verification rules and reports
 * standard formatting errors if any validation failures are encountered.
 *
 * @param {Array<import('express-validator').ValidationChain>} validations - List of validator rules
 * @returns {import('express').RequestHandler} Express middleware handler
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // 1. Run all validations sequentially or in parallel
    await Promise.all(validations.map((validation) => validation.run(req)));

    // 2. Extract errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // 3. Map validation results to standard { field, message } shape
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    // 4. Return 400 with validation failure breakdown
    return res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
  };
};

export default validate;

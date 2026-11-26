
const { validationResult } = require("express-validator");

// Handle request validation errors
const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  // Continue if no validation errors exist
  if (errors.isEmpty()) {
    return next();
  }

  // Format errors without exposing sensitive input values
  const formattedErrors = errors
    .array({ onlyFirstError: true })
    .map((error) => ({
      field: error.path || error.param || "request",
      message: error.msg,
    }));

  // Return structured validation error response
  return res.status(400).json({
    success: false,
    message: "Validation failed. Please check your inputs.",
    errors: formattedErrors,
  });
};

module.exports = validateMiddleware;

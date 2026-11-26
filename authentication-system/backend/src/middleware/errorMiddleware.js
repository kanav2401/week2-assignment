
// Handle requests to nonexistent API routes
const notFound = (req, res) => {
  return res.status(404).json({
    success: false,
    message: "The requested API endpoint was not found.",
    code: "ROUTE_NOT_FOUND",
  });
};

// Centralized error handling middleware
const errorMiddleware = (err, req, res, next) => {
  // Forward error if response headers were already sent
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let message = "An unexpected server error occurred.";
  let code = "INTERNAL_SERVER_ERROR";
  let errors;

  // Handle duplicate MongoDB entries
  if (err.code === 11000) {
    statusCode = 409;
    code = "DUPLICATE_ENTRY";

    const duplicateFields = Object.keys(
      err.keyPattern || err.keyValue || {}
    );

    if (duplicateFields.includes("email")) {
      message = "An account with this email already exists.";

      errors = [
        {
          field: "email",
          message,
        },
      ];
    } else if (duplicateFields.includes("username")) {
      message = "This username is already taken.";

      errors = [
        {
          field: "username",
          message,
        },
      ];
    } else {
      message = "A record with these details already exists.";
    }
  }

  // Handle Mongoose validation errors
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Database validation failed.";
    code = "VALIDATION_ERROR";

    errors = Object.values(err.errors || {}).map(
      (error) => ({
        field: error.path || "request",
        message: "Invalid or missing field value.",
      })
    );
  }

  // Handle invalid MongoDB identifiers
  else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier.";
    code = "INVALID_ID";
  }

  // Handle expired JWT tokens
  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired.";
    code = "TOKEN_EXPIRED";
  }

  // Handle invalid JWT tokens
  else if (
    err.name === "JsonWebTokenError" ||
    err.name === "NotBeforeError"
  ) {
    statusCode = 401;
    message = "Invalid authentication token.";
    code = "INVALID_TOKEN";
  }

  // Handle malformed JSON request bodies
  else if (
    err instanceof SyntaxError &&
    err.type === "entity.parse.failed"
  ) {
    statusCode = 400;
    message = "Invalid JSON request body.";
    code = "INVALID_JSON";
  }

  // Handle oversized request bodies
  else if (err.type === "entity.too.large") {
    statusCode = 413;
    message = "Request body is too large.";
    code = "PAYLOAD_TOO_LARGE";
  }

  // Handle disallowed CORS origins
  else if (err.code === "CORS_NOT_ALLOWED") {
    statusCode = 403;
    message = "Request origin is not allowed.";
    code = "CORS_NOT_ALLOWED";
  }

  // Handle database connectivity errors
  else if (
    err.name === "MongoServerSelectionError" ||
    err.name === "MongooseServerSelectionError" ||
    err.name === "MongoNetworkError" ||
    err.name === "MongoNotConnectedError"
  ) {
    statusCode = 503;
    message = "Database service is temporarily unavailable.";
    code = "DATABASE_UNAVAILABLE";
  }

  // Log server errors without exposing sensitive data
  if (statusCode >= 500) {
    console.error("SecureAuth Server Error:", {
      timestamp: new Date().toISOString(),
      method: req.method,
      errorName: err.name || "Error",
      statusCode,
      code,
    });
  }

  // Create consistent error response
  const response = {
    success: false,
    message,
    code,
  };

  // Include field-specific errors when available
  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  notFound,
  errorMiddleware,
};


const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal server error";
  let errors = [];

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";

    errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message
    }));
  }

  // Invalid MongoDB ObjectId or data type
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  }

  // Duplicate database entry
  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate record already exists";
  }

  // Invalid JSON request body
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON request body";
  }

  // Database connection errors
  if (
    err.name === "MongoNetworkError" ||
    err.name === "MongoServerSelectionError" ||
    err.name === "MongooseServerSelectionError"
  ) {
    statusCode = 503;
    message = "Database connection unavailable";
  }

  // Ensure a valid HTTP error status
  if (
    !Number.isInteger(statusCode) ||
    statusCode < 400 ||
    statusCode > 599
  ) {
    statusCode = 500;
  }

  // Log server errors without exposing details to clients
  if (statusCode >= 500) {
    console.error("Server Error:", err.message);

    if (statusCode !== 503) {
      message = "Internal server error";
    }
  }

  const response = {
    success: false,
    message
  };

  if (errors.length > 0) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  notFound,
  errorHandler
};

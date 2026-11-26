
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

// Database configuration
const connectDB = require("./config/db");

// Validate required environment variables
const requiredEnvVariables = [
  "MONGO_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "CSRF_SECRET",
  "CLIENT_URL",
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    console.error(
      `Missing environment variable: ${variable}`
    );

    process.exit(1);
  }
}

// Validate authentication secrets
const secrets = [
  process.env.JWT_ACCESS_SECRET,
  process.env.JWT_REFRESH_SECRET,
  process.env.CSRF_SECRET,
];

if (
  secrets.some(
    (secret) =>
      secret.length < 64 ||
      secret.startsWith("REPLACE_WITH")
  )
) {
  console.error(
    "Authentication secrets must be securely generated."
  );

  process.exit(1);
}

// Ensure all authentication secrets are different
if (new Set(secrets).size !== secrets.length) {
  console.error(
    "Authentication secrets must be different."
  );

  process.exit(1);
}

// Import database models
const User = require("./models/User");
const Session = require("./models/Session");

// Import API routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Import middleware
const {
  apiLimiter,
} = require("./middleware/rateLimitMiddleware");

const {
  notFound,
  errorMiddleware,
} = require("./middleware/errorMiddleware");

// Initialize Express application
const app = express();

// Server configuration
const PORT = Number(process.env.PORT || 5001);

const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5174";

const NODE_ENV =
  process.env.NODE_ENV || "development";

// Disable Express identification header
app.disable("x-powered-by");

// ========================================
// SECURITY MIDDLEWARE
// ========================================

// Configure security headers
app.use(helmet());

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from Postman and other
      // non-browser API clients
      if (!origin || origin === CLIENT_URL) {
        return callback(null, true);
      }

      const error = new Error(
        "Request origin is not allowed"
      );

      error.code = "CORS_NOT_ALLOWED";

      return callback(error);
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
    ],

    exposedHeaders: [
      "RateLimit-Limit",
      "RateLimit-Remaining",
      "RateLimit-Reset",
      "Retry-After",
    ],
  })
);

// ========================================
// REQUEST MIDDLEWARE
// ========================================

// Parse incoming JSON requests
app.use(
  express.json({
    limit: "10kb",
  })
);

// Parse URL-encoded requests
app.use(
  express.urlencoded({
    extended: false,
    limit: "10kb",
  })
);

// Parse browser cookies
app.use(cookieParser());

// Prevent caching of API responses
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");

  next();
});

// Apply global API rate limiter
app.use("/api", apiLimiter);

// ========================================
// PUBLIC ROUTES
// ========================================

// Root API endpoint
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to SecureAuth API",
    version: "1.0.0",
    health: "/api/health",
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  const databaseConnected =
    mongoose.connection.readyState === 1;

  return res
    .status(databaseConnected ? 200 : 503)
    .json({
      success: databaseConnected,
      message: databaseConnected
        ? "SecureAuth API is running successfully."
        : "Database connection is unavailable.",

      service: "SecureAuth API",

      version: "1.0.0",

      environment: NODE_ENV,

      database: databaseConnected
        ? "Connected"
        : "Disconnected",

      uptime: Math.floor(process.uptime()),

      timestamp: new Date().toISOString(),
    });
});

// ========================================
// API ROUTES
// ========================================

// Authentication routes
app.use("/api/auth", authRoutes);

// Protected dashboard routes
app.use("/api/dashboard", dashboardRoutes);

// ========================================
// ERROR HANDLING
// ========================================

// Handle nonexistent routes
app.use(notFound);

// Centralized error handling
app.use(errorMiddleware);

// ========================================
// SERVER STARTUP
// ========================================

let server;

const startServer = async () => {
  try {
    // Connect to MongoDB Atlas
    await connectDB();

    // Ensure database indexes are initialized
    await User.init();
    await Session.init();

    // Start Express server
    server = app.listen(PORT, () => {
      console.log("");
      console.log("========================================");
      console.log("      SECUREAUTH BACKEND STARTED");
      console.log("========================================");
      console.log(`Environment : ${NODE_ENV}`);
      console.log(`Port        : ${PORT}`);
      console.log(`Backend URL : http://localhost:${PORT}`);
      console.log(`Frontend URL: ${CLIENT_URL}`);
      console.log(`Health Check: http://localhost:${PORT}/api/health`);
      console.log("========================================");
      console.log("");
    });

    // Handle server startup errors
    server.on("error", async (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT} is already in use.`
        );
      } else {
        console.error(
          "Server error:",
          error.name
        );
      }

      await mongoose.disconnect();

      process.exit(1);
    });
  } catch (error) {
    console.error(
      "Failed to start SecureAuth:",
      error.name
    );

    await mongoose.disconnect();

    process.exit(1);
  }
};

// ========================================
// GRACEFUL SHUTDOWN
// ========================================

let isShuttingDown = false;

const gracefulShutdown = async (signal) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log("");
  console.log(`${signal} received.`);
  console.log("Shutting down SecureAuth...");

  const shutdownTimeout = setTimeout(() => {
    console.error("Graceful shutdown timed out.");

    process.exit(1);
  }, 10000);

  try {
    // Stop accepting new requests
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            return reject(error);
          }

          resolve();
        });
      });
    }

    // Close MongoDB connection
    await mongoose.disconnect();

    clearTimeout(shutdownTimeout);

    console.log("MongoDB connection closed.");
    console.log("SecureAuth stopped successfully.");

    process.exit(0);
  } catch (error) {
    clearTimeout(shutdownTimeout);

    console.error(
      "Shutdown error:",
      error.name
    );

    process.exit(1);
  }
};

// Handle termination signals
process.on("SIGINT", () => {
  gracefulShutdown("SIGINT");
});

process.on("SIGTERM", () => {
  gracefulShutdown("SIGTERM");
});

// Start the application
startServer();

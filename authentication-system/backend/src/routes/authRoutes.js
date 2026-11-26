
const express = require("express");

const {
  register,
  login,
  refresh,
  getMe,
  logout,
} = require("../controllers/authController");

const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");

const validateMiddleware = require(
  "../middleware/validateMiddleware"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  loginLimiter,
  registerLimiter,
  refreshLimiter,
} = require("../middleware/rateLimitMiddleware");

const {
  issueCsrfToken,
  csrfProtection,
} = require("../middleware/csrfMiddleware");

const router = express.Router();

// ========================================
// PUBLIC ROUTES
// ========================================

// Generate CSRF token
// GET /api/auth/csrf
router.get(
  "/csrf",
  issueCsrfToken
);

// Register a new user
// POST /api/auth/register
router.post(
  "/register",
  registerLimiter,
  csrfProtection,
  registerValidator,
  validateMiddleware,
  register
);

// Login user
// POST /api/auth/login
router.post(
  "/login",
  loginLimiter,
  csrfProtection,
  loginValidator,
  validateMiddleware,
  login
);

// ========================================
// SESSION MANAGEMENT ROUTES
// ========================================

// Refresh authentication tokens
// POST /api/auth/refresh
router.post(
  "/refresh",
  refreshLimiter,
  csrfProtection,
  refresh
);

// Logout user
// POST /api/auth/logout
router.post(
  "/logout",
  csrfProtection,
  logout
);

// ========================================
// PROTECTED ROUTES
// ========================================

// Get current authenticated user
// GET /api/auth/me
router.get(
  "/me",
  authMiddleware,
  getMe
);

module.exports = router;

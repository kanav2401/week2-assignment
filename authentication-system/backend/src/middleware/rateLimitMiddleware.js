
const rateLimit = require("express-rate-limit");

// Rate limit configuration
const windowMs = Number(
  process.env.RATE_LIMIT_WINDOW_MS || 900000
);

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs,

  max: Number(
    process.env.RATE_LIMIT_MAX || 100
  ),

  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message:
        "Too many requests. Please try again later.",
    });
  },
});

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs,

  max: Number(
    process.env.LOGIN_RATE_LIMIT_MAX || 5
  ),

  standardHeaders: true,
  legacyHeaders: false,

  // Successful login attempts are not counted
  skipSuccessfulRequests: true,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message:
        "Too many failed login attempts. Please try again in 15 minutes.",
    });
  },
});

// Registration rate limiter
const registerLimiter = rateLimit({
  windowMs,

  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message:
        "Too many registration attempts. Please try again later.",
    });
  },
});

// Refresh token rate limiter
const refreshLimiter = rateLimit({
  windowMs: 60 * 1000,

  max: 15,

  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message:
        "Too many token refresh requests. Please try again later.",
    });
  },
});

module.exports = {
  apiLimiter,
  loginLimiter,
  registerLimiter,
  refreshLimiter,
};

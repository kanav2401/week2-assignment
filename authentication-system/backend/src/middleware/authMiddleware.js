
const mongoose = require("mongoose");

const User = require("../models/User");
const Session = require("../models/Session");

const {
  verifyAccessToken,
} = require("../utils/generateTokens");

const {
  ACCESS_COOKIE_NAME,
} = require("../utils/cookieOptions");

// Protect authenticated routes
const authMiddleware = async (req, res, next) => {
  try {
    // Retrieve access token from HttpOnly cookie
    const accessToken =
      req.cookies?.[ACCESS_COOKIE_NAME];

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
        code: "ACCESS_TOKEN_MISSING",
      });
    }

    let decoded;

    // Verify JWT access token
    try {
      decoded = verifyAccessToken(accessToken);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Access token has expired.",
          code: "ACCESS_TOKEN_EXPIRED",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid access token.",
        code: "INVALID_ACCESS_TOKEN",
      });
    }

    // Validate user and session IDs
    if (
      !mongoose.isObjectIdOrHexString(decoded.sub) ||
      !mongoose.isObjectIdOrHexString(decoded.sid)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
        code: "INVALID_TOKEN_PAYLOAD",
      });
    }

    // Verify that the session is still active
    const session = await Session.findOne({
      _id: decoded.sid,
      userId: decoded.sub,
      revokedAt: null,
      expiresAt: {
        $gt: new Date(),
      },
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired or invalidated. Please log in again.",
        code: "SESSION_INVALID",
      });
    }

    // Retrieve authenticated user
    const user = await User.findById(
      decoded.sub
    ).select("-password -__v");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists.",
        code: "USER_NOT_FOUND",
      });
    }

    // Attach authenticated user and session
    req.user = user;
    req.session = session;

    // Continue to protected controller
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authMiddleware;

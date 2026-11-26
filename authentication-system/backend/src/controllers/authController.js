
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Session = require("../models/Session");

const hashToken = require("../utils/hashToken");

const {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../utils/generateTokens");

const {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  setAuthCookies,
  clearAuthCookies,
  clearCsrfCookie,
} = require("../utils/cookieOptions");

// Session lifetime in milliseconds
const SESSION_MAX_AGE = Number(
  process.env.REFRESH_TOKEN_MAX_AGE || 604800000
);

// Dummy password hash to reduce login timing differences
const dummyPasswordHash = bcrypt.hashSync(
  "secureauth-dummy-password",
  Number(process.env.BCRYPT_SALT_ROUNDS || 12)
);

// Format user data safely
const formatUser = (user) => ({
  id: user._id.toString(),
  username: user.username,
  email: user.email,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// Validate token identifiers
const hasValidTokenIds = (decoded) => {
  return (
    mongoose.isObjectIdOrHexString(decoded.sub) &&
    mongoose.isObjectIdOrHexString(decoded.sid)
  );
};

// Return invalid refresh session response
const invalidSessionResponse = (res) => {
  clearAuthCookies(res);

  return res.status(401).json({
    success: false,
    message: "Session expired or invalid. Please log in again.",
    code: "SESSION_INVALID",
  });
};

// ========================================
// REGISTER USER
// POST /api/auth/register
// ========================================

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check whether email already exists
    const existingEmail = await User.findOne({
      email,
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
        code: "DUPLICATE_ENTRY",
        errors: [
          {
            field: "email",
            message: "This email is already registered.",
          },
        ],
      });
    }

    // Check whether username already exists
    const existingUsername = await User.findOne({
      username,
    });

    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "This username is already taken.",
        code: "DUPLICATE_ENTRY",
        errors: [
          {
            field: "username",
            message: "Please choose another username.",
          },
        ],
      });
    }

    // Create user
    // Password hashing is handled by User model
    const user = await User.create({
      username,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please log in.",
      user: formatUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

// ========================================
// LOGIN USER
// POST /api/auth/login
// ========================================

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Retrieve user with password hash
    const user = await User.findOne({
      email,
    }).select("+password");

    // Verify password
    const isPasswordValid = user
      ? await user.comparePassword(password)
      : await bcrypt.compare(
          password,
          dummyPasswordHash
        );

    // Return generic error for invalid credentials
    if (!user || !isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Generate a unique session ID
    const sessionId = new mongoose.Types.ObjectId();

    // Calculate session expiration
    const expiresAt = new Date(
      Date.now() + SESSION_MAX_AGE
    );

    // Generate authentication tokens
    const { accessToken, refreshToken } =
      generateTokens(user._id, sessionId);

    // Update last login time
    user.lastLogin = new Date();

    await user.save();

    // Create session in MongoDB
    await Session.create({
      _id: sessionId,
      userId: user._id,
      refreshTokenHash: hashToken(refreshToken),
      expiresAt,
    });

    // Store authentication tokens in cookies
    setAuthCookies(
      res,
      accessToken,
      refreshToken,
      Math.max(0, expiresAt.getTime() - Date.now())
    );

    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: formatUser(user),
      session: {
        id: sessionId.toString(),
        expiresAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// ========================================
// REFRESH AUTHENTICATION TOKENS
// POST /api/auth/refresh
// ========================================

const refresh = async (req, res, next) => {
  try {
    // Retrieve refresh token from cookie
    const refreshToken =
      req.cookies?.[REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      clearAuthCookies(res);

      return res.status(401).json({
        success: false,
        message: "Refresh token is missing. Please log in.",
        code: "REFRESH_TOKEN_MISSING",
      });
    }

    let decoded;

    // Verify refresh token
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return invalidSessionResponse(res);
    }

    // Validate token identifiers
    if (!hasValidTokenIds(decoded)) {
      return invalidSessionResponse(res);
    }

    // Hash incoming refresh token
    const currentTokenHash = hashToken(refreshToken);

    // Find matching active session
    const session = await Session.findOne({
      _id: decoded.sid,
      userId: decoded.sub,
      refreshTokenHash: currentTokenHash,
      revokedAt: null,
      expiresAt: {
        $gt: new Date(),
      },
    });

    if (!session) {
      return invalidSessionResponse(res);
    }

    // Verify user account still exists
    const user = await User.findById(decoded.sub);

    if (!user) {
      await Session.updateOne(
        {
          _id: session._id,
          revokedAt: null,
        },
        {
          $set: {
            revokedAt: new Date(),
          },
        }
      );

      return invalidSessionResponse(res);
    }

    // Calculate remaining session lifetime
    const remainingTime =
      session.expiresAt.getTime() - Date.now();

    const remainingSeconds = Math.floor(
      remainingTime / 1000
    );

    if (remainingSeconds <= 0) {
      return invalidSessionResponse(res);
    }

    // Generate new access and refresh tokens
    const {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    } = generateTokens(
      user._id,
      session._id,
      remainingSeconds
    );

    // Atomically rotate refresh token hash
    const updatedSession =
      await Session.findOneAndUpdate(
        {
          _id: session._id,
          userId: user._id,
          refreshTokenHash: currentTokenHash,
          revokedAt: null,
          expiresAt: {
            $gt: new Date(),
          },
        },
        {
          $set: {
            refreshTokenHash:
              hashToken(newRefreshToken),
          },
        },
        {
          new: true,
        }
      );

    // Reject if another request already rotated the token
    if (!updatedSession) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is no longer valid.",
        code: "REFRESH_TOKEN_ROTATED",
      });
    }

    // Recalculate remaining cookie lifetime
    const cookieRemainingTime =
      updatedSession.expiresAt.getTime() - Date.now();

    if (cookieRemainingTime <= 0) {
      return invalidSessionResponse(res);
    }

    // Replace old authentication cookies
    setAuthCookies(
      res,
      newAccessToken,
      newRefreshToken,
      cookieRemainingTime
    );

    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,
      message: "Authentication tokens refreshed successfully.",
      user: formatUser(user),
      session: {
        id: updatedSession._id.toString(),
        expiresAt: updatedSession.expiresAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// ========================================
// GET CURRENT AUTHENTICATED USER
// GET /api/auth/me
// ========================================

const getMe = async (req, res, next) => {
  try {
    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,
      message: "Authenticated user retrieved successfully.",
      user: formatUser(req.user),
      session: {
        id: req.session._id.toString(),
        createdAt: req.session.createdAt,
        expiresAt: req.session.expiresAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// ========================================
// LOGOUT USER
// POST /api/auth/logout
// ========================================

const logout = async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies?.[REFRESH_COOKIE_NAME];

    const accessToken =
      req.cookies?.[ACCESS_COOKIE_NAME];

    let sessionFilter = null;

    // Try to identify session using refresh token
    if (refreshToken) {
      try {
        const decoded =
          verifyRefreshToken(refreshToken);

        if (hasValidTokenIds(decoded)) {
          sessionFilter = {
            _id: decoded.sid,
            userId: decoded.sub,
            refreshTokenHash:
              hashToken(refreshToken),
          };
        }
      } catch (error) {
        // Continue to access token verification
      }
    }

    // Revoke session using refresh token
    let revokedSession = null;

    if (sessionFilter) {
      revokedSession =
        await Session.findOneAndUpdate(
          {
            ...sessionFilter,
            revokedAt: null,
          },
          {
            $set: {
              revokedAt: new Date(),
            },
          },
          {
            new: true,
          }
        );
    }

    // Fall back to valid access token if necessary
    if (!revokedSession && accessToken) {
      let decoded = null;

      try {
        decoded = verifyAccessToken(accessToken);
      } catch (error) {
        // Invalid or expired access token
      }

      if (decoded && hasValidTokenIds(decoded)) {
        await Session.updateOne(
          {
            _id: decoded.sid,
            userId: decoded.sub,
            revokedAt: null,
          },
          {
            $set: {
              revokedAt: new Date(),
            },
          }
        );
      }
    }

    // Remove authentication and CSRF cookies
    clearAuthCookies(res);
    clearCsrfCookie(res);

    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  getMe,
  logout,
};

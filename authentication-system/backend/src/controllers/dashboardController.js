
const Session = require("../models/Session");

// ========================================
// GET PROTECTED DASHBOARD DATA
// GET /api/dashboard
// ========================================

const getDashboard = async (req, res, next) => {
  try {
    // User and session provided by authMiddleware
    const user = req.user;
    const currentSession = req.session;

    const now = new Date();

    // Calculate account age in days
    const accountAgeDays = Math.max(
      0,
      Math.floor(
        (now.getTime() -
          new Date(user.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    // Retrieve active sessions
    const activeSessions = await Session.find({
      userId: user._id,
      revokedAt: null,
      expiresAt: {
        $gt: now,
      },
    })
      .select("_id createdAt updatedAt expiresAt")
      .sort({ createdAt: -1 })
      .lean();

    // Format active session information
    const formattedSessions = activeSessions.map(
      (session) => ({
        id: session._id.toString(),
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        expiresAt: session.expiresAt,
        isCurrent:
          session._id.toString() ===
          currentSession._id.toString(),
        status: "active",
      })
    );

    // Count all sessions currently stored in MongoDB
    const totalSessions = await Session.countDocuments({
      userId: user._id,
    });

    // Count revoked sessions still stored
    const revokedSessions = await Session.countDocuments({
      userId: user._id,
      revokedAt: {
        $ne: null,
      },
    });

    // Calculate remaining session lifetime
    const remainingTime = Math.max(
      0,
      currentSession.expiresAt.getTime() -
        now.getTime()
    );

    // Prevent caching of private dashboard data
    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully.",

      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },

      statistics: {
        accountAgeDays,
        activeSessions: activeSessions.length,
        totalSessions,
        revokedSessions,
        accountStatus: "active",
      },

      currentSession: {
        id: currentSession._id.toString(),
        createdAt: currentSession.createdAt,
        updatedAt: currentSession.updatedAt,
        expiresAt: currentSession.expiresAt,
        remainingTime,
        status: "active",
      },

      sessions: formattedSessions,

      security: {
        passwordHashing: "bcrypt",
        authentication: "JWT",
        tokenStorage: "HttpOnly Cookies",
        refreshTokenStorage: "SHA-256 Hash",
        csrfProtection: true,
        rateLimiting: true,
        sessionManagement: true,
        refreshTokenRotation: true,
        serverSideLogout: true,
      },

      serverTime: now.toISOString(),
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDashboard,
};

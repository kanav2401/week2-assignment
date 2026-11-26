
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Common JWT configuration
const JWT_ISSUER = "secureauth";
const JWT_AUDIENCE = "secureauth-client";

// Generate access token
const generateAccessToken = (userId, sessionId) => {
  return jwt.sign(
    {
      sub: userId.toString(),
      sid: sessionId.toString(),
      type: "access",
    },
    process.env.JWT_ACCESS_SECRET,
    {
      algorithm: "HS256",
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      jwtid: crypto.randomUUID(),
    }
  );
};

// Generate refresh token
const generateRefreshToken = (
  userId,
  sessionId,
  expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d"
) => {
  return jwt.sign(
    {
      sub: userId.toString(),
      sid: sessionId.toString(),
      type: "refresh",
    },
    process.env.JWT_REFRESH_SECRET,
    {
      algorithm: "HS256",
      expiresIn,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      jwtid: crypto.randomUUID(),
    }
  );
};

// Generate both authentication tokens
const generateTokens = (
  userId,
  sessionId,
  refreshExpiresIn
) => {
  const accessToken = generateAccessToken(
    userId,
    sessionId
  );

  const refreshToken = generateRefreshToken(
    userId,
    sessionId,
    refreshExpiresIn
  );

  return {
    accessToken,
    refreshToken,
  };
};

// Verify access token
const verifyAccessToken = (token) => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET,
    {
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }
  );

  if (
    decoded.type !== "access" ||
    !decoded.sub ||
    !decoded.sid
  ) {
    throw new Error("Invalid access token");
  }

  return decoded;
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET,
    {
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }
  );

  if (
    decoded.type !== "refresh" ||
    !decoded.sub ||
    !decoded.sid
  ) {
    throw new Error("Invalid refresh token");
  }

  return decoded;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
};

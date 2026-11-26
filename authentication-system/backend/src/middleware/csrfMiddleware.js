
const crypto = require("crypto");

const {
  CSRF_COOKIE_NAME,
  setCsrfCookie,
} = require("../utils/cookieOptions");

// Generate HMAC signature
const generateSignature = (value) => {
  const secret = process.env.CSRF_SECRET;

  if (!secret) {
    throw new Error(
      "CSRF_SECRET is missing from environment variables"
    );
  }

  return crypto
    .createHmac("sha256", secret)
    .update(value)
    .digest("hex");
};

// Safely compare two strings
const safeCompare = (first, second) => {
  if (
    typeof first !== "string" ||
    typeof second !== "string"
  ) {
    return false;
  }

  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);

  if (firstBuffer.length !== secondBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    firstBuffer,
    secondBuffer
  );
};

// Generate a signed CSRF token
const generateCsrfToken = () => {
  const randomValue = crypto
    .randomBytes(32)
    .toString("hex");

  const signature = generateSignature(randomValue);

  return `${randomValue}.${signature}`;
};

// Verify CSRF token signature
const verifyCsrfToken = (token) => {
  if (typeof token !== "string") {
    return false;
  }

  const parts = token.split(".");

  if (parts.length !== 2) {
    return false;
  }

  const [randomValue, signature] = parts;

  if (
    !/^[a-f0-9]{64}$/.test(randomValue) ||
    !/^[a-f0-9]{64}$/.test(signature)
  ) {
    return false;
  }

  const expectedSignature =
    generateSignature(randomValue);

  return safeCompare(
    signature,
    expectedSignature
  );
};

// Issue CSRF token to the frontend
const issueCsrfToken = (req, res, next) => {
  try {
    let csrfToken = req.cookies?.[CSRF_COOKIE_NAME];

    // Reuse an existing valid token
    if (!verifyCsrfToken(csrfToken)) {
      csrfToken = generateCsrfToken();
    }

    // Store token in HttpOnly cookie
    setCsrfCookie(res, csrfToken);

    // Prevent caching of the token response
    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,
      csrfToken,
    });
  } catch (error) {
    return next(error);
  }
};

// Protect state-changing requests
const csrfProtection = (req, res, next) => {
  try {
    // Skip safe HTTP methods
    const safeMethods = ["GET", "HEAD", "OPTIONS"];

    if (safeMethods.includes(req.method)) {
      return next();
    }

    // Verify request origin when provided
    const origin = req.get("Origin");

    const allowedOrigin =
      process.env.CLIENT_URL ||
      "http://localhost:5174";

    if (origin && origin !== allowedOrigin) {
      return res.status(403).json({
        success: false,
        message: "Request origin is not allowed.",
      });
    }

    // Retrieve token from cookie
    const cookieToken =
      req.cookies?.[CSRF_COOKIE_NAME];

    // Retrieve token from request header
    const headerToken =
      req.get("X-CSRF-Token");

    // Check whether both tokens exist
    if (!cookieToken || !headerToken) {
      return res.status(403).json({
        success: false,
        message: "CSRF token is missing.",
      });
    }

    // Verify token signature
    if (!verifyCsrfToken(cookieToken)) {
      return res.status(403).json({
        success: false,
        message: "Invalid CSRF token.",
      });
    }

    // Compare cookie token and header token
    if (!safeCompare(cookieToken, headerToken)) {
      return res.status(403).json({
        success: false,
        message: "CSRF token verification failed.",
      });
    }

    // CSRF verification successful
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  generateCsrfToken,
  verifyCsrfToken,
  issueCsrfToken,
  csrfProtection,
};


const ACCESS_COOKIE_NAME = "secureauth_access";
const REFRESH_COOKIE_NAME = "secureauth_refresh";
const CSRF_COOKIE_NAME = "secureauth_csrf";

// Check whether the application is running in production
const isProduction = () => {
  return process.env.NODE_ENV === "production";
};

// Common cookie configuration
const getBaseCookieOptions = () => {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
  };
};

// Access token cookie configuration
const getAccessCookieOptions = () => {
  return {
    ...getBaseCookieOptions(),

    maxAge: Number(
      process.env.ACCESS_TOKEN_MAX_AGE || 900000
    ),
  };
};

// Refresh token cookie configuration
const getRefreshCookieOptions = (remainingTime) => {
  return {
    ...getBaseCookieOptions(),

    maxAge:
      remainingTime ??
      Number(
        process.env.REFRESH_TOKEN_MAX_AGE || 604800000
      ),
  };
};

// CSRF token cookie configuration
const getCsrfCookieOptions = () => {
  return {
    ...getBaseCookieOptions(),

    maxAge: Number(
      process.env.REFRESH_TOKEN_MAX_AGE || 604800000
    ),
  };
};

// Set authentication cookies
const setAuthCookies = (
  res,
  accessToken,
  refreshToken,
  remainingTime
) => {
  res.cookie(
    ACCESS_COOKIE_NAME,
    accessToken,
    getAccessCookieOptions()
  );

  res.cookie(
    REFRESH_COOKIE_NAME,
    refreshToken,
    getRefreshCookieOptions(remainingTime)
  );
};

// Set CSRF cookie
const setCsrfCookie = (res, csrfToken) => {
  res.cookie(
    CSRF_COOKIE_NAME,
    csrfToken,
    getCsrfCookieOptions()
  );
};

// Clear authentication cookies during logout
const clearAuthCookies = (res) => {
  const options = getBaseCookieOptions();

  res.clearCookie(ACCESS_COOKIE_NAME, options);

  res.clearCookie(REFRESH_COOKIE_NAME, options);
};

// Clear CSRF cookie
const clearCsrfCookie = (res) => {
  res.clearCookie(
    CSRF_COOKIE_NAME,
    getBaseCookieOptions()
  );
};

module.exports = {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  CSRF_COOKIE_NAME,
  getBaseCookieOptions,
  getAccessCookieOptions,
  getRefreshCookieOptions,
  getCsrfCookieOptions,
  setAuthCookies,
  setCsrfCookie,
  clearAuthCookies,
  clearCsrfCookie,
};


import axios from "axios";

// ========================================
// API CONFIGURATION
// ========================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";

// Main Axios instance
const api = axios.create({
  baseURL: API_URL,

  withCredentials: true,

  timeout: 15000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Separate Axios instance for authentication utilities
// Prevents interceptor recursion
const authClient = axios.create({
  baseURL: API_URL,

  withCredentials: true,

  timeout: 15000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ========================================
// AUTHENTICATION STATE
// ========================================

// Store CSRF token in memory
let csrfToken = null;

// Prevent duplicate CSRF requests
let csrfPromise = null;

// Prevent simultaneous refresh requests
let refreshPromise = null;

// Authentication expiration event
export const AUTH_EXPIRED_EVENT =
  "secureauth:session-expired";

// ========================================
// CSRF TOKEN MANAGEMENT
// ========================================

// Retrieve CSRF token from backend
export const getCsrfToken = async () => {
  // Reuse existing token
  if (csrfToken) {
    return csrfToken;
  }

  // Reuse pending CSRF request
  if (csrfPromise) {
    return csrfPromise;
  }

  csrfPromise = authClient
    .get("/auth/csrf")
    .then((response) => {
      const token = response.data?.csrfToken;

      if (!token) {
        throw new Error(
          "Unable to retrieve CSRF token."
        );
      }

      csrfToken = token;

      return csrfToken;
    })
    .finally(() => {
      csrfPromise = null;
    });

  return csrfPromise;
};

// Clear stored CSRF token
export const clearCsrfToken = () => {
  csrfToken = null;
};

// ========================================
// SESSION EXPIRATION MANAGEMENT
// ========================================

const notifySessionExpired = () => {
  clearCsrfToken();

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(AUTH_EXPIRED_EVENT)
    );
  }
};

// ========================================
// REQUEST HELPERS
// ========================================

// Check whether request requires CSRF protection
const requiresCsrf = (method) => {
  const safeMethods = [
    "GET",
    "HEAD",
    "OPTIONS",
  ];

  return !safeMethods.includes(
    (method || "GET").toUpperCase()
  );
};

// Check whether endpoint should skip automatic refresh
const shouldSkipRefresh = (url = "") => {
  const path = url.split("?")[0];

  const excludedEndpoints = [
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
    "/auth/logout",
    "/auth/csrf",
  ];

  return excludedEndpoints.some(
    (endpoint) => path.endsWith(endpoint)
  );
};

// Check whether response indicates a CSRF error
const isCsrfError = (error) => {
  const status = error.response?.status;

  const message = String(
    error.response?.data?.message || ""
  ).toLowerCase();

  return (
    status === 403 &&
    message.includes("csrf")
  );
};

// ========================================
// AUTOMATIC TOKEN REFRESH
// ========================================

// Refresh expired authentication tokens
export const refreshAuthentication = async () => {
  // Reuse an existing refresh request
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const sendRefreshRequest = async () => {
      const token = await getCsrfToken();

      return authClient.post(
        "/auth/refresh",
        {},
        {
          headers: {
            "X-CSRF-Token": token,
          },
        }
      );
    };

    try {
      const response =
        await sendRefreshRequest();

      return response.data;
    } catch (error) {
      // Retry once with a fresh CSRF token
      if (isCsrfError(error)) {
        clearCsrfToken();

        const response =
          await sendRefreshRequest();

        return response.data;
      }

      throw error;
    }
  })()
    .catch((error) => {
      // Only expire the frontend session when
      // the backend rejects authentication
      if (error.response?.status === 401) {
        notifySessionExpired();
      }

      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

// ========================================
// REQUEST INTERCEPTOR
// ========================================

api.interceptors.request.use(
  async (config) => {
    // Automatically attach CSRF token to
    // state-changing requests
    if (requiresCsrf(config.method)) {
      const token = await getCsrfToken();

      config.headers =
        config.headers || {};

      config.headers["X-CSRF-Token"] =
        token;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ========================================
// RESPONSE INTERCEPTOR
// ========================================

api.interceptors.response.use(
  // Return successful responses normally
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Handle network errors or missing request config
    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    // ====================================
    // HANDLE CSRF TOKEN ERRORS
    // ====================================

    if (
      isCsrfError(error) &&
      requiresCsrf(originalRequest.method) &&
      !originalRequest._csrfRetry
    ) {
      originalRequest._csrfRetry = true;

      try {
        clearCsrfToken();

        const newCsrfToken =
          await getCsrfToken();

        originalRequest.headers =
          originalRequest.headers || {};

        originalRequest.headers[
          "X-CSRF-Token"
        ] = newCsrfToken;

        return api(originalRequest);
      } catch (csrfError) {
        return Promise.reject(csrfError);
      }
    }

    // ====================================
    // HANDLE EXPIRED ACCESS TOKENS
    // ====================================

    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh &&
      !shouldSkipRefresh(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        // Backend issues new HttpOnly cookies
        await refreshAuthentication();

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // Handle rejected authentication after retry
    if (
      status === 401 &&
      originalRequest._retry &&
      !shouldSkipRefresh(originalRequest.url)
    ) {
      notifySessionExpired();
    }

    return Promise.reject(error);
  }
);

// ========================================
// ERROR RESPONSE HELPERS
// ========================================

// Retrieve readable error message
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
  }

  if (
    error.code === "ERR_NETWORK" ||
    !error.response
  ) {
    return "Unable to connect to the server. Please check your connection and try again.";
  }

  return (
    error.message ||
    "Something went wrong. Please try again."
  );
};

// Retrieve field-specific validation errors
export const getFieldErrors = (error) => {
  const errors =
    error.response?.data?.errors;

  if (!Array.isArray(errors)) {
    return {};
  }

  return errors.reduce(
    (fieldErrors, item) => {
      if (item.field && item.message) {
        if (!fieldErrors[item.field]) {
          fieldErrors[item.field] =
            item.message;
        }
      }

      return fieldErrors;
    },
    {}
  );
};

// ========================================
// EXPORT AXIOS INSTANCE
// ========================================

export default api;

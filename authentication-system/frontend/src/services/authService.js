
import api, {
  clearCsrfToken,
  refreshAuthentication,
} from "./api";

// ========================================
// REGISTER USER
// ========================================

export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register",
    {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
    },
    {
      skipAuthRefresh: true,
    }
  );

  return response.data;
};

// ========================================
// LOGIN USER
// ========================================

export const loginUser = async (credentials) => {
  const response = await api.post(
    "/auth/login",
    {
      email: credentials.email,
      password: credentials.password,
    },
    {
      skipAuthRefresh: true,
    }
  );

  return response.data;
};

// ========================================
// GET CURRENT AUTHENTICATED USER
// ========================================

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

// ========================================
// REFRESH AUTHENTICATION
// ========================================

export const refreshSession = async () => {
  return await refreshAuthentication();
};

// ========================================
// LOGOUT USER
// ========================================

export const logoutUser = async () => {
  const response = await api.post(
    "/auth/logout",
    {},
    {
      skipAuthRefresh: true,
    }
  );

  // Clear CSRF token after successful logout
  clearCsrfToken();

  return response.data;
};

// ========================================
// GET PROTECTED DASHBOARD DATA
// ========================================

export const getDashboardData = async () => {
  const response = await api.get("/dashboard");

  return response.data;
};

// ========================================
// CHECK BACKEND HEALTH
// ========================================

export const checkServerHealth = async () => {
  const response = await api.get(
    "/health",
    {
      skipAuthRefresh: true,
    }
  );

  return response.data;
};

// ========================================
// EXPORT AUTHENTICATION SERVICE
// ========================================

const authService = {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshSession,
  logoutUser,
  getDashboardData,
  checkServerHealth,
};

export default authService;

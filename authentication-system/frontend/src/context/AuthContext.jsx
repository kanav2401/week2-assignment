
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

import authService from "../services/authService";

import {
  AUTH_EXPIRED_EVENT,
  clearCsrfToken,
  getErrorMessage,
} from "../services/api";

// ========================================
// CREATE AUTHENTICATION CONTEXT
// ========================================

export const AuthContext = createContext(null);

// Reuse pending authentication initialization
// requests, including React StrictMode remounts
let initializationPromise = null;

const initializeAuthentication = () => {
  if (!initializationPromise) {
    initializationPromise = authService
      .getCurrentUser()
      .finally(() => {
        initializationPromise = null;
      });
  }

  return initializationPromise;
};

// ========================================
// AUTHENTICATION PROVIDER
// ========================================

export const AuthProvider = ({ children }) => {
  // Authenticated user information
  const [user, setUser] = useState(null);

  // Current session information
  const [session, setSession] = useState(null);

  // Initial authentication loading state
  const [loading, setLoading] = useState(true);

  // Login, registration and logout loading state
  const [authLoading, setAuthLoading] =
    useState(false);

  // Global authentication error
  const [authError, setAuthError] =
    useState("");

  // Authentication initialization error
  const [initializationError, setInitializationError] =
    useState("");

  // Session expiration status
  const [sessionExpired, setSessionExpired] =
    useState(false);

  // Prevent overlapping authentication operations
  const operationInProgress = useRef(false);

  // ========================================
  // CLEAR AUTHENTICATION STATE
  // ========================================

  const clearAuthentication = useCallback(() => {
    setUser(null);
    setSession(null);

    clearCsrfToken();
  }, []);

  // ========================================
  // CLEAR AUTHENTICATION ERROR
  // ========================================

  const clearAuthError = useCallback(() => {
    setAuthError("");
  }, []);

  // ========================================
  // HANDLE SESSION EXPIRATION
  // ========================================

  useEffect(() => {
    const handleSessionExpired = () => {
      clearAuthentication();

      setSessionExpired(true);

      setAuthError(
        "Your session has expired. Please log in again."
      );
    };

    window.addEventListener(
      AUTH_EXPIRED_EVENT,
      handleSessionExpired
    );

    return () => {
      window.removeEventListener(
        AUTH_EXPIRED_EVENT,
        handleSessionExpired
      );
    };
  }, [clearAuthentication]);

  // ========================================
  // INITIALIZE AUTHENTICATION
  // ========================================

  useEffect(() => {
    let isMounted = true;

    const checkAuthentication = async () => {
      setLoading(true);
      setInitializationError("");

      try {
        const response =
          await initializeAuthentication();

        if (!isMounted) {
          return;
        }

        if (response.success && response.user) {
          setUser(response.user);

          setSession(
            response.session || null
          );

          setSessionExpired(false);
          setAuthError("");
        } else {
          clearAuthentication();
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        clearAuthentication();

        if (error.response?.status === 401) {
          // A new visitor without a session
          // should not see a session expiry error
          setSessionExpired(false);
          setAuthError("");
        } else {
          // Distinguish server/network failures
          // from normal unauthenticated visits
          setInitializationError(
            getErrorMessage(error)
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuthentication();

    return () => {
      isMounted = false;
    };
  }, [clearAuthentication]);

  // ========================================
  // REGISTER USER
  // ========================================

  const register = useCallback(async (userData) => {
    if (operationInProgress.current) {
      throw new Error(
        "An authentication request is already in progress."
      );
    }

    operationInProgress.current = true;

    setAuthLoading(true);
    setAuthError("");

    try {
      const response =
        await authService.registerUser(userData);

      // Registration does not automatically
      // authenticate the newly created user

      return response;
    } catch (error) {
      setAuthError(
        getErrorMessage(error)
      );

      throw error;
    } finally {
      operationInProgress.current = false;

      setAuthLoading(false);
    }
  }, []);

  // ========================================
  // LOGIN USER
  // ========================================

  const login = useCallback(async (credentials) => {
    if (operationInProgress.current) {
      throw new Error(
        "An authentication request is already in progress."
      );
    }

    operationInProgress.current = true;

    setAuthLoading(true);
    setAuthError("");

    try {
      const response =
        await authService.loginUser(credentials);

      if (!response.success || !response.user) {
        throw new Error(
          "Unable to complete authentication."
        );
      }

      setUser(response.user);

      setSession(
        response.session || null
      );

      setSessionExpired(false);
      setInitializationError("");
      setAuthError("");

      return response;
    } catch (error) {
      setAuthError(
        getErrorMessage(error)
      );

      throw error;
    } finally {
      operationInProgress.current = false;

      setAuthLoading(false);
    }
  }, []);

  // ========================================
  // LOGOUT USER
  // ========================================

  const logout = useCallback(async () => {
    if (operationInProgress.current) {
      throw new Error(
        "An authentication request is already in progress."
      );
    }

    operationInProgress.current = true;

    setAuthLoading(true);
    setAuthError("");

    try {
      const response =
        await authService.logoutUser();

      // Clear frontend authentication only
      // after successful server-side logout
      clearAuthentication();

      setSessionExpired(false);
      setInitializationError("");
      setAuthError("");

      return response;
    } catch (error) {
      // Do not report successful logout when
      // server-side session revocation fails
      setAuthError(
        getErrorMessage(error)
      );

      throw error;
    } finally {
      operationInProgress.current = false;

      setAuthLoading(false);
    }
  }, [clearAuthentication]);

  // ========================================
  // REFRESH USER INFORMATION
  // ========================================

  const refreshUser = useCallback(async () => {
    try {
      const response =
        await authService.getCurrentUser();

      if (response.success && response.user) {
        setUser(response.user);

        setSession(
          response.session || null
        );

        setSessionExpired(false);
        setInitializationError("");
        setAuthError("");
      }

      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthentication();

        setSessionExpired(true);
      }

      setAuthError(
        getErrorMessage(error)
      );

      throw error;
    }
  }, [clearAuthentication]);

  // ========================================
  // MANUALLY REFRESH SESSION
  // ========================================

  const refreshSession = useCallback(async () => {
    try {
      const response =
        await authService.refreshSession();

      if (response.success && response.user) {
        setUser(response.user);

        setSession((previousSession) => ({
          ...previousSession,
          ...response.session,
        }));

        setSessionExpired(false);
        setAuthError("");
      }

      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthentication();

        setSessionExpired(true);
      }

      setAuthError(
        getErrorMessage(error)
      );

      throw error;
    }
  }, [clearAuthentication]);

  // ========================================
  // RETRY AUTHENTICATION INITIALIZATION
  // ========================================

  const retryAuthentication = useCallback(async () => {
    setLoading(true);
    setInitializationError("");
    setAuthError("");

    try {
      const response =
        await initializeAuthentication();

      if (response.success && response.user) {
        setUser(response.user);

        setSession(
          response.session || null
        );

        setSessionExpired(false);
      } else {
        clearAuthentication();
      }
    } catch (error) {
      clearAuthentication();

      if (error.response?.status === 401) {
        setSessionExpired(false);
        setAuthError("");
      } else {
        setInitializationError(
          getErrorMessage(error)
        );
      }
    } finally {
      setLoading(false);
    }
  }, [clearAuthentication]);

  // ========================================
  // DISMISS SESSION EXPIRATION MESSAGE
  // ========================================

  const dismissSessionExpired = useCallback(() => {
    setSessionExpired(false);
    setAuthError("");
  }, []);

  // ========================================
  // AUTHENTICATION STATUS
  // ========================================

  const isAuthenticated = Boolean(user);

  // ========================================
  // CONTEXT VALUE
  // ========================================

  const contextValue = useMemo(
    () => ({
      // Authentication state
      user,
      session,
      loading,
      authLoading,
      authError,
      initializationError,
      sessionExpired,
      isAuthenticated,

      // Authentication operations
      register,
      login,
      logout,
      refreshUser,
      refreshSession,
      retryAuthentication,

      // Error management
      clearAuthError,
      dismissSessionExpired,
    }),
    [
      user,
      session,
      loading,
      authLoading,
      authError,
      initializationError,
      sessionExpired,
      isAuthenticated,
      register,
      login,
      logout,
      refreshUser,
      refreshSession,
      retryAuthentication,
      clearAuthError,
      dismissSessionExpired,
    ]
  );

  // ========================================
  // PROVIDE AUTHENTICATION CONTEXT
  // ========================================

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  ShieldAlert,
  RefreshCw,
  WifiOff,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

import LoadingSpinner from "./LoadingSpinner";
import Alert from "./Alert";

// ========================================
// PROTECTED ROUTE COMPONENT
// ========================================

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const {
    isAuthenticated,
    loading,
    initializationError,
    sessionExpired,
    retryAuthentication,
  } = useAuth();

  // ========================================
  // CHECK AUTHENTICATION LOADING
  // ========================================

  if (loading) {
    return (
      <LoadingSpinner
        fullPage
        size="large"
        message="Verifying your session..."
      />
    );
  }

  // ========================================
  // HANDLE SERVER CONNECTION ERROR
  // ========================================

  if (initializationError) {
    return (
      <div className="route-error-page">
        <div className="route-error-card">

          {/* Connection error icon */}
          <div className="route-error-icon">
            <WifiOff
              size={42}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </div>

          {/* Error heading */}
          <h1>Connection unavailable</h1>

          <p className="route-error-description">
            We couldn't verify your authentication
            status. Please check your connection
            and try again.
          </p>

          {/* Error message */}
          <Alert
            type="error"
            title="Authentication verification failed"
            message={initializationError}
          />

          {/* Retry authentication */}
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={retryAuthentication}
          >
            <RefreshCw size={18} />

            Try Again
          </button>

          {/* Security information */}
          <div className="route-security-note">
            <ShieldAlert
              size={17}
              aria-hidden="true"
            />

            <span>
              Protected pages remain unavailable
              until your authentication is verified.
            </span>
          </div>

        </div>
      </div>
    );
  }

  // ========================================
  // REDIRECT UNAUTHENTICATED USER
  // ========================================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,

          message: sessionExpired
            ? "Your session has expired. Please log in again."
            : "Please log in to access this page.",

          type: sessionExpired
            ? "warning"
            : "info",
        }}
      />
    );
  }

  // ========================================
  // RENDER PROTECTED CONTENT
  // ========================================

  return children ?? <Outlet />;
};

export default ProtectedRoute;

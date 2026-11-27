
import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  WifiOff,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

import LoadingSpinner from "./LoadingSpinner";
import Alert from "./Alert";

// ========================================
// PUBLIC ROUTE COMPONENT
// ========================================

const PublicRoute = ({
  children,
  restricted = true,
  redirectTo = "/dashboard",
}) => {
  const {
    isAuthenticated,
    loading,
    initializationError,
    retryAuthentication,
  } = useAuth();

  // ========================================
  // ALLOW UNRESTRICTED PUBLIC PAGES
  // ========================================

  // Pages such as Home can be accessed
  // by authenticated and unauthenticated users
  if (!restricted) {
    return children ?? <Outlet />;
  }

  // ========================================
  // CHECK AUTHENTICATION LOADING
  // ========================================

  if (loading) {
    return (
      <LoadingSpinner
        fullPage
        size="large"
        message="Checking authentication status..."
      />
    );
  }

  // ========================================
  // HANDLE AUTHENTICATION INITIALIZATION ERROR
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
          <h1>Unable to connect</h1>

          <p className="route-error-description">
            SecureAuth is currently unable to
            communicate with the authentication
            server.
          </p>

          {/* Server error message */}
          <Alert
            type="error"
            title="Connection failed"
            message={initializationError}
          />

          {/* Retry button */}
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
            <ShieldCheck
              size={17}
              aria-hidden="true"
            />

            <span>
              Authentication services will become
              available once the connection is
              restored.
            </span>
          </div>

        </div>
      </div>
    );
  }

  // ========================================
  // REDIRECT AUTHENTICATED USER
  // ========================================

  if (isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  // ========================================
  // RENDER PUBLIC CONTENT
  // ========================================

  return children ?? <Outlet />;
};

export default PublicRoute;

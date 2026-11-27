
import { Link, useNavigate } from "react-router-dom";

import {
  ShieldAlert,
  Home,
  ArrowLeft,
  LayoutDashboard,
  LogIn,
  ArrowRight,
  SearchX,
  ShieldCheck,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ========================================
// NOT FOUND PAGE COMPONENT
// ========================================

const NotFound = () => {
  const navigate = useNavigate();

  const {
    isAuthenticated,
    loading,
  } = useAuth();

  // ========================================
  // HANDLE BACK NAVIGATION
  // ========================================

  const handleGoBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(
        isAuthenticated ? "/dashboard" : "/",
        { replace: true }
      );
    }
  };

  // ========================================
  // RENDER NOT FOUND PAGE
  // ========================================

  return (
    <div className="not-found-page">

      <Navbar />

      <main className="not-found-main">

        <div className="not-found-container">

          {/* Background decorations */}

          <div
            className="not-found-decoration not-found-decoration-one"
            aria-hidden="true"
          />

          <div
            className="not-found-decoration not-found-decoration-two"
            aria-hidden="true"
          />

          {/* Error illustration */}

          <div className="not-found-illustration">

            <div className="not-found-icon">
              <ShieldAlert
                size={54}
                strokeWidth={1.5}
              />
            </div>

            <div className="not-found-error-code">
              404
            </div>

            <div className="not-found-error-label">
              <SearchX size={16} />

              PAGE NOT FOUND
            </div>
          </div>

          {/* Error information */}

          <div className="not-found-content">

            <h1>
              Oops! You've lost your way.
            </h1>

            <p>
              The page you are looking for does
              not exist, may have been moved,
              or is no longer available.
            </p>

            <p className="not-found-secondary-text">
              Don't worry. You can return to
              a valid page using the options below.
            </p>
          </div>

          {/* Navigation buttons */}

          <div className="not-found-actions">

            <Link
              to="/"
              className="btn btn-primary"
            >
              <Home size={19} />

              Back to Home
            </Link>

            <button
              type="button"
              className="btn btn-outline"
              onClick={handleGoBack}
            >
              <ArrowLeft size={19} />

              Go Back
            </button>
          </div>

          {/* Authentication-based navigation */}

          {!loading && (
            <div className="not-found-auth-link">

              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="not-found-quick-link"
                >
                  <LayoutDashboard size={19} />

                  Return to Dashboard

                  <ArrowRight size={17} />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="not-found-quick-link"
                >
                  <LogIn size={19} />

                  Sign In to Your Account

                  <ArrowRight size={17} />
                </Link>
              )}
            </div>
          )}

          {/* Security branding */}

          <div className="not-found-security-note">

            <ShieldCheck
              size={18}
              strokeWidth={1.8}
            />

            <span>
              SecureAuth — Secure Authentication Platform
            </span>
          </div>
        </div>
      </main>

      <Footer compact />

    </div>
  );
};

export default NotFound;

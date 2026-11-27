
import { LoaderCircle, ShieldCheck } from "lucide-react";

// ========================================
// LOADING SPINNER COMPONENT
// ========================================

const LoadingSpinner = ({
  size = "medium",
  message = "Loading...",
  fullPage = false,
  inline = false,
  className = "",
}) => {
  // Available spinner sizes
  const spinnerSizes = {
    small: 16,
    medium: 28,
    large: 42,
    extraLarge: 56,
  };

  const iconSize =
    spinnerSizes[size] || spinnerSizes.medium;

  // ========================================
  // INLINE LOADING SPINNER
  // ========================================

  if (inline) {
    return (
      <span
        className={`loading-inline ${className}`}
        role="status"
        aria-live="polite"
      >
        <LoaderCircle
          size={iconSize}
          className="spinner-icon"
          aria-hidden="true"
        />

        {message && (
          <span className="loading-inline-message">
            {message}
          </span>
        )}

        {!message && (
          <span className="sr-only">
            Loading
          </span>
        )}
      </span>
    );
  }

  // ========================================
  // FULL PAGE LOADING SCREEN
  // ========================================

  if (fullPage) {
    return (
      <div
        className={`loading-full-page ${className}`}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="loading-full-page-content">

          {/* SecureAuth branding */}
          <div className="loading-brand">
            <div className="loading-brand-icon">
              <ShieldCheck
                size={36}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <h2>SecureAuth</h2>

            <p>Secure Authentication Platform</p>
          </div>

          {/* Animated spinner */}
          <div className="loading-spinner-wrapper">
            <LoaderCircle
              size={iconSize}
              className="spinner-icon"
              aria-hidden="true"
            />
          </div>

          {/* Loading message */}
          <p className="loading-message">
            {message || "Loading..."}
          </p>

          <span className="loading-subtitle">
            Please wait a moment.
          </span>

          {/* Decorative loading dots */}
          <div
            className="loading-dots"
            aria-hidden="true"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>
      </div>
    );
  }

  // ========================================
  // STANDARD LOADING SPINNER
  // ========================================

  return (
    <div
      className={`loading-container loading-${size} ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <LoaderCircle
        size={iconSize}
        className="spinner-icon"
        aria-hidden="true"
      />

      {message ? (
        <p className="loading-message">
          {message}
        </p>
      ) : (
        <span className="sr-only">
          Loading
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;


import {
  CircleCheck,
  CircleX,
  TriangleAlert,
  Info,
  X,
} from "lucide-react";

// ========================================
// ALERT CONFIGURATION
// ========================================

const alertConfigurations = {
  success: {
    icon: CircleCheck,
    defaultTitle: "Success",
    className: "alert-success",
  },

  error: {
    icon: CircleX,
    defaultTitle: "Error",
    className: "alert-error",
  },

  warning: {
    icon: TriangleAlert,
    defaultTitle: "Warning",
    className: "alert-warning",
  },

  info: {
    icon: Info,
    defaultTitle: "Information",
    className: "alert-info",
  },
};

// ========================================
// ALERT COMPONENT
// ========================================

const Alert = ({
  type = "info",
  title,
  message,
  dismissible = false,
  onClose,
  className = "",
  children,
}) => {
  // Do not render an empty alert
  if (!message && !children) {
    return null;
  }

  // Retrieve alert configuration
  const configuration =
    alertConfigurations[type] ||
    alertConfigurations.info;

  // Select appropriate icon
  const Icon = configuration.icon;

  // Use custom title or default title
  const alertTitle =
    title === false
      ? null
      : title || configuration.defaultTitle;

  // Determine whether alert is dismissible
  const canDismiss =
    dismissible &&
    typeof onClose === "function";

  // Errors and warnings require immediate
  // accessibility announcements
  const isUrgent =
    type === "error" || type === "warning";

  // ========================================
  // HANDLE ALERT DISMISSAL
  // ========================================

  const handleClose = () => {
    if (canDismiss) {
      onClose();
    }
  };

  // ========================================
  // RENDER ALERT
  // ========================================

  return (
    <div
      className={`alert ${configuration.className} ${className}`}
      role={isUrgent ? "alert" : "status"}
      aria-live={isUrgent ? "assertive" : "polite"}
      aria-atomic="true"
    >
      {/* Alert icon */}
      <div className="alert-icon">
        <Icon
          size={22}
          strokeWidth={2}
          aria-hidden="true"
        />
      </div>

      {/* Alert content */}
      <div className="alert-content">

        {/* Alert title */}
        {alertTitle && (
          <h4 className="alert-title">
            {alertTitle}
          </h4>
        )}

        {/* Alert message */}
        {message && (
          <p className="alert-message">
            {message}
          </p>
        )}

        {/* Optional additional content */}
        {children && (
          <div className="alert-extra-content">
            {children}
          </div>
        )}

      </div>

      {/* Dismiss button */}
      {canDismiss && (
        <button
          type="button"
          className="alert-close-button"
          onClick={handleClose}
          aria-label="Dismiss notification"
          title="Dismiss notification"
        >
          <X
            size={18}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
};

export default Alert;


import { useEffect, useRef } from "react";

import {
  Trash2,
  AlertTriangle,
  X,
  LoaderCircle,
  AlertCircle
} from "lucide-react";

const ConfirmDialog = ({
  isOpen = false,
  employee = null,
  onConfirm,
  onCancel,
  loading = false,
  error = ""
}) => {
  const dialogRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const confirmButtonRef = useRef(null);

  // Manage focus and prevent background scrolling
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    const previouslyFocused =
      document.activeElement;

    document.body.style.overflow = "hidden";

    cancelButtonRef.current?.focus();

    return () => {
      document.body.style.overflow =
        previousOverflow;

      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen]);

  // Handle keyboard interactions
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Close dialog using Escape
      if (e.key === "Escape" && !loading) {
        e.preventDefault();

        onCancel();
      }

      // Keep keyboard focus inside the dialog
      if (e.key === "Tab") {
        const focusableElements =
          dialogRef.current?.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), [tabindex="0"]'
          );

        if (!focusableElements?.length) {
          e.preventDefault();
          dialogRef.current?.focus();
          return;
        }

        const firstElement =
          focusableElements[0];

        const lastElement =
          focusableElements[
            focusableElements.length - 1
          ];

        const focusOutsideDialog =
          !dialogRef.current?.contains(
            document.activeElement
          );

        if (focusOutsideDialog) {
          e.preventDefault();
          firstElement.focus();
        } else if (
          e.shiftKey &&
          (document.activeElement === firstElement ||
            document.activeElement === dialogRef.current)
        ) {
          e.preventDefault();
          lastElement.focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === lastElement
        ) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, loading, onCancel]);

  // Move focus when action buttons are disabled
  useEffect(() => {
    if (isOpen && loading) {
      dialogRef.current?.focus();
    }
  }, [isOpen, loading]);

  // Do not render a closed dialog
  if (!isOpen) return null;

  // Close dialog when clicking outside
  const handleOverlayClick = (e) => {
    if (
      e.target === e.currentTarget &&
      !loading
    ) {
      onCancel();
    }
  };

  return (
    <div
      className="dialog-overlay"
      onClick={handleOverlayClick}
    >
      <div
        className="confirm-dialog"
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        aria-busy={loading}
        tabIndex={-1}
      >
        {/* Close button */}
        <button
          type="button"
          className="dialog-close-btn"
          onClick={onCancel}
          disabled={loading}
          aria-label="Close confirmation dialog"
        >
          <X size={21} />
        </button>

        {/* Delete warning icon */}
        <div className="dialog-danger-icon">
          <Trash2 size={30} strokeWidth={1.8} />
        </div>

        {/* Dialog title */}
        <h2
          id="confirm-dialog-title"
          className="dialog-title"
        >
          Delete Employee?
        </h2>

        {/* Dialog description */}
        <p
          id="confirm-dialog-description"
          className="dialog-description"
        >
          Are you sure you want to delete{" "}
          <strong>
            {employee?.name || "this employee"}
          </strong>
          ? This will permanently remove the employee
          record from the system.
        </p>

        {/* Employee details */}
        {employee && (
          <div className="dialog-employee-info">
            <div className="dialog-employee-avatar">
              {(employee.name || "E")
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((word) => word.charAt(0))
                .join("")
                .toUpperCase()}
            </div>

            <div className="dialog-employee-details">
              <h4>{employee.name}</h4>

              <p>
                {employee.role} · {employee.department}
              </p>
            </div>
          </div>
        )}

        {/* Permanent deletion warning */}
        <div className="dialog-warning">
          <AlertTriangle size={18} />

          <span>
            This action cannot be undone.
          </span>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="alert alert-danger"
            role="alert"
          >
            <AlertCircle size={18} />

            <span>{error}</span>
          </div>
        )}

        {/* Dialog action buttons */}
        <div className="dialog-actions">
          <button
            type="button"
            className="btn btn-secondary"
            ref={cancelButtonRef}
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-danger"
            ref={confirmButtonRef}
            onClick={() => onConfirm(employee)}
            disabled={loading || !employee}
          >
            {loading ? (
              <>
                <LoaderCircle
                  size={18}
                  className="rotating"
                />

                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={17} />

                Delete Employee
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

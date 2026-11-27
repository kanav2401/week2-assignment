
import { useState, useId } from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  CircleAlert,
} from "lucide-react";

// ========================================
// PASSWORD INPUT COMPONENT
// ========================================

const PasswordInput = ({
  id,
  name = "password",
  label = "Password",
  value = "",
  onChange,
  onBlur,
  placeholder = "Enter your password",
  error = "",
  disabled = false,
  required = false,
  autoComplete = "current-password",
  showIcon = true,
  className = "",
  helpText = "",
}) => {
  // Password visibility state
  const [showPassword, setShowPassword] =
    useState(false);

  // Generate unique input ID
  const generatedId = useId();

  const inputId = id || generatedId;

  const errorId = `${inputId}-error`;

  const helpId = `${inputId}-help`;

  // ========================================
  // TOGGLE PASSWORD VISIBILITY
  // ========================================

  const togglePasswordVisibility = () => {
    setShowPassword((previousValue) => {
      return !previousValue;
    });
  };

  // ========================================
  // ACCESSIBILITY CONFIGURATION
  // ========================================

  const describedBy = [
    error ? errorId : null,
    helpText ? helpId : null,
  ]
    .filter(Boolean)
    .join(" ");

  // ========================================
  // RENDER PASSWORD INPUT
  // ========================================

  return (
    <div
      className={`form-group password-form-group ${className}`}
    >
      {/* Input label */}
      {label && (
        <label
          htmlFor={inputId}
          className="form-label"
        >
          {label}

          {required && (
            <span
              className="required-mark"
              aria-hidden="true"
            >
              {" "}*
            </span>
          )}
        </label>
      )}

      {/* Password input wrapper */}
      <div
        className={`password-input-wrapper ${
          error ? "input-wrapper-error" : ""
        } ${
          disabled ? "input-wrapper-disabled" : ""
        }`}
      >
        {/* Lock icon */}
        {showIcon && (
          <span className="input-icon">
            <LockKeyhole
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </span>
        )}

        {/* Password input field */}
        <input
          id={inputId}
          name={name}
          type={
            showPassword ? "text" : "password"
          }
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          spellCheck={false}
          autoCapitalize="none"
          aria-invalid={Boolean(error)}
          aria-describedby={
            describedBy || undefined
          }
          className={`form-input password-input ${
            showIcon ? "input-with-icon" : ""
          } ${
            error ? "input-error" : ""
          }`}
        />

        {/* Password visibility button */}
        <button
          type="button"
          className="password-toggle-button"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
          title={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        >
          {showPassword ? (
            <EyeOff
              size={20}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          ) : (
            <Eye
              size={20}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      {/* Optional help text */}
      {helpText && (
        <p
          id={helpId}
          className="form-help-text"
        >
          {helpText}
        </p>
      )}

      {/* Validation error */}
      {error && (
        <div
          id={errorId}
          className="form-error"
          role="alert"
        >
          <CircleAlert
            size={15}
            aria-hidden="true"
          />

          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;

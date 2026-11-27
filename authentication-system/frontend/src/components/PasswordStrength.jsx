
import {
  CircleCheck,
  Circle,
  CircleX,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

import {
  calculatePasswordStrength,
  getPasswordByteLength,
} from "../utils/validation";

// ========================================
// PASSWORD REQUIREMENT ITEM
// ========================================

const RequirementItem = ({
  label,
  satisfied,
  invalid = false,
}) => {
  const Icon = satisfied
    ? CircleCheck
    : invalid
    ? CircleX
    : Circle;

  return (
    <li
      className={`password-requirement ${
        satisfied
          ? "requirement-satisfied"
          : invalid
          ? "requirement-invalid"
          : "requirement-pending"
      }`}
    >
      <Icon
        size={16}
        strokeWidth={2}
        aria-hidden="true"
      />

      <span>{label}</span>

      <span className="sr-only">
        {satisfied
          ? "Requirement satisfied"
          : "Requirement not satisfied"}
      </span>
    </li>
  );
};

// ========================================
// PASSWORD STRENGTH COMPONENT
// ========================================

const PasswordStrength = ({
  password = "",
  showRequirements = true,
  showByteCount = true,
  className = "",
}) => {
  // Calculate current password strength
  const strength =
    calculatePasswordStrength(password);

  const {
    score,
    percentage,
    label,
    color,
    requirements,
  } = strength;

  // Calculate UTF-8 password byte length
  const byteLength =
    getPasswordByteLength(password);

  // Check whether all requirements are satisfied
  const allRequirementsSatisfied =
    Object.values(requirements).every(Boolean);

  // ========================================
  // PASSWORD REQUIREMENTS CONFIGURATION
  // ========================================

  const requirementItems = [
    {
      id: "minLength",
      label: "At least 8 characters",
      satisfied: requirements.minLength,
    },

    {
      id: "uppercase",
      label: "At least one uppercase letter",
      satisfied: requirements.uppercase,
    },

    {
      id: "lowercase",
      label: "At least one lowercase letter",
      satisfied: requirements.lowercase,
    },

    {
      id: "number",
      label: "At least one number",
      satisfied: requirements.number,
    },

    {
      id: "specialCharacter",
      label: "At least one special character",
      satisfied: requirements.specialCharacter,
    },

    {
      id: "validByteLength",
      label: "Maximum 72 bytes",
      satisfied: requirements.validByteLength,
      invalid: !requirements.validByteLength,
    },
  ];

  // ========================================
  // RENDER PASSWORD STRENGTH
  // ========================================

  return (
    <div
      className={`password-strength-container ${className}`}
    >
      {/* Password strength heading */}
      <div className="password-strength-header">
        <span className="password-strength-title">
          Password strength
        </span>

        <span
          className="password-strength-label"
          style={{
            color: password ? color : undefined,
          }}
          aria-live="polite"
        >
          {password ? label : "Not entered"}
        </span>
      </div>

      {/* Five-segment strength progress bar */}
      <div
        className="password-strength-meter"
        role="meter"
        aria-label="Password strength"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        aria-valuetext={
          password ? label : "Not entered"
        }
      >
        {[1, 2, 3, 4, 5].map((segment) => (
          <div
            key={segment}
            className={`strength-segment ${
              segment <= score
                ? "strength-segment-active"
                : ""
            }`}
            style={{
              backgroundColor:
                segment <= score
                  ? color
                  : undefined,
            }}
          />
        ))}
      </div>

      {/* Password requirements */}
      {showRequirements && (
        <div className="password-requirements">
          <h4 className="password-requirements-title">
            Password requirements
          </h4>

          <ul className="password-requirements-list">
            {requirementItems.map((requirement) => (
              <RequirementItem
                key={requirement.id}
                label={requirement.label}
                satisfied={requirement.satisfied}
                invalid={requirement.invalid}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Password byte count */}
      {showByteCount && (
        <div
          className={`password-byte-count ${
            byteLength > 72
              ? "password-byte-limit-exceeded"
              : ""
          }`}
        >
          <span>Password size</span>

          <span>{byteLength}/72 bytes</span>
        </div>
      )}

      {/* Password requirements satisfied */}
      {password && allRequirementsSatisfied && (
        <div
          className="password-strength-success"
          role="status"
        >
          <ShieldCheck
            size={18}
            aria-hidden="true"
          />

          <span>
            Your password meets all requirements.
          </span>
        </div>
      )}

      {/* Password exceeds bcrypt byte limit */}
      {byteLength > 72 && (
        <div
          className="password-strength-error"
          role="alert"
        >
          <ShieldAlert
            size={18}
            aria-hidden="true"
          />

          <span>
            Password cannot exceed 72 bytes.
            Please shorten your password.
          </span>
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;

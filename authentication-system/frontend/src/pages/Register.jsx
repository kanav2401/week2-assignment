
import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  UserRound,
  Mail,
  CircleAlert,
  ArrowRight,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import PasswordStrength from "../components/PasswordStrength";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";

import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRegisterForm,
  hasErrors,
} from "../utils/validation";

import {
  getErrorMessage,
  getFieldErrors,
} from "../services/api";

// ========================================
// INITIAL FORM STATE
// ========================================

const initialFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

// ========================================
// REGISTER PAGE COMPONENT
// ========================================

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    authLoading,
    clearAuthError,
  } = useAuth();

  // ========================================
  // FORM STATE
  // ========================================

  const [formData, setFormData] =
    useState(initialFormData);

  const [errors, setErrors] =
    useState({});

  const [touched, setTouched] =
    useState({});

  const [serverError, setServerError] =
    useState("");

  // ========================================
  // VALIDATE INDIVIDUAL FIELD
  // ========================================

  const validateField = (
    name,
    value,
    currentFormData
  ) => {
    switch (name) {
      case "username":
        return validateUsername(value);

      case "email":
        return validateEmail(value);

      case "password":
        return validatePassword(value);

      case "confirmPassword":
        return validateConfirmPassword(
          currentFormData.password,
          value
        );

      default:
        return "";
    }
  };

  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    // Clear previous server errors
    setServerError("");
    clearAuthError();

    // Validate fields that have been interacted with
    setErrors((previousErrors) => {
      const updatedErrors = {
        ...previousErrors,
      };

      if (touched[name] || previousErrors[name]) {
        updatedErrors[name] = validateField(
          name,
          value,
          updatedFormData
        );
      }

      // Revalidate confirm password when
      // the original password changes
      if (
        name === "password" &&
        (
          touched.confirmPassword ||
          updatedFormData.confirmPassword
        )
      ) {
        updatedErrors.confirmPassword =
          validateConfirmPassword(
            updatedFormData.password,
            updatedFormData.confirmPassword
          );
      }

      return updatedErrors;
    });
  };

  // ========================================
  // HANDLE INPUT BLUR
  // ========================================

  const handleBlur = (event) => {
    const { name, value } = event.target;

    setTouched((previousTouched) => ({
      ...previousTouched,
      [name]: true,
    }));

    const fieldError = validateField(
      name,
      value,
      formData
    );

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: fieldError,
    }));
  };

  // ========================================
  // HANDLE REGISTRATION SUBMISSION
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (authLoading) {
      return;
    }

    setServerError("");
    clearAuthError();

    // Mark all fields as touched
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate complete registration form
    const validationErrors =
      validateRegisterForm(formData);

    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      return;
    }

    try {
      // Send registration request to backend
      const response = await register({
        username:
          formData.username.trim().toLowerCase(),

        email:
          formData.email.trim().toLowerCase(),

        password:
          formData.password,

        confirmPassword:
          formData.confirmPassword,
      });

      if (!response.success) {
        setServerError(
          response.message ||
            "Registration failed. Please try again."
        );

        return;
      }

      // Preserve email for login form
      const registeredEmail =
        formData.email.trim().toLowerCase();

      // Clear sensitive form information
      setFormData(initialFormData);
      setErrors({});
      setTouched({});

      // Redirect user to login page
      navigate("/login", {
        replace: true,
        state: {
          message:
            response.message ||
            "Your account has been created successfully. Please sign in.",

          type: "success",

          email: registeredEmail,

          registered: true,
        },
      });
    } catch (error) {
      // Retrieve backend field validation errors
      const fieldErrors =
        getFieldErrors(error) || {};

      if (Object.keys(fieldErrors).length > 0) {
        setErrors((previousErrors) => ({
          ...previousErrors,
          ...fieldErrors,
        }));
      }

      // Display backend error message
      setServerError(
        getErrorMessage(error)
      );
    }
  };

  // ========================================
  // DISMISS SERVER ERROR
  // ========================================

  const dismissServerError = () => {
    setServerError("");
    clearAuthError();
  };

  // ========================================
  // RENDER REGISTRATION PAGE
  // ========================================

  return (
    <AuthLayout
      type="register"
      title="Create your account"
      subtitle="Join SecureAuth and experience modern authentication."
      bottomText="Already have an account?"
      bottomLinkText="Sign In"
      bottomLinkTo="/login"
    >
      {/* =================================
          SERVER ERROR ALERT
      ================================= */}

      {serverError && (
        <Alert
          type="error"
          title="Registration failed"
          message={serverError}
          dismissible
          onClose={dismissServerError}
          className="auth-alert"
        />
      )}

      {/* =================================
          REGISTRATION FORM
      ================================= */}

      <form
        className="auth-form register-form"
        onSubmit={handleSubmit}
        noValidate
        aria-busy={authLoading}
      >
        {/* =================================
            USERNAME FIELD
        ================================= */}

        <div className="form-group">

          <label
            htmlFor="register-username"
            className="form-label"
          >
            Username

            <span
              className="required-mark"
              aria-hidden="true"
            >
              {" "}*
            </span>
          </label>

          <div
            className={`input-wrapper ${
              errors.username
                ? "input-wrapper-error"
                : ""
            }`}
          >
            <span className="input-icon">
              <UserRound
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <input
              id="register-username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={30}
              disabled={authLoading}
              required
              aria-invalid={
                Boolean(errors.username)
              }
              aria-describedby={
                errors.username
                  ? "register-username-error"
                  : "register-username-help"
              }
              className={`form-input input-with-icon ${
                errors.username
                  ? "input-error"
                  : ""
              }`}
            />
          </div>

          {errors.username ? (
            <div
              id="register-username-error"
              className="form-error"
              role="alert"
            >
              <CircleAlert
                size={15}
                aria-hidden="true"
              />

              <span>
                {errors.username}
              </span>
            </div>
          ) : (
            <p
              id="register-username-help"
              className="form-help-text"
            >
              3–30 characters. Letters, numbers
              and underscores only.
            </p>
          )}
        </div>

        {/* =================================
            EMAIL FIELD
        ================================= */}

        <div className="form-group">

          <label
            htmlFor="register-email"
            className="form-label"
          >
            Email Address

            <span
              className="required-mark"
              aria-hidden="true"
            >
              {" "}*
            </span>
          </label>

          <div
            className={`input-wrapper ${
              errors.email
                ? "input-wrapper-error"
                : ""
            }`}
          >
            <span className="input-icon">
              <Mail
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <input
              id="register-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email address"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={254}
              disabled={authLoading}
              required
              aria-invalid={
                Boolean(errors.email)
              }
              aria-describedby={
                errors.email
                  ? "register-email-error"
                  : undefined
              }
              className={`form-input input-with-icon ${
                errors.email
                  ? "input-error"
                  : ""
              }`}
            />
          </div>

          {errors.email && (
            <div
              id="register-email-error"
              className="form-error"
              role="alert"
            >
              <CircleAlert
                size={15}
                aria-hidden="true"
              />

              <span>
                {errors.email}
              </span>
            </div>
          )}
        </div>

        {/* =================================
            PASSWORD FIELD
        ================================= */}

        <PasswordInput
          id="register-password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Create a strong password"
          error={errors.password}
          autoComplete="new-password"
          disabled={authLoading}
          required
        />

        {/* =================================
            PASSWORD STRENGTH INDICATOR
        ================================= */}

        <PasswordStrength
          password={formData.password}
          showRequirements={true}
          showByteCount={true}
        />

        {/* =================================
            CONFIRM PASSWORD FIELD
        ================================= */}

        <PasswordInput
          id="register-confirm-password"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
          autoComplete="new-password"
          disabled={authLoading}
          required
        />

        {/* =================================
            PASSWORD MATCH INDICATOR
        ================================= */}

        {formData.confirmPassword &&
          formData.password ===
            formData.confirmPassword &&
          !errors.confirmPassword && (
            <div
              className="password-match-success"
              role="status"
            >
              <ShieldCheck
                size={17}
                aria-hidden="true"
              />

              <span>
                Passwords match successfully.
              </span>
            </div>
          )}

        {/* =================================
            SECURITY INFORMATION
        ================================= */}

        <div className="auth-security-notice">
          <ShieldCheck
            size={21}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <p>
            Your password will be securely hashed
            using bcrypt before being stored in
            our database.
          </p>
        </div>

        {/* =================================
            REGISTRATION BUTTON
        ================================= */}

        <button
          type="submit"
          className="btn btn-primary btn-block auth-submit-button"
          disabled={authLoading}
        >
          {authLoading ? (
            <LoadingSpinner
              inline
              size="small"
              message="Creating your account..."
            />
          ) : (
            <>
              <UserPlus
                size={20}
                aria-hidden="true"
              />

              <span>Create Account</span>

              <ArrowRight
                size={19}
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;

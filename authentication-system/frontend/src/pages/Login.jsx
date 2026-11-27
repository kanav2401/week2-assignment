
import {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Mail,
  CircleAlert,
  LogIn,
  ArrowRight,
  ShieldCheck,
  LockKeyhole,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";

import {
  validateLoginForm,
  hasErrors,
} from "../utils/validation";

import {
  getErrorMessage,
  getFieldErrors,
} from "../services/api";

// ========================================
// SAFE REDIRECT DESTINATION
// ========================================

const getRedirectDestination = (from) => {
  const allowedPaths = [
    "/dashboard",
    "/profile",
  ];

  // Support a string destination
  if (typeof from === "string") {
    return allowedPaths.includes(from)
      ? from
      : "/dashboard";
  }

  // Support React Router location object
  if (
    from &&
    typeof from === "object" &&
    allowedPaths.includes(from.pathname)
  ) {
    return {
      pathname: from.pathname,

      search:
        typeof from.search === "string" &&
        from.search.startsWith("?")
          ? from.search
          : "",

      hash:
        typeof from.hash === "string" &&
        from.hash.startsWith("#")
          ? from.hash
          : "",
    };
  }

  // Default redirect destination
  return "/dashboard";
};

// ========================================
// LOGIN PAGE COMPONENT
// ========================================

const Login = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const {
    login,
    authLoading,
    sessionExpired,
    dismissSessionExpired,
    clearAuthError,
  } = useAuth();

  // ========================================
  // FORM STATE
  // ========================================

  const [formData, setFormData] = useState({
    email:
      typeof location.state?.email === "string"
        ? location.state.email
        : "",

    password: "",
  });

  const [errors, setErrors] =
    useState({});

  const [touched, setTouched] =
    useState({});

  const [serverError, setServerError] =
    useState("");

  // ========================================
  // NAVIGATION NOTIFICATION STATE
  // ========================================

  const [notification, setNotification] =
    useState(() => {
      if (location.state?.message) {
        return {
          type:
            location.state.type || "info",

          message:
            location.state.message,
        };
      }

      return null;
    });

  // Preserve the requested protected route
  const [redirectDestination] = useState(() =>
    getRedirectDestination(
      location.state?.from
    )
  );

  // ========================================
  // CLEAR TEMPORARY NAVIGATION STATE
  // ========================================

  useEffect(() => {
    if (location.state) {
      navigate(
        {
          pathname: location.pathname,
          search: location.search,
          hash: location.hash,
        },
        {
          replace: true,
          state: null,
        }
      );
    }
  }, [
    location.state,
    location.pathname,
    location.search,
    location.hash,
    navigate,
  ]);

  // ========================================
  // HANDLE SESSION EXPIRATION
  // ========================================

  useEffect(() => {
    if (sessionExpired) {
      setNotification({
        type: "warning",

        message:
          "Your session has expired. Please sign in again.",
      });
    }
  }, [sessionExpired]);

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

    setServerError("");
    clearAuthError();

    // Revalidate previously interacted fields
    if (touched[name] || errors[name]) {
      const validationErrors =
        validateLoginForm(updatedFormData);

      setErrors((previousErrors) => ({
        ...previousErrors,

        [name]:
          validationErrors[name] || "",
      }));
    }
  };

  // ========================================
  // HANDLE INPUT BLUR
  // ========================================

  const handleBlur = (event) => {
    const { name } = event.target;

    setTouched((previousTouched) => ({
      ...previousTouched,
      [name]: true,
    }));

    const validationErrors =
      validateLoginForm(formData);

    setErrors((previousErrors) => ({
      ...previousErrors,

      [name]:
        validationErrors[name] || "",
    }));
  };

  // ========================================
  // DISMISS NAVIGATION NOTIFICATION
  // ========================================

  const dismissNotification = () => {
    setNotification(null);

    if (sessionExpired) {
      dismissSessionExpired();
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
  // HANDLE LOGIN SUBMISSION
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (authLoading) {
      return;
    }

    setServerError("");
    setNotification(null);
    clearAuthError();

    // Clear expired session notification
    if (sessionExpired) {
      dismissSessionExpired();
    }

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    // Validate complete login form
    const validationErrors =
      validateLoginForm(formData);

    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      return;
    }

    try {
      // Authenticate user through AuthContext
      const response = await login({
        email:
          formData.email.trim().toLowerCase(),

        password:
          formData.password,
      });

      if (!response.success) {
        setServerError(
          response.message ||
            "Unable to sign in. Please try again."
        );

        return;
      }

      // Clear sensitive password information
      setFormData((previousFormData) => ({
        ...previousFormData,
        password: "",
      }));

      setErrors({});

      // Redirect to originally requested page
      navigate(redirectDestination, {
        replace: true,
        state: {
          message:
            response.message ||
            "You have signed in successfully.",

          type: "success",
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

      // Display backend authentication error
      setServerError(
        getErrorMessage(error)
      );

      // Clear password after invalid credentials
      if (error.response?.status === 401) {
        setFormData((previousFormData) => ({
          ...previousFormData,
          password: "",
        }));
      }
    }
  };

  // ========================================
  // NOTIFICATION TITLE
  // ========================================

  const getNotificationTitle = (type) => {
    switch (type) {
      case "success":
        return "Success";

      case "warning":
        return "Session Notice";

      case "error":
        return "Authentication Error";

      default:
        return "Authentication Required";
    }
  };

  // ========================================
  // RENDER LOGIN PAGE
  // ========================================

  return (
    <AuthLayout
      type="login"
      title="Welcome back"
      subtitle="Enter your credentials to access your SecureAuth account."
      bottomText="Don't have an account?"
      bottomLinkText="Create an account"
      bottomLinkTo="/register"
    >
      {/* =================================
          REGISTRATION / SESSION NOTIFICATION
      ================================= */}

      {notification && (
        <Alert
          type={notification.type}
          title={getNotificationTitle(
            notification.type
          )}
          message={notification.message}
          dismissible
          onClose={dismissNotification}
          className="auth-alert"
        />
      )}

      {/* =================================
          SERVER ERROR ALERT
      ================================= */}

      {serverError && (
        <Alert
          type="error"
          title="Sign in failed"
          message={serverError}
          dismissible
          onClose={dismissServerError}
          className="auth-alert"
        />
      )}

      {/* =================================
          LOGIN FORM
      ================================= */}

      <form
        className="auth-form login-form"
        onSubmit={handleSubmit}
        noValidate
        aria-busy={authLoading}
      >
        {/* =================================
            EMAIL FIELD
        ================================= */}

        <div className="form-group">

          <label
            htmlFor="login-email"
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
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email address"
              autoComplete="username"
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
                  ? "login-email-error"
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
              id="login-email-error"
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
          id="login-password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your password"
          error={errors.password}
          autoComplete="current-password"
          disabled={authLoading}
          required
        />

        {/* =================================
            SESSION INFORMATION
        ================================= */}

        <div className="login-session-info">
          <div className="login-session-icon">
            <ShieldCheck
              size={21}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <div className="login-session-content">
            <strong>
              Secure session management
            </strong>

            <p>
              Your session is managed using
              HttpOnly cookies and automatic
              token renewal while it remains valid.
            </p>
          </div>
        </div>

        {/* =================================
            LOGIN BUTTON
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
              message="Signing in..."
            />
          ) : (
            <>
              <LogIn
                size={20}
                aria-hidden="true"
              />

              <span>Sign In</span>

              <ArrowRight
                size={19}
                aria-hidden="true"
              />
            </>
          )}
        </button>

        {/* =================================
            AUTHENTICATION SECURITY NOTE
        ================================= */}

        <div className="login-security-note">
          <LockKeyhole
            size={15}
            aria-hidden="true"
          />

          <span>
            Authentication tokens are stored
            in HttpOnly cookies.
          </span>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;

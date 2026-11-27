
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ShieldCheck,
  LockKeyhole,
  Fingerprint,
  RefreshCw,
  Database,
  CheckCircle2,
  Shield,
} from "lucide-react";

// ========================================
// SECURITY FEATURES
// ========================================

const securityFeatures = [
  {
    id: "password-security",
    icon: LockKeyhole,
    title: "Secure Password Storage",
    description:
      "Passwords are protected using bcrypt hashing.",
  },
  {
    id: "jwt-authentication",
    icon: Fingerprint,
    title: "JWT Authentication",
    description:
      "Token-based authentication with protected access.",
  },
  {
    id: "session-management",
    icon: RefreshCw,
    title: "Smart Session Management",
    description:
      "Automatic token renewal and server-side logout.",
  },
  {
    id: "data-protection",
    icon: Database,
    title: "Protected Account Data",
    description:
      "Authentication credentials remain in HttpOnly cookies.",
  },
];

// ========================================
// AUTHENTICATION LAYOUT COMPONENT
// ========================================

const AuthLayout = ({
  children,
  title,
  subtitle,
  type = "login",
  bottomText,
  bottomLinkText,
  bottomLinkTo,
  className = "",
}) => {
  const isRegister = type === "register";

  const currentYear =
    new Date().getFullYear();

  // ========================================
  // RENDER AUTHENTICATION LAYOUT
  // ========================================

  return (
    <main
      className={`auth-layout auth-layout-${type} ${className}`}
    >
      {/* =================================
          LEFT BRANDING PANEL
      ================================= */}

      <aside className="auth-brand-panel">

        {/* Decorative background elements */}
        <div
          className="auth-decoration auth-decoration-one"
          aria-hidden="true"
        />

        <div
          className="auth-decoration auth-decoration-two"
          aria-hidden="true"
        />

        <div
          className="auth-decoration auth-decoration-three"
          aria-hidden="true"
        />

        <div className="auth-brand-content">

          {/* Application branding */}
          <Link
            to="/"
            className="auth-brand-logo"
            aria-label="SecureAuth home"
          >
            <img
              src="/secureauth.svg"
              alt=""
              width="48"
              height="48"
            />

            <span>
              Secure<span>Auth</span>
            </span>
          </Link>

          {/* Main branding content */}
          <div className="auth-brand-main">

            <div className="auth-brand-badge">
              <ShieldCheck
                size={17}
                aria-hidden="true"
              />

              <span>
                Security-focused authentication
              </span>
            </div>

            <h1 className="auth-brand-heading">
              {isRegister ? (
                <>
                  Your secure journey
                  <span> starts here.</span>
                </>
              ) : (
                <>
                  Welcome back to
                  <span> secure access.</span>
                </>
              )}
            </h1>

            <p className="auth-brand-description">
              {isRegister
                ? "Create your SecureAuth account and experience modern authentication with protected access and intelligent session management."
                : "Access your personal dashboard with secure authentication designed to protect your identity and account information."}
            </p>

            {/* Security feature highlights */}
            <div className="auth-security-features">
              {securityFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.id}
                    className="auth-security-feature"
                  >
                    <div className="auth-feature-icon">
                      <Icon
                        size={22}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="auth-feature-text">
                      <h3>{feature.title}</h3>

                      <p>{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Security summary */}
            <div className="auth-brand-security-note">
              <Shield
                size={24}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <div>
                <strong>
                  Your identity. Protected.
                </strong>

                <p>
                  Built with security and simplicity
                  in mind.
                </p>
              </div>
            </div>
          </div>

          {/* Branding panel footer */}
          <div className="auth-brand-footer">
            <span>
              &copy; {currentYear} SecureAuth
            </span>

            <span className="auth-brand-footer-divider" />

            <span>MERN Stack Application</span>
          </div>
        </div>
      </aside>

      {/* =================================
          RIGHT AUTHENTICATION PANEL
      ================================= */}

      <section className="auth-form-panel">

        {/* Top navigation */}
        <div className="auth-form-topbar">

          <Link
            to="/"
            className="auth-back-link"
          >
            <ArrowLeft
              size={18}
              aria-hidden="true"
            />

            <span>Back to Home</span>
          </Link>

          {/* Mobile application logo */}
          <Link
            to="/"
            className="auth-mobile-brand"
            aria-label="SecureAuth home"
          >
            <img
              src="/secureauth.svg"
              alt=""
              width="34"
              height="34"
            />

            <span>SecureAuth</span>
          </Link>
        </div>

        {/* =================================
            AUTHENTICATION FORM CONTAINER
        ================================= */}

        <div className="auth-form-container">

          <div className="auth-form-card">

            {/* Authentication heading */}
            <div className="auth-form-header">

              <div className="auth-form-icon">
                {isRegister ? (
                  <ShieldCheck
                    size={32}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                ) : (
                  <LockKeyhole
                    size={32}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                )}
              </div>

              <h2 className="auth-form-title">
                {title ||
                  (isRegister
                    ? "Create your account"
                    : "Welcome back")}
              </h2>

              <p className="auth-form-subtitle">
                {subtitle ||
                  (isRegister
                    ? "Enter your details to get started."
                    : "Enter your credentials to access your account.")}
              </p>
            </div>

            {/* Login or registration form */}
            <div className="auth-form-body">
              {children}
            </div>

            {/* Switch between login and register */}
            {bottomText &&
              bottomLinkText &&
              bottomLinkTo && (
                <div className="auth-form-bottom">
                  <span>{bottomText}</span>

                  <Link
                    to={bottomLinkTo}
                    className="auth-switch-link"
                  >
                    {bottomLinkText}
                  </Link>
                </div>
              )}
          </div>

          {/* Authentication security information */}
          <div className="auth-form-security">

            <div className="auth-form-security-item">
              <CheckCircle2
                size={15}
                aria-hidden="true"
              />

              <span>Password hashing</span>
            </div>

            <div className="auth-form-security-item">
              <CheckCircle2
                size={15}
                aria-hidden="true"
              />

              <span>Protected sessions</span>
            </div>

            <div className="auth-form-security-item">
              <CheckCircle2
                size={15}
                aria-hidden="true"
              />

              <span>HttpOnly cookies</span>
            </div>
          </div>
        </div>

        {/* Right panel footer */}
        <div className="auth-form-footer">
          <ShieldCheck
            size={16}
            aria-hidden="true"
          />

          <span>
            SecureAuth — Your identity. Protected.
          </span>
        </div>
      </section>
    </main>
  );
};

export default AuthLayout;

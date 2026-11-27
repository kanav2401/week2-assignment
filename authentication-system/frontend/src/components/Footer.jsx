
import { Link } from "react-router-dom";

import {
  ShieldCheck,
  LockKeyhole,
  Fingerprint,
  Database,
  Code2,
  Server,
  ArrowUpRight,
  Heart,
  Layers,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

// ========================================
// SECURITY FEATURES
// ========================================

const securityFeatures = [
  {
    id: "password-hashing",
    icon: LockKeyhole,
    label: "bcrypt Password Hashing",
  },
  {
    id: "jwt-authentication",
    icon: Fingerprint,
    label: "JWT Authentication",
  },
  {
    id: "cookie-storage",
    icon: ShieldCheck,
    label: "HttpOnly Cookies",
  },
  {
    id: "session-management",
    icon: Database,
    label: "Secure Session Management",
  },
];

// ========================================
// TECHNOLOGY STACK
// ========================================

const technologies = [
  {
    id: "react",
    icon: Code2,
    label: "React.js",
  },
  {
    id: "node",
    icon: Server,
    label: "Node.js",
  },
  {
    id: "express",
    icon: Layers,
    label: "Express.js",
  },
  {
    id: "mongodb",
    icon: Database,
    label: "MongoDB",
  },
];

// ========================================
// FOOTER COMPONENT
// ========================================

const Footer = ({ compact = false }) => {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  // Application version
  const appVersion =
    import.meta.env.VITE_APP_VERSION ||
    "1.0.0";

  // Dynamic copyright year
  const currentYear =
    new Date().getFullYear();

  // ========================================
  // NAVIGATION LINKS
  // ========================================

  const navigationLinks = [
    {
      label: "Home",
      path: "/",
    },
  ];

  if (!loading) {
    if (isAuthenticated) {
      navigationLinks.push(
        {
          label: "Dashboard",
          path: "/dashboard",
        },
        {
          label: "My Profile",
          path: "/profile",
        }
      );
    } else {
      navigationLinks.push(
        {
          label: "Sign In",
          path: "/login",
        },
        {
          label: "Create Account",
          path: "/register",
        }
      );
    }
  }

  // ========================================
  // COMPACT FOOTER
  // ========================================

  if (compact) {
    return (
      <footer className="footer footer-compact">
        <div className="footer-compact-container">

          <Link
            to="/"
            className="footer-compact-brand"
          >
            <img
              src="/secureauth.svg"
              alt=""
              width="26"
              height="26"
            />

            <span>SecureAuth</span>
          </Link>

          <p className="footer-compact-copyright">
            &copy; {currentYear} SecureAuth.
            All rights reserved.
          </p>

          <div className="footer-compact-security">
            <ShieldCheck
              size={16}
              aria-hidden="true"
            />

            <span>
              Security-focused authentication
            </span>
          </div>
        </div>
      </footer>
    );
  }

  // ========================================
  // FULL FOOTER
  // ========================================

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* =================================
            MAIN FOOTER CONTENT
        ================================= */}

        <div className="footer-main">

          {/* =================================
              BRAND INFORMATION
          ================================= */}

          <div className="footer-brand-section">

            <Link
              to="/"
              className="footer-brand"
              aria-label="SecureAuth home"
            >
              <img
                src="/secureauth.svg"
                alt=""
                className="footer-logo"
                width="42"
                height="42"
              />

              <span className="footer-brand-name">
                Secure<span>Auth</span>
              </span>
            </Link>

            <p className="footer-tagline">
              Your identity. Protected.
            </p>

            <p className="footer-description">
              A modern authentication platform
              designed to demonstrate secure user
              registration, authentication, protected
              access and session management using
              the MERN stack.
            </p>

            <div className="footer-security-badge">
              <ShieldCheck
                size={18}
                aria-hidden="true"
              />

              <span>
                Built with security in mind
              </span>
            </div>
          </div>

          {/* =================================
              QUICK NAVIGATION
          ================================= */}

          <div className="footer-column">

            <h3 className="footer-heading">
              Quick Links
            </h3>

            <nav aria-label="Footer navigation">
              <ul className="footer-links">
                {navigationLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="footer-link"
                    >
                      <span>{link.label}</span>

                      <ArrowUpRight
                        size={14}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* =================================
              SECURITY FEATURES
          ================================= */}

          <div className="footer-column">

            <h3 className="footer-heading">
              Security
            </h3>

            <ul className="footer-feature-list">
              {securityFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <li
                    key={feature.id}
                    className="footer-feature-item"
                  >
                    <Icon
                      size={17}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>
                      {feature.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* =================================
              TECHNOLOGY STACK
          ================================= */}

          <div className="footer-column">

            <h3 className="footer-heading">
              Built With
            </h3>

            <ul className="footer-feature-list">
              {technologies.map((technology) => {
                const Icon = technology.icon;

                return (
                  <li
                    key={technology.id}
                    className="footer-feature-item"
                  >
                    <Icon
                      size={17}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>
                      {technology.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* =================================
            FOOTER DIVIDER
        ================================= */}

        <div className="footer-divider" />

        {/* =================================
            FOOTER BOTTOM
        ================================= */}

        <div className="footer-bottom">

          {/* Copyright */}
          <p className="footer-copyright">
            &copy; {currentYear} SecureAuth.
            All rights reserved.
          </p>

          {/* Developer credit */}
          <div className="footer-developer">
            <span>Designed & Developed with</span>

            <Heart
              size={15}
              className="footer-heart"
              aria-label="love"
            />

            <span>by</span>

            <strong>Kanav Sharma</strong>
          </div>

          {/* Application version */}
          <div className="footer-version">
            <span className="footer-version-dot" />

            <span>
              Version {appVersion}
            </span>
          </div>
        </div>

        {/* =================================
            PROJECT INFORMATION
        ================================= */}

        <div className="footer-project-note">
          <Code2
            size={15}
            aria-hidden="true"
          />

          <span>
            Full Stack Development Internship
            Project — Week 2, Task 3
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

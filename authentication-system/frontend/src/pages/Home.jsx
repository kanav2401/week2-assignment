
import { Link } from "react-router-dom";

import {
  ShieldCheck,
  Shield,
  LockKeyhole,
  Fingerprint,
  RefreshCw,
  Database,
  ArrowRight,
  ArrowUpRight,
  UserPlus,
  LogIn,
  LayoutDashboard,
  CheckCircle2,
  Cookie,
  Server,
  Code2,
  Layers,
  Zap,
  Clock3,
  KeyRound,
  Globe,
  Monitor,
  UserRound,
  Activity,
  CircleCheck,
  Terminal,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";

// ========================================
// SECURITY FEATURES DATA
// ========================================

const securityFeatures = [
  {
    id: "password-hashing",
    icon: LockKeyhole,
    title: "Secure Password Hashing",
    description:
      "Passwords are hashed using bcrypt before being stored in the database. Plain-text passwords are never stored.",
    color: "indigo",
  },
  {
    id: "jwt-authentication",
    icon: Fingerprint,
    title: "JWT Authentication",
    description:
      "Access and refresh tokens provide authenticated access with controlled token expiration.",
    color: "blue",
  },
  {
    id: "cookie-security",
    icon: Cookie,
    title: "HttpOnly Cookies",
    description:
      "Authentication tokens are stored in HttpOnly cookies instead of browser localStorage.",
    color: "purple",
  },
  {
    id: "session-management",
    icon: RefreshCw,
    title: "Smart Session Management",
    description:
      "Automatic token refresh maintains valid sessions without requiring frequent manual login.",
    color: "green",
  },
  {
    id: "csrf-protection",
    icon: ShieldCheck,
    title: "CSRF Protection",
    description:
      "Signed CSRF tokens and origin validation help protect state-changing authentication requests.",
    color: "orange",
  },
  {
    id: "rate-limiting",
    icon: Zap,
    title: "Request Rate Limiting",
    description:
      "Rate limiting helps reduce brute-force login attempts and excessive authentication requests.",
    color: "red",
  },
];

// ========================================
// HOW IT WORKS DATA
// ========================================

const workingSteps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create an Account",
    description:
      "Register using your username, email address and a password that meets the security requirements.",
  },
  {
    number: "02",
    icon: LogIn,
    title: "Sign In Securely",
    description:
      "Your credentials are verified by the backend, which creates an authenticated session.",
  },
  {
    number: "03",
    icon: LayoutDashboard,
    title: "Access Your Dashboard",
    description:
      "View your account information, active sessions and authentication security details.",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Sign Out Safely",
    description:
      "Your server-side session is revoked and authentication cookies are cleared when you log out.",
  },
];

// ========================================
// TECHNOLOGY STACK DATA
// ========================================

const technologies = [
  {
    id: "react",
    icon: Code2,
    name: "React.js",
    category: "Frontend",
    description:
      "Responsive component-based user interface.",
    color: "cyan",
  },
  {
    id: "node",
    icon: Server,
    name: "Node.js",
    category: "Runtime",
    description:
      "JavaScript-powered backend environment.",
    color: "green",
  },
  {
    id: "express",
    icon: Layers,
    name: "Express.js",
    category: "Backend",
    description:
      "REST API and authentication middleware.",
    color: "slate",
  },
  {
    id: "mongodb",
    icon: Database,
    name: "MongoDB",
    category: "Database",
    description:
      "Persistent user and session data storage.",
    color: "emerald",
  },
];

// ========================================
// AUTHENTICATION ARCHITECTURE DATA
// ========================================

const architectureItems = [
  {
    icon: Clock3,
    title: "Short-lived Access Tokens",
    description:
      "Access tokens expire after 15 minutes by default.",
  },
  {
    icon: RefreshCw,
    title: "Refresh Token Rotation",
    description:
      "Refresh tokens are rotated when authentication is renewed.",
  },
  {
    icon: KeyRound,
    title: "Server-side Session Revocation",
    description:
      "Logging out invalidates the corresponding server-side session.",
  },
  {
    icon: Database,
    title: "Hashed Refresh Tokens",
    description:
      "Refresh token hashes are stored instead of raw refresh tokens.",
  },
];

// ========================================
// HERO DASHBOARD PREVIEW
// ========================================

const DashboardPreview = () => {
  return (
    <div className="hero-visual">

      {/* Decorative background */}
      <div
        className="hero-visual-glow"
        aria-hidden="true"
      />

      <div
        className="hero-visual-ring hero-ring-one"
        aria-hidden="true"
      />

      <div
        className="hero-visual-ring hero-ring-two"
        aria-hidden="true"
      />

      {/* Dashboard illustration */}
      <div className="hero-dashboard-preview">

        {/* Preview window header */}
        <div className="preview-window-header">

          <div
            className="preview-window-dots"
            aria-hidden="true"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="preview-window-address">
            <LockKeyhole
              size={12}
              aria-hidden="true"
            />

            <span>SecureAuth Dashboard</span>
          </div>

          <ShieldCheck
            size={17}
            className="preview-header-shield"
            aria-hidden="true"
          />
        </div>

        {/* Preview application body */}
        <div className="preview-dashboard-body">

          {/* Preview sidebar */}
          <div className="preview-sidebar">

            <img
              src="/secureauth.svg"
              alt=""
              width="32"
              height="32"
            />

            <div className="preview-sidebar-links">

              <div className="preview-sidebar-item preview-sidebar-active">
                <LayoutDashboard size={17} />

                <span>Dashboard</span>
              </div>

              <div className="preview-sidebar-item">
                <UserRound size={17} />

                <span>Profile</span>
              </div>

              <div className="preview-sidebar-item">
                <Shield size={17} />

                <span>Security</span>
              </div>
            </div>

            <div className="preview-sidebar-bottom">
              <ShieldCheck size={18} />

              <span>Protected</span>
            </div>
          </div>

          {/* Preview dashboard main content */}
          <div className="preview-main">

            <div className="preview-main-header">
              <div>
                <span className="preview-eyebrow">
                  ACCOUNT OVERVIEW
                </span>

                <h3>Welcome back!</h3>

                <p>
                  Your authentication dashboard
                </p>
              </div>

              <div className="preview-avatar">
                SU
              </div>
            </div>

            {/* Sample account cards */}
            <div className="preview-stat-grid">

              <div className="preview-stat-card">
                <div className="preview-stat-icon preview-icon-green">
                  <ShieldCheck size={18} />
                </div>

                <span>Account Status</span>

                <strong>Active</strong>
              </div>

              <div className="preview-stat-card">
                <div className="preview-stat-icon preview-icon-indigo">
                  <Monitor size={18} />
                </div>

                <span>Session Status</span>

                <strong>Authenticated</strong>
              </div>
            </div>

            {/* Security overview */}
            <div className="preview-security-card">

              <div className="preview-security-header">
                <ShieldCheck size={18} />

                <strong>
                  Security Overview
                </strong>
              </div>

              {[
                "Password hashing",
                "JWT authentication",
                "HttpOnly cookies",
                "CSRF protection",
              ].map((feature) => (
                <div
                  key={feature}
                  className="preview-security-row"
                >
                  <span>{feature}</span>

                  <CircleCheck
                    size={15}
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>

            {/* Session information */}
            <div className="preview-session-card">
              <Activity size={17} />

              <div>
                <strong>
                  Current Session
                </strong>

                <span>
                  Authentication verified
                </span>
              </div>

              <span className="preview-session-dot" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating security indicators */}
      <div className="hero-floating-card hero-floating-security">
        <div className="floating-icon floating-icon-green">
          <ShieldCheck size={23} />
        </div>

        <div>
          <strong>Protected Access</strong>

          <span>JWT Authentication</span>
        </div>
      </div>

      <div className="hero-floating-card hero-floating-session">
        <div className="floating-icon floating-icon-indigo">
          <RefreshCw size={22} />
        </div>

        <div>
          <strong>Smart Sessions</strong>

          <span>Automatic token refresh</span>
        </div>
      </div>

      <p className="hero-preview-caption">
        Illustrative dashboard preview
      </p>
    </div>
  );
};

// ========================================
// HOME PAGE COMPONENT
// ========================================

const Home = () => {
  const {
    user,
    isAuthenticated,
    loading,
  } = useAuth();

  // ========================================
  // RENDER HOME PAGE
  // ========================================

  return (
    <div className="home-page">

      <Navbar />

      <main>

        {/* =================================
            HERO SECTION
        ================================= */}

        <section className="hero-section">

          <div className="hero-container">

            {/* Hero content */}
            <div className="hero-content">

              <div className="hero-badge">
                <ShieldCheck
                  size={17}
                  aria-hidden="true"
                />

                <span>
                  Modern Authentication Platform
                </span>
              </div>

              <h1 className="hero-title">
                Your identity.
                <span className="hero-title-highlight">
                  Protected.
                </span>
              </h1>

              <p className="hero-description">
                Experience secure authentication
                with intelligent session management,
                protected account access and modern
                security practices — all in one
                simple platform.
              </p>

              {/* Authentication-based hero actions */}
              <div className="hero-actions">

                {loading ? (
                  <LoadingSpinner
                    inline
                    size="small"
                    message="Checking authentication..."
                  />
                ) : isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="btn btn-primary btn-lg"
                    >
                      <LayoutDashboard size={20} />

                      Go to Dashboard

                      <ArrowRight size={19} />
                    </Link>

                    <Link
                      to="/profile"
                      className="btn btn-outline btn-lg"
                    >
                      My Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn btn-primary btn-lg"
                    >
                      Get Started

                      <ArrowRight size={20} />
                    </Link>

                    <Link
                      to="/login"
                      className="btn btn-outline btn-lg"
                    >
                      <LogIn size={19} />

                      Sign In
                    </Link>
                  </>
                )}
              </div>

              {/* Personalized greeting */}
              {!loading &&
                isAuthenticated &&
                user && (
                  <div className="hero-user-greeting">
                    <CheckCircle2 size={18} />

                    <span>
                      Welcome back, {user.username}!
                      Your account is authenticated.
                    </span>
                  </div>
                )}

              {/* Hero security highlights */}
              <div className="hero-trust-items">

                <div className="hero-trust-item">
                  <CheckCircle2 size={17} />

                  <span>bcrypt Hashing</span>
                </div>

                <div className="hero-trust-item">
                  <CheckCircle2 size={17} />

                  <span>JWT Security</span>
                </div>

                <div className="hero-trust-item">
                  <CheckCircle2 size={17} />

                  <span>Protected Sessions</span>
                </div>
              </div>
            </div>

            {/* Hero dashboard illustration */}
            <DashboardPreview />
          </div>
        </section>

        {/* =================================
            SECURITY HIGHLIGHTS STRIP
        ================================= */}

        <section
          className="home-highlights-section"
          aria-label="Authentication highlights"
        >
          <div className="home-highlights-container">

            <div className="home-highlight-item">
              <LockKeyhole size={25} />

              <div>
                <strong>bcrypt</strong>

                <span>Password Hashing</span>
              </div>
            </div>

            <div className="home-highlight-item">
              <Fingerprint size={25} />

              <div>
                <strong>JWT</strong>

                <span>Token Authentication</span>
              </div>
            </div>

            <div className="home-highlight-item">
              <Cookie size={25} />

              <div>
                <strong>HttpOnly</strong>

                <span>Cookie Storage</span>
              </div>
            </div>

            <div className="home-highlight-item">
              <ShieldCheck size={25} />

              <div>
                <strong>CSRF</strong>

                <span>Request Protection</span>
              </div>
            </div>
          </div>
        </section>

        {/* =================================
            SECURITY FEATURES SECTION
        ================================= */}

        <section
          id="features"
          className="home-section features-section"
        >
          <div className="home-section-container">

            <div className="section-heading">

              <div className="section-label">
                <ShieldCheck size={16} />

                Security Features
              </div>

              <h2>
                Built with security
                <span> at every step.</span>
              </h2>

              <p>
                SecureAuth combines modern authentication
                techniques to protect user credentials,
                manage sessions and restrict unauthorized
                access.
              </p>
            </div>

            <div className="features-grid">

              {securityFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.id}
                    className="feature-card"
                  >
                    <div
                      className={`feature-icon feature-icon-${feature.color}`}
                    >
                      <Icon
                        size={27}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>

                    <h3>{feature.title}</h3>

                    <p>{feature.description}</p>

                    <div className="feature-card-status">
                      <CheckCircle2 size={15} />

                      <span>Implemented</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================
            HOW IT WORKS SECTION
        ================================= */}

        <section
          id="how-it-works"
          className="home-section how-it-works-section"
        >
          <div className="home-section-container">

            <div className="section-heading">

              <div className="section-label">
                <Zap size={16} />

                Simple Authentication
              </div>

              <h2>
                How SecureAuth
                <span> works.</span>
              </h2>

              <p>
                From account creation to secure logout,
                experience a straightforward authentication
                workflow.
              </p>
            </div>

            <div className="working-steps-grid">

              {workingSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.number}
                    className="working-step-card"
                  >
                    <div className="working-step-top">

                      <span className="working-step-number">
                        {step.number}
                      </span>

                      <div className="working-step-icon">
                        <Icon
                          size={26}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    <h3>{step.title}</h3>

                    <p>{step.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================
            AUTHENTICATION ARCHITECTURE
        ================================= */}

        <section className="home-section architecture-section">

          <div className="home-section-container architecture-container">

            {/* Architecture content */}
            <div className="architecture-content">

              <div className="section-label">
                <Terminal size={16} />

                Under the Hood
              </div>

              <h2>
                More than just
                <span> a login form.</span>
              </h2>

              <p className="architecture-description">
                SecureAuth demonstrates a complete
                authentication architecture, including
                token verification, session persistence,
                token rotation and backend authorization.
              </p>

              <div className="architecture-features">

                {architectureItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="architecture-feature"
                    >
                      <div className="architecture-feature-icon">
                        <Icon
                          size={22}
                          aria-hidden="true"
                        />
                      </div>

                      <div>
                        <h3>{item.title}</h3>

                        <p>{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Authentication architecture illustration */}
            <div className="architecture-visual">

              <div className="architecture-visual-header">
                <div className="architecture-visual-icon">
                  <ShieldCheck size={24} />
                </div>

                <div>
                  <h3>Authentication Flow</h3>

                  <p>SecureAuth system architecture</p>
                </div>
              </div>

              <div className="architecture-flow">

                <div className="architecture-flow-node">
                  <div className="flow-node-icon">
                    <Globe size={23} />
                  </div>

                  <div>
                    <strong>React Frontend</strong>

                    <span>
                      User interface and form validation
                    </span>
                  </div>
                </div>

                <div className="architecture-flow-connector">
                  <span />

                  <small>
                    HTTP requests + cookies
                  </small>

                  <span />
                </div>

                <div className="architecture-flow-node">
                  <div className="flow-node-icon">
                    <Server size={23} />
                  </div>

                  <div>
                    <strong>Express REST API</strong>

                    <span>
                      Validation and request processing
                    </span>
                  </div>
                </div>

                <div className="architecture-flow-connector">
                  <span />

                  <small>
                    Authentication middleware
                  </small>

                  <span />
                </div>

                <div className="architecture-flow-node">
                  <div className="flow-node-icon">
                    <Fingerprint size={23} />
                  </div>

                  <div>
                    <strong>Authentication Layer</strong>

                    <span>
                      JWT, bcrypt and session verification
                    </span>
                  </div>
                </div>

                <div className="architecture-flow-connector">
                  <span />

                  <small>
                    Mongoose ODM
                  </small>

                  <span />
                </div>

                <div className="architecture-flow-node">
                  <div className="flow-node-icon">
                    <Database size={23} />
                  </div>

                  <div>
                    <strong>MongoDB Atlas</strong>

                    <span>
                      User and session collections
                    </span>
                  </div>
                </div>
              </div>

              <div className="architecture-visual-footer">
                <ShieldCheck size={17} />

                <span>
                  Backend-enforced authentication
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =================================
            TECHNOLOGY STACK SECTION
        ================================= */}

        <section
          id="technologies"
          className="home-section technology-section"
        >
          <div className="home-section-container">

            <div className="section-heading">

              <div className="section-label">
                <Code2 size={16} />

                Technology Stack
              </div>

              <h2>
                Powered by the
                <span> MERN stack.</span>
              </h2>

              <p>
                Built using modern JavaScript technologies
                for a complete full-stack authentication
                experience.
              </p>
            </div>

            <div className="technology-grid">

              {technologies.map((technology) => {
                const Icon = technology.icon;

                return (
                  <article
                    key={technology.id}
                    className="technology-card"
                  >
                    <div
                      className={`technology-icon technology-icon-${technology.color}`}
                    >
                      <Icon
                        size={30}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>

                    <span className="technology-category">
                      {technology.category}
                    </span>

                    <h3>{technology.name}</h3>

                    <p>{technology.description}</p>
                  </article>
                );
              })}
            </div>

            {/* Supporting technologies */}
            <div className="supporting-technologies">

              <span>Also built with</span>

              <div className="supporting-technology-list">
                {[
                  "Vite",
                  "Axios",
                  "Mongoose",
                  "bcrypt",
                  "JSON Web Token",
                  "React Router",
                  "Lucide React",
                  "Helmet",
                ].map((technology) => (
                  <span
                    key={technology}
                    className="technology-tag"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =================================
            CALL TO ACTION SECTION
        ================================= */}

        <section className="home-cta-section">

          <div className="home-cta-container">

            <div
              className="cta-decoration cta-decoration-one"
              aria-hidden="true"
            />

            <div
              className="cta-decoration cta-decoration-two"
              aria-hidden="true"
            />

            <div className="home-cta-content">

              <div className="cta-icon">
                <ShieldCheck
                  size={38}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </div>

              <h2>
                {isAuthenticated
                  ? "Your account is ready."
                  : "Ready to get started?"}
              </h2>

              <p>
                {isAuthenticated
                  ? "Access your dashboard to explore your account information, active sessions and authentication security features."
                  : "Create your SecureAuth account and explore a modern authentication experience built with security in mind."}
              </p>

              <div className="cta-actions">

                {loading ? (
                  <LoadingSpinner
                    inline
                    size="small"
                    message="Please wait..."
                  />
                ) : isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="btn btn-white btn-lg"
                  >
                    Open Dashboard

                    <ArrowUpRight size={20} />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn btn-white btn-lg"
                    >
                      Create Your Account

                      <ArrowRight size={20} />
                    </Link>

                    <Link
                      to="/login"
                      className="btn btn-light-outline btn-lg"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              <div className="cta-security-note">
                <LockKeyhole size={15} />

                <span>
                  No payment required. Built as a
                  full-stack authentication project.
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;


import {
  useState,
  useEffect,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  UserRound,
  Mail,
  CalendarDays,
  Clock3,
  ShieldCheck,
  LockKeyhole,
  Fingerprint,
  Cookie,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  Monitor,
  KeyRound,
  Database,
  Info,
  CircleCheck,
  LogOut,
  Copy,
  Check,
  Hash,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

import {
  formatDate,
  formatDateTime,
  formatDuration,
  getUserInitials,
} from "../utils/validation";

import {
  getErrorMessage,
} from "../services/api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";

// ========================================
// PROFILE INFORMATION FIELD
// ========================================

const ProfileField = ({
  icon: Icon,
  label,
  value,
  children,
}) => {
  return (
    <div className="profile-field">
      <div className="profile-field-icon">
        <Icon size={21} strokeWidth={1.8} />
      </div>

      <div className="profile-field-content">
        <span className="profile-field-label">
          {label}
        </span>

        <strong className="profile-field-value">
          {value || "Not available"}
        </strong>
      </div>

      {children}
    </div>
  );
};

// ========================================
// PROFILE SECURITY ITEM
// ========================================

const ProfileSecurityItem = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="profile-security-item">
      <div className="profile-security-icon">
        <Icon size={22} strokeWidth={1.8} />
      </div>

      <div className="profile-security-content">
        <h4>{title}</h4>

        <p>{description}</p>
      </div>
    </div>
  );
};

// ========================================
// PROFILE PAGE COMPONENT
// ========================================

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    session,
    authLoading,
    refreshUser,
    logout,
  } = useAuth();

  // ========================================
  // PROFILE STATE
  // ========================================

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(Date.now());

  const [notification, setNotification] =
    useState(() => {
      return location.state?.message
        ? {
            type: location.state.type || "success",
            message: location.state.message,
          }
        : null;
    });

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
  // LIVE SESSION COUNTDOWN
  // ========================================

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ========================================
  // RESET COPY BUTTON
  // ========================================

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [copied]);

  // ========================================
  // REFRESH PROFILE INFORMATION
  // ========================================

  const handleRefreshProfile = async () => {
    if (refreshing || authLoading) {
      return;
    }

    setRefreshing(true);
    setError("");
    setNotification(null);

    try {
      const response = await refreshUser();

      if (!response.success) {
        throw new Error(
          response.message ||
            "Unable to refresh profile information."
        );
      }

      setNotification({
        type: "success",

        message:
          "Your profile information has been updated successfully.",
      });
    } catch (requestError) {
      setError(
        getErrorMessage(requestError)
      );
    } finally {
      setRefreshing(false);
    }
  };

  // ========================================
  // COPY USER ID
  // ========================================

  const handleCopyUserId = async () => {
    if (!user?.id) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        String(user.id)
      );

      setCopied(true);
    } catch {
      setError(
        "Unable to copy the account ID. Please copy it manually."
      );
    }
  };

  // ========================================
  // HANDLE LOGOUT
  // ========================================

  const handleLogout = async () => {
    if (authLoading || refreshing) {
      return;
    }

    setError("");

    try {
      await logout();

      navigate("/login", {
        replace: true,

        state: {
          type: "success",

          message:
            "You have been logged out successfully.",
        },
      });
    } catch (requestError) {
      setError(
        getErrorMessage(requestError)
      );
    }
  };

  // ========================================
  // DERIVED PROFILE INFORMATION
  // ========================================

  const createdAtTime = user?.createdAt
    ? new Date(user.createdAt).getTime()
    : NaN;

  const accountAgeDays =
    Number.isFinite(createdAtTime)
      ? Math.max(
          0,
          Math.floor(
            (currentTime - createdAtTime) /
              (1000 * 60 * 60 * 24)
          )
        )
      : null;

  const sessionExpiryTime = session?.expiresAt
    ? new Date(session.expiresAt).getTime()
    : NaN;

  const remainingTime =
    Number.isFinite(sessionExpiryTime)
      ? Math.max(
          0,
          sessionExpiryTime - currentTime
        )
      : null;

  const sessionExpired =
    remainingTime !== null &&
    remainingTime <= 0;

  const busy =
    refreshing || authLoading;

  // ========================================
  // SECURITY FEATURES
  // ========================================

  const securityFeatures = [
    {
      icon: LockKeyhole,
      title: "Password Protection",
      description:
        "Your password is stored as a bcrypt hash rather than plain text.",
    },
    {
      icon: Fingerprint,
      title: "JWT Authentication",
      description:
        "Access and refresh tokens are used to authenticate your requests.",
    },
    {
      icon: Cookie,
      title: "HttpOnly Cookies",
      description:
        "Authentication cookies cannot be read directly by browser JavaScript.",
    },
    {
      icon: RefreshCw,
      title: "Automatic Token Renewal",
      description:
        "Access tokens can be renewed while your refresh session remains valid.",
    },
    {
      icon: Database,
      title: "Server-side Sessions",
      description:
        "Session records are maintained and validated through MongoDB.",
    },
    {
      icon: ShieldCheck,
      title: "Request Protection",
      description:
        "CSRF protection and rate limiting help protect authentication endpoints.",
    },
  ];

  // ========================================
  // HANDLE MISSING USER INFORMATION
  // ========================================

  if (!user) {
    return (
      <LoadingSpinner
        fullPage
        size="large"
        message="Loading your profile..."
      />
    );
  }

  // ========================================
  // RENDER PROFILE PAGE
  // ========================================

  return (
    <div className="profile-page">

      <Navbar />

      <main className="profile-main">

        <div className="profile-container">

          {/* =================================
              PAGE HEADER
          ================================= */}

          <div className="profile-page-header">

            <div>
              <Link
                to="/dashboard"
                className="profile-back-link"
              >
                <ArrowLeft size={18} />

                Back to Dashboard
              </Link>

              <span className="dashboard-eyebrow">
                ACCOUNT SETTINGS
              </span>

              <h1>My Profile</h1>

              <p>
                View your personal information,
                account details and security settings.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline"
              onClick={handleRefreshProfile}
              disabled={busy}
            >
              {refreshing ? (
                <LoadingSpinner
                  inline
                  size="small"
                  message="Refreshing..."
                />
              ) : (
                <>
                  <RefreshCw size={18} />

                  Refresh Profile
                </>
              )}
            </button>
          </div>

          {/* =================================
              NOTIFICATIONS
          ================================= */}

          {notification && (
            <Alert
              type={notification.type}
              message={notification.message}
              dismissible
              onClose={() => setNotification(null)}
            />
          )}

          {error && (
            <Alert
              type="error"
              title="Profile Error"
              message={error}
              dismissible
              onClose={() => setError("")}
            />
          )}

          {/* =================================
              PROFILE HERO CARD
          ================================= */}

          <section className="profile-hero-card">

            <div
              className="profile-cover"
              aria-hidden="true"
            >
              <div className="profile-cover-decoration profile-cover-one" />

              <div className="profile-cover-decoration profile-cover-two" />

              <div className="profile-cover-shield">
                <ShieldCheck
                  size={115}
                  strokeWidth={1.1}
                />
              </div>
            </div>

            <div className="profile-hero-content">

              <div className="profile-avatar-wrapper">
                <div className="profile-avatar">
                  {getUserInitials(user.username)}
                </div>

                <div className="profile-avatar-status">
                  <CircleCheck size={19} />
                </div>
              </div>

              <div className="profile-hero-details">

                <div className="profile-name-row">
                  <h2>{user.username}</h2>

                  <span className="dashboard-status-badge status-active">
                    <ShieldCheck size={15} />

                    Authenticated
                  </span>
                </div>

                <p className="profile-hero-email">
                  <Mail size={17} />

                  {user.email}
                </p>

                <div className="profile-hero-meta">

                  <span>
                    <CalendarDays size={16} />

                    Member since{" "}
                    {formatDate(user.createdAt)}
                  </span>

                  <span>
                    <Clock3 size={16} />

                    {accountAgeDays === null
                      ? "Account age unavailable"
                      : `${accountAgeDays} ${
                          accountAgeDays === 1
                            ? "day"
                            : "days"
                        } on SecureAuth`}
                  </span>
                </div>
              </div>

              <Link
                to="/dashboard"
                className="btn btn-primary profile-dashboard-button"
              >
                <LayoutDashboard size={18} />

                Dashboard

                <ArrowRight size={17} />
              </Link>
            </div>
          </section>

          {/* =================================
              PROFILE STATISTICS
          ================================= */}

          <section
            className="profile-stats-grid"
            aria-label="Profile statistics"
          >
            <div className="profile-stat-card">
              <div className="profile-stat-icon stat-icon-green">
                <ShieldCheck size={25} />
              </div>

              <div>
                <span>Authentication</span>

                <strong>Signed In</strong>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="profile-stat-icon stat-icon-indigo">
                <CalendarDays size={25} />
              </div>

              <div>
                <span>Account Age</span>

                <strong>
                  {accountAgeDays === null
                    ? "Unavailable"
                    : `${accountAgeDays} ${
                        accountAgeDays === 1
                          ? "day"
                          : "days"
                      }`}
                </strong>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="profile-stat-icon stat-icon-blue">
                <Monitor size={25} />
              </div>

              <div>
                <span>Current Session</span>

                <strong>
                  {sessionExpired
                    ? "Expired"
                    : remainingTime === null
                    ? "Unknown"
                    : "Active"}
                </strong>
              </div>
            </div>
          </section>

          {/* =================================
              PROFILE INFORMATION GRID
          ================================= */}

          <div className="profile-details-grid">

            {/* Personal information */}
            <section className="profile-card">

              <div className="profile-card-header">
                <div className="profile-card-heading-icon">
                  <UserRound size={24} />
                </div>

                <div>
                  <h3>Personal Information</h3>

                  <p>
                    Your registered account details.
                  </p>
                </div>
              </div>

              <div className="profile-fields">

                <ProfileField
                  icon={UserRound}
                  label="Username"
                  value={user.username}
                />

                <ProfileField
                  icon={Mail}
                  label="Email Address"
                  value={user.email}
                />

                <ProfileField
                  icon={Hash}
                  label="Account ID"
                  value={user.id}
                >
                  <button
                    type="button"
                    className="profile-copy-button"
                    onClick={handleCopyUserId}
                    disabled={!user.id}
                    aria-label={
                      copied
                        ? "Account ID copied"
                        : "Copy account ID"
                    }
                    title={
                      copied
                        ? "Copied"
                        : "Copy account ID"
                    }
                  >
                    {copied ? (
                      <Check size={18} />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                </ProfileField>
              </div>

              <div className="profile-information-note">
                <Info size={18} />

                <p>
                  Account information is currently
                  read-only. Profile editing is
                  not available in this version.
                </p>
              </div>
            </section>

            {/* Account information */}
            <section className="profile-card">

              <div className="profile-card-header">
                <div className="profile-card-heading-icon">
                  <CalendarDays size={24} />
                </div>

                <div>
                  <h3>Account Information</h3>

                  <p>
                    Account registration and activity.
                  </p>
                </div>
              </div>

              <div className="profile-fields">

                <ProfileField
                  icon={CalendarDays}
                  label="Account Created"
                  value={formatDateTime(
                    user.createdAt
                  )}
                />

                <ProfileField
                  icon={Clock3}
                  label="Last Successful Login"
                  value={formatDateTime(
                    user.lastLogin
                  )}
                />

                <ProfileField
                  icon={RefreshCw}
                  label="Last Account Update"
                  value={formatDateTime(
                    user.updatedAt
                  )}
                />

                <ProfileField
                  icon={ShieldCheck}
                  label="Authentication Status"
                  value="Authenticated"
                />
              </div>
            </section>
          </div>

          {/* =================================
              CURRENT SESSION INFORMATION
          ================================= */}

          <section className="profile-card profile-session-card">

            <div className="profile-card-header">
              <div className="profile-card-heading-icon">
                <Monitor size={24} />
              </div>

              <div>
                <h3>Current Session</h3>

                <p>
                  Information about your
                  authenticated session.
                </p>
              </div>
            </div>

            <div className="profile-session-grid">

              <ProfileField
                icon={KeyRound}
                label="Session Reference"
                value={
                  session?.id
                    ? `••••${String(
                        session.id
                      ).slice(-8)}`
                    : "Unavailable"
                }
              />

              <ProfileField
                icon={CalendarDays}
                label="Session Created"
                value={formatDateTime(
                  session?.createdAt
                )}
              />

              <ProfileField
                icon={Clock3}
                label="Session Expires"
                value={formatDateTime(
                  session?.expiresAt
                )}
              />

              <ProfileField
                icon={ActivityIcon}
                label="Time Remaining"
                value={
                  remainingTime === null
                    ? "Unavailable"
                    : formatDuration(remainingTime)
                }
              />
            </div>

            <div className="profile-session-footer">
              <div className="profile-session-notice">
                <ShieldCheck size={19} />

                <span>
                  Your session is managed using
                  server-side verification and
                  HttpOnly cookies.
                </span>
              </div>

              <Link
                to="/dashboard#session-information"
                className="dashboard-card-link"
              >
                View Active Sessions

                <ArrowRight size={17} />
              </Link>
            </div>
          </section>

          {/* =================================
              ACCOUNT SECURITY
          ================================= */}

          <section className="profile-card profile-security-card">

            <div className="profile-card-header">
              <div className="profile-card-heading-icon">
                <ShieldCheck size={25} />
              </div>

              <div>
                <h3>Account Security</h3>

                <p>
                  Security mechanisms used by SecureAuth.
                </p>
              </div>
            </div>

            <div className="profile-security-grid">
              {securityFeatures.map((feature) => (
                <ProfileSecurityItem
                  key={feature.title}
                  {...feature}
                />
              ))}
            </div>

            <div className="profile-information-note">
              <Info size={18} />

              <p>
                Your password and raw authentication
                tokens are never displayed on
                this profile page.
              </p>
            </div>
          </section>

          {/* =================================
              SIGN OUT SECTION
          ================================= */}

          <section className="profile-logout-card">

            <div className="profile-logout-content">

              <div className="profile-logout-icon">
                <LogOut size={25} />
              </div>

              <div>
                <h3>Sign Out of Your Account</h3>

                <p>
                  Signing out revokes your current
                  server-side session and clears
                  authentication cookies.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-danger-outline"
              onClick={handleLogout}
              disabled={busy}
            >
              {authLoading ? (
                <LoadingSpinner
                  inline
                  size="small"
                  message="Signing out..."
                />
              ) : (
                <>
                  <LogOut size={19} />

                  Sign Out
                </>
              )}
            </button>
          </section>
        </div>
      </main>

      <Footer compact />
    </div>
  );
};

// ========================================
// SESSION ACTIVITY ICON
// ========================================

const ActivityIcon = (props) => {
  return <Clock3 {...props} />;
};

export default Profile;


import {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  UserRound,
  ShieldCheck,
  ShieldAlert,
  LockKeyhole,
  Fingerprint,
  RefreshCw,
  LogOut,
  Clock3,
  CalendarDays,
  Monitor,
  Activity,
  Database,
  Cookie,
  KeyRound,
  Zap,
  CircleCheck,
  CircleX,
  ArrowRight,
  Mail,
  Home,
  Server,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

import authService from "../services/authService";

import {
  getErrorMessage,
} from "../services/api";

import {
  formatDate,
  formatDateTime,
  formatDuration,
  getUserInitials,
} from "../utils/validation";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";

// ========================================
// STATISTICS CARD COMPONENT
// ========================================

const StatCard = ({
  icon: Icon,
  title,
  value,
  description,
  color = "indigo",
}) => {
  return (
    <article className="dashboard-stat-card">
      <div className="dashboard-stat-top">
        <div
          className={`dashboard-stat-icon stat-icon-${color}`}
        >
          <Icon size={24} strokeWidth={1.8} />
        </div>
      </div>

      <span className="dashboard-stat-label">
        {title}
      </span>

      <strong className="dashboard-stat-value">
        {value}
      </strong>

      <p className="dashboard-stat-description">
        {description}
      </p>
    </article>
  );
};

// ========================================
// SECURITY ITEM COMPONENT
// ========================================

const SecurityItem = ({
  icon: Icon,
  title,
  description,
  enabled,
}) => {
  return (
    <div className="dashboard-security-item">
      <div className="dashboard-security-icon">
        <Icon size={21} strokeWidth={1.8} />
      </div>

      <div className="dashboard-security-text">
        <h4>{title}</h4>

        <p>{description}</p>
      </div>

      <div
        className={`security-status ${
          enabled
            ? "security-status-enabled"
            : "security-status-disabled"
        }`}
      >
        {enabled ? (
          <CircleCheck size={16} />
        ) : (
          <CircleX size={16} />
        )}

        <span>
          {enabled ? "Enabled" : "Unavailable"}
        </span>
      </div>
    </div>
  );
};

// ========================================
// DASHBOARD PAGE COMPONENT
// ========================================

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    session,
    authLoading,
    refreshSession,
    logout,
  } = useAuth();

  // ========================================
  // DASHBOARD STATE
  // ========================================

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [sessionRefreshing, setSessionRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [notification, setNotification] =
    useState(() => {
      return location.state?.message
        ? {
            type: location.state.type || "success",
            message: location.state.message,
          }
        : null;
    });

  const [currentTime, setCurrentTime] =
    useState(Date.now());

  // ========================================
  // FETCH DASHBOARD DATA
  // ========================================

  const fetchDashboard = useCallback(
    async ({ background = false } = {}) => {
      if (background) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const response =
          await authService.getDashboardData();

        if (!response.success) {
          throw new Error(
            response.message ||
              "Unable to retrieve dashboard data."
          );
        }

        setDashboardData(response);

        return true;
      } catch (requestError) {
        setError(
          getErrorMessage(requestError)
        );

        return false;
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // ========================================
  // INITIAL DASHBOARD DATA
  // ========================================

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

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
  // REFRESH DASHBOARD
  // ========================================

  const handleRefreshDashboard = async () => {
    if (refreshing || sessionRefreshing || authLoading) {
      return;
    }

    setNotification(null);

    const success = await fetchDashboard({
      background: true,
    });

    if (success) {
      setNotification({
        type: "success",
        message: "Dashboard updated successfully.",
      });
    }
  };

  // ========================================
  // REFRESH AUTHENTICATION SESSION
  // ========================================

  const handleRefreshSession = async () => {
    if (
      sessionRefreshing ||
      refreshing ||
      authLoading
    ) {
      return;
    }

    setSessionRefreshing(true);
    setNotification(null);
    setError("");

    try {
      await refreshSession();

      const success = await fetchDashboard({
        background: true,
      });

      setNotification({
        type: success ? "success" : "warning",

        message: success
          ? "Authentication tokens refreshed successfully."
          : "Tokens refreshed, but dashboard data could not be updated.",
      });
    } catch (requestError) {
      setError(
        getErrorMessage(requestError)
      );
    } finally {
      setSessionRefreshing(false);
    }
  };

  // ========================================
  // HANDLE SECURE LOGOUT
  // ========================================

  const handleLogout = async () => {
    if (authLoading || sessionRefreshing) {
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
  // DERIVED DASHBOARD INFORMATION
  // ========================================

  const account =
    dashboardData?.user || user;

  const statistics =
    dashboardData?.statistics || {};

  const currentSession =
    dashboardData?.currentSession || session;

  const sessions =
    dashboardData?.sessions || [];

  const security =
    dashboardData?.security || {};

  const expiryTime = currentSession?.expiresAt
    ? new Date(
        currentSession.expiresAt
      ).getTime()
    : NaN;

  const remainingTime = Number.isFinite(expiryTime)
    ? Math.max(0, expiryTime - currentTime)
    : null;

  const sessionExpired =
    remainingTime !== null &&
    remainingTime <= 0;

  const sessionDuration =
    currentSession?.createdAt &&
    Number.isFinite(expiryTime)
      ? expiryTime -
        new Date(
          currentSession.createdAt
        ).getTime()
      : 0;

  const sessionPercentage =
    sessionDuration > 0 &&
    remainingTime !== null
      ? Math.min(
          100,
          Math.max(
            0,
            (remainingTime / sessionDuration) * 100
          )
        )
      : 0;

  const busy =
    refreshing ||
    sessionRefreshing ||
    authLoading;

  // ========================================
  // SECURITY FEATURES CONFIGURATION
  // ========================================

  const securityFeatures = [
    {
      icon: LockKeyhole,
      title: "Password Hashing",
      description:
        "Passwords are hashed using bcrypt.",
      enabled:
        security.passwordHashing === "bcrypt",
    },
    {
      icon: Fingerprint,
      title: "JWT Authentication",
      description:
        "Access and refresh token authentication.",
      enabled:
        security.authentication === "JWT",
    },
    {
      icon: Cookie,
      title: "HttpOnly Cookie Storage",
      description:
        "Authentication tokens are stored in HttpOnly cookies.",
      enabled:
        security.tokenStorage === "HttpOnly Cookies",
    },
    {
      icon: ShieldCheck,
      title: "CSRF Protection",
      description:
        "Signed tokens protect state-changing requests.",
      enabled:
        security.csrfProtection === true,
    },
    {
      icon: Zap,
      title: "Rate Limiting",
      description:
        "Helps reduce excessive authentication requests.",
      enabled:
        security.rateLimiting === true,
    },
    {
      icon: RefreshCw,
      title: "Refresh Token Rotation",
      description:
        "Refresh tokens are replaced when renewed.",
      enabled:
        security.refreshTokenRotation === true,
    },
    {
      icon: Database,
      title: "Session Management",
      description:
        "Authenticated sessions are tracked in MongoDB.",
      enabled:
        security.sessionManagement === true,
    },
    {
      icon: KeyRound,
      title: "Server-side Logout",
      description:
        "Logging out revokes the corresponding session.",
      enabled:
        security.serverSideLogout === true,
    },
  ];

  // ========================================
  // RENDER DASHBOARD
  // ========================================

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-layout">

        {/* =================================
            DASHBOARD SIDEBAR
        ================================= */}

        <aside className="dashboard-sidebar">

          <div className="dashboard-sidebar-user">
            <div className="sidebar-user-avatar">
              {getUserInitials(user?.username)}
            </div>

            <div className="sidebar-user-info">
              <strong>{user?.username}</strong>

              <span>My Account</span>
            </div>
          </div>

          <div className="sidebar-section-label">
            WORKSPACE
          </div>

          <nav
            className="dashboard-sidebar-nav"
            aria-label="Dashboard navigation"
          >
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive
                    ? "sidebar-link-active"
                    : ""
                }`
              }
            >
              <LayoutDashboard size={20} />

              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive
                    ? "sidebar-link-active"
                    : ""
                }`
              }
            >
              <UserRound size={20} />

              <span>My Profile</span>
            </NavLink>

            <Link
              to="/"
              className="sidebar-link"
            >
              <Home size={20} />

              <span>Home</span>
            </Link>
          </nav>

          <div className="sidebar-section-label">
            SECURITY
          </div>

          <nav
            className="dashboard-sidebar-nav"
            aria-label="Security navigation"
          >
            <a
              href="#session-information"
              className="sidebar-link"
            >
              <Monitor size={20} />

              <span>Active Sessions</span>
            </a>

            <a
              href="#security-overview"
              className="sidebar-link"
            >
              <ShieldCheck size={20} />

              <span>Security Overview</span>
            </a>
          </nav>

          <div className="sidebar-bottom">
            <div className="sidebar-security-card">
              <ShieldCheck size={25} />

              <strong>Protected Access</strong>

              <p>
                Your account requires an
                authenticated session.
              </p>
            </div>

            <button
              type="button"
              className="sidebar-logout-button"
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
                  <LogOut size={20} />

                  <span>Sign Out</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* =================================
            DASHBOARD MAIN CONTENT
        ================================= */}

        <main className="dashboard-main">

          {/* Page heading */}
          <div className="dashboard-page-header">
            <div>
              <span className="dashboard-eyebrow">
                ACCOUNT WORKSPACE
              </span>

              <h1>Dashboard</h1>

              <p>
                Manage your account and view
                authentication information.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline"
              onClick={handleRefreshDashboard}
              disabled={loading || busy}
            >
              {refreshing ? (
                <LoadingSpinner
                  inline
                  size="small"
                  message="Updating..."
                />
              ) : (
                <>
                  <RefreshCw size={18} />

                  Refresh Dashboard
                </>
              )}
            </button>
          </div>

          {/* Success notification */}
          {notification && (
            <Alert
              type={notification.type}
              message={notification.message}
              dismissible
              onClose={() => setNotification(null)}
            />
          )}

          {/* Error notification */}
          {error && (
            <Alert
              type="error"
              title="Dashboard Error"
              message={error}
              dismissible
              onClose={() => setError("")}
            />
          )}

          {/* Loading state */}
          {loading ? (
            <div className="dashboard-loading-card">
              <LoadingSpinner
                size="large"
                message="Loading your dashboard..."
              />
            </div>
          ) : !dashboardData ? (
            <div className="dashboard-empty-card">
              <ShieldAlert size={42} />

              <h2>Dashboard unavailable</h2>

              <p>
                Your account information could
                not be retrieved.
              </p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => fetchDashboard()}
              >
                <RefreshCw size={18} />

                Try Again
              </button>
            </div>
          ) : (
            <>

              {/* =================================
                  WELCOME BANNER
              ================================= */}

              <section className="dashboard-welcome-banner">
                <div className="dashboard-welcome-content">
                  <div className="dashboard-welcome-badge">
                    <ShieldCheck size={17} />

                    Authenticated Account
                  </div>

                  <h2>
                    Welcome back, {account?.username}!
                  </h2>

                  <p>
                    You are signed in to SecureAuth.
                    View your account information,
                    sessions and security settings.
                  </p>

                  <Link
                    to="/profile"
                    className="btn btn-white"
                  >
                    View My Profile

                    <ArrowRight size={18} />
                  </Link>
                </div>

                <div
                  className="dashboard-welcome-visual"
                  aria-hidden="true"
                >
                  <ShieldCheck
                    size={115}
                    strokeWidth={1.2}
                  />
                </div>
              </section>

              {/* =================================
                  ACCOUNT STATISTICS
              ================================= */}

              <section
                className="dashboard-stats-grid"
                aria-label="Account statistics"
              >
                <StatCard
                  icon={ShieldCheck}
                  title="Account Status"
                  value={
                    statistics.accountStatus === "active"
                      ? "Active"
                      : statistics.accountStatus || "Unknown"
                  }
                  description="Current account status"
                  color="green"
                />

                <StatCard
                  icon={Monitor}
                  title="Active Sessions"
                  value={
                    statistics.activeSessions ?? "—"
                  }
                  description="Currently valid sessions"
                  color="indigo"
                />

                <StatCard
                  icon={CalendarDays}
                  title="Account Age"
                  value={
                    statistics.accountAgeDays != null
                      ? `${statistics.accountAgeDays} ${
                          statistics.accountAgeDays === 1
                            ? "day"
                            : "days"
                        }`
                      : "—"
                  }
                  description="Since account registration"
                  color="blue"
                />

                <StatCard
                  icon={Activity}
                  title="Recorded Sessions"
                  value={
                    statistics.totalSessions ?? "—"
                  }
                  description="Session records retained in database"
                  color="purple"
                />
              </section>

              {/* =================================
                  ACCOUNT AND SESSION INFORMATION
              ================================= */}

              <div className="dashboard-detail-grid">

                {/* Account overview */}
                <section className="dashboard-card">

                  <div className="dashboard-card-header">
                    <div className="dashboard-card-heading">
                      <UserRound size={23} />

                      <div>
                        <h3>Account Overview</h3>

                        <p>Your personal information</p>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-account-profile">
                    <div className="dashboard-account-avatar">
                      {getUserInitials(
                        account?.username
                      )}
                    </div>

                    <div>
                      <h3>{account?.username}</h3>

                      <p>{account?.email}</p>
                    </div>
                  </div>

                  <div className="dashboard-info-list">

                    <div className="dashboard-info-row">
                      <UserRound size={18} />

                      <span>Username</span>

                      <strong>
                        {account?.username}
                      </strong>
                    </div>

                    <div className="dashboard-info-row">
                      <Mail size={18} />

                      <span>Email</span>

                      <strong>
                        {account?.email}
                      </strong>
                    </div>

                    <div className="dashboard-info-row">
                      <CalendarDays size={18} />

                      <span>Member Since</span>

                      <strong>
                        {formatDate(account?.createdAt)}
                      </strong>
                    </div>

                    <div className="dashboard-info-row">
                      <Clock3 size={18} />

                      <span>Last Login</span>

                      <strong>
                        {formatDateTime(account?.lastLogin)}
                      </strong>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="dashboard-card-link"
                  >
                    View complete profile

                    <ArrowRight size={17} />
                  </Link>
                </section>

                {/* Current session */}
                <section className="dashboard-card">

                  <div className="dashboard-card-header">
                    <div className="dashboard-card-heading">
                      <Monitor size={23} />

                      <div>
                        <h3>Current Session</h3>

                        <p>Authentication session details</p>
                      </div>
                    </div>

                    <span
                      className={`dashboard-status-badge ${
                        sessionExpired
                          ? "status-expired"
                          : remainingTime === null
                          ? "status-unknown"
                          : "status-active"
                      }`}
                    >
                      {sessionExpired
                        ? "Expired"
                        : remainingTime === null
                        ? "Unknown"
                        : "Active"}
                    </span>
                  </div>

                  <div className="session-countdown">
                    <div className="session-countdown-icon">
                      <Clock3 size={28} />
                    </div>

                    <span>Session time remaining</span>

                    <strong>
                      {remainingTime === null
                        ? "Unavailable"
                        : formatDuration(remainingTime)}
                    </strong>
                  </div>

                  <div
                    className="session-progress-track"
                    role="progressbar"
                    aria-label="Session lifetime remaining"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={
                      Math.round(sessionPercentage)
                    }
                  >
                    <div
                      className="session-progress-fill"
                      style={{
                        width: `${sessionPercentage}%`,
                      }}
                    />
                  </div>

                  <div className="dashboard-info-list">

                    <div className="dashboard-info-row">
                      <CalendarDays size={18} />

                      <span>Session Started</span>

                      <strong>
                        {formatDateTime(
                          currentSession?.createdAt
                        )}
                      </strong>
                    </div>

                    <div className="dashboard-info-row">
                      <Clock3 size={18} />

                      <span>Session Expires</span>

                      <strong>
                        {formatDateTime(
                          currentSession?.expiresAt
                        )}
                      </strong>
                    </div>

                    <div className="dashboard-info-row">
                      <Cookie size={18} />

                      <span>Token Storage</span>

                      <strong>
                        {security.tokenStorage || "—"}
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline btn-block session-refresh-button"
                    onClick={handleRefreshSession}
                    disabled={busy || sessionExpired}
                  >
                    {sessionRefreshing ? (
                      <LoadingSpinner
                        inline
                        size="small"
                        message="Refreshing tokens..."
                      />
                    ) : (
                      <>
                        <RefreshCw size={18} />

                        Refresh Authentication
                      </>
                    )}
                  </button>

                  <p className="session-refresh-note">
                    Refreshing rotates authentication
                    tokens without extending the
                    original session expiration.
                  </p>
                </section>
              </div>

              {/* =================================
                  ACTIVE SESSIONS TABLE
              ================================= */}

              <section
                id="session-information"
                className="dashboard-card dashboard-sessions-card"
              >
                <div className="dashboard-card-header">
                  <div className="dashboard-card-heading">
                    <Monitor size={23} />

                    <div>
                      <h3>Active Sessions</h3>

                      <p>
                        View currently valid
                        authentication sessions.
                      </p>
                    </div>
                  </div>

                  <span className="dashboard-count-badge">
                    {sessions.length} Sessions
                  </span>
                </div>

                {sessions.length === 0 ? (
                  <div className="dashboard-table-empty">
                    <Monitor size={32} />

                    <p>No active sessions found.</p>
                  </div>
                ) : (
                  <div className="dashboard-table-wrapper">
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th>Session</th>

                          <th>Created At</th>

                          <th>Last Updated</th>

                          <th>Expires At</th>

                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {sessions.map((item) => {
                          const expired =
                            new Date(
                              item.expiresAt
                            ).getTime() <= currentTime;

                          return (
                            <tr key={item.id}>
                              <td>
                                <div className="table-session-info">
                                  <div className="table-session-icon">
                                    <Monitor size={19} />
                                  </div>

                                  <div>
                                    <strong>
                                      {item.isCurrent
                                        ? "Current Session"
                                        : "Other Session"}
                                    </strong>

                                    <span>
                                      ID:{" "}
                                      {String(
                                        item.id
                                      ).slice(-8)}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td>
                                {formatDateTime(
                                  item.createdAt
                                )}
                              </td>

                              <td>
                                {formatDateTime(
                                  item.updatedAt
                                )}
                              </td>

                              <td>
                                {formatDateTime(
                                  item.expiresAt
                                )}
                              </td>

                              <td>
                                <span
                                  className={`dashboard-status-badge ${
                                    expired
                                      ? "status-expired"
                                      : "status-active"
                                  }`}
                                >
                                  {expired
                                    ? "Expired"
                                    : "Active"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="dashboard-table-note">
                  <ShieldCheck size={17} />

                  <span>
                    Session validity is verified
                    by the backend during protected
                    API requests.
                  </span>
                </div>
              </section>

              {/* =================================
                  SECURITY OVERVIEW
              ================================= */}

              <section
                id="security-overview"
                className="dashboard-card dashboard-security-card"
              >
                <div className="dashboard-card-header">
                  <div className="dashboard-card-heading">
                    <ShieldCheck size={24} />

                    <div>
                      <h3>Security Overview</h3>

                      <p>
                        Authentication security
                        features reported by the API.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="dashboard-security-grid">
                  {securityFeatures.map((feature) => (
                    <SecurityItem
                      key={feature.title}
                      {...feature}
                    />
                  ))}
                </div>
              </section>

              {/* =================================
                  SESSION RECORD SUMMARY
              ================================= */}

              <section className="dashboard-card">
                <div className="dashboard-card-header">
                  <div className="dashboard-card-heading">
                    <Database size={23} />

                    <div>
                      <h3>Session Record Summary</h3>

                      <p>
                        Session records currently
                        retained in MongoDB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="session-summary-grid">

                  <div className="session-summary-item">
                    <Monitor size={23} />

                    <strong>
                      {statistics.activeSessions ?? "—"}
                    </strong>

                    <span>Active Sessions</span>
                  </div>

                  <div className="session-summary-item">
                    <Database size={23} />

                    <strong>
                      {statistics.totalSessions ?? "—"}
                    </strong>

                    <span>Total Retained Records</span>
                  </div>

                  <div className="session-summary-item">
                    <LogOut size={23} />

                    <strong>
                      {statistics.revokedSessions ?? "—"}
                    </strong>

                    <span>Revoked Sessions</span>
                  </div>
                </div>

                <p className="dashboard-muted-note">
                  Expired session records may be
                  automatically removed by MongoDB.
                  These counts are not lifetime totals.
                </p>
              </section>

              {/* Server information */}
              <div className="dashboard-server-note">
                <Server size={17} />

                <span>
                  Last server update:{" "}
                  {formatDateTime(
                    dashboardData.serverTime
                  )}
                </span>
              </div>
            </>
          )}
        </main>
      </div>

      <Footer compact />
    </div>
  );
};

export default Dashboard;


import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  UserRound,
  LogOut,
  LogIn,
  UserPlus,
  Home,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

import {
  getUserInitials,
} from "../utils/validation";

import {
  getErrorMessage,
} from "../services/api";

import LoadingSpinner from "./LoadingSpinner";
import Alert from "./Alert";

// ========================================
// NAVBAR COMPONENT
// ========================================

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    isAuthenticated,
    loading,
    authLoading,
    logout,
  } = useAuth();

  // ========================================
  // NAVBAR STATE
  // ========================================

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const [logoutError, setLogoutError] =
    useState("");

  const dropdownRef = useRef(null);

  // ========================================
  // CLOSE MENUS ON ROUTE CHANGE
  // ========================================

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    setLogoutError("");
  }, [location.pathname]);

  // ========================================
  // CLOSE DROPDOWN ON OUTSIDE CLICK
  // ========================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // ========================================
  // HANDLE ESCAPE KEY
  // ========================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // ========================================
  // HANDLE LOGOUT
  // ========================================

  const handleLogout = async () => {
    if (authLoading) {
      return;
    }

    setLogoutError("");

    try {
      await logout();

      setDropdownOpen(false);
      setMobileMenuOpen(false);

      navigate("/login", {
        replace: true,
        state: {
          message:
            "You have been logged out successfully.",
          type: "success",
        },
      });
    } catch (error) {
      setLogoutError(
        getErrorMessage(error)
      );
    }
  };

  // ========================================
  // NAVIGATION LINK CLASS
  // ========================================

  const getNavLinkClass = ({ isActive }) => {
    return `nav-link ${
      isActive ? "nav-link-active" : ""
    }`;
  };

  // ========================================
  // RENDER NAVBAR
  // ========================================

  return (
    <header className="navbar">

      <div className="navbar-container">

        {/* =================================
            APPLICATION LOGO
        ================================= */}

        <Link
          to="/"
          className="navbar-brand"
          aria-label="SecureAuth home"
        >
          <img
            src="/secureauth.svg"
            alt=""
            className="navbar-logo"
            width="40"
            height="40"
          />

          <span className="navbar-brand-text">
            Secure<span>Auth</span>
          </span>
        </Link>

        {/* =================================
            DESKTOP NAVIGATION
        ================================= */}

        <nav
          className="navbar-desktop-links"
          aria-label="Main navigation"
        >
          <NavLink
            to="/"
            end
            className={getNavLinkClass}
          >
            Home
          </NavLink>

          {!loading && isAuthenticated && (
            <>
              <NavLink
                to="/dashboard"
                className={getNavLinkClass}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/profile"
                className={getNavLinkClass}
              >
                Profile
              </NavLink>
            </>
          )}
        </nav>

        {/* =================================
            DESKTOP AUTHENTICATION ACTIONS
        ================================= */}

        <div className="navbar-desktop-actions">

          {/* Authentication loading */}
          {loading ? (
            <LoadingSpinner
              inline
              size="small"
              message=""
            />
          ) : isAuthenticated ? (

            /* Authenticated user dropdown */

            <div
              className="navbar-user-menu"
              ref={dropdownRef}
            >
              <button
                type="button"
                className={`navbar-user-button ${
                  dropdownOpen
                    ? "navbar-user-button-active"
                    : ""
                }`}
                onClick={() =>
                  setDropdownOpen(
                    (previous) => !previous
                  )
                }
                aria-expanded={dropdownOpen}
                aria-controls="navbar-user-dropdown"
                aria-label="Toggle account menu"
              >
                {/* User avatar */}
                <div className="navbar-avatar">
                  {getUserInitials(
                    user?.username
                  )}
                </div>

                {/* Username */}
                <div className="navbar-user-details">
                  <span className="navbar-username">
                    {user?.username || "User"}
                  </span>

                  <span className="navbar-user-role">
                    My Account
                  </span>
                </div>

                <ChevronDown
                  size={17}
                  className={`navbar-chevron ${
                    dropdownOpen
                      ? "navbar-chevron-open"
                      : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* User dropdown menu */}
              {dropdownOpen && (
                <div
                  id="navbar-user-dropdown"
                  className="navbar-dropdown"
                >
                  {/* User information */}
                  <div className="dropdown-user-info">
                    <div className="dropdown-avatar">
                      {getUserInitials(
                        user?.username
                      )}
                    </div>

                    <div className="dropdown-user-text">
                      <strong>
                        {user?.username || "User"}
                      </strong>

                      <span>
                        {user?.email}
                      </span>
                    </div>
                  </div>

                  {/* Authentication status */}
                  <div className="dropdown-session-status">
                    <ShieldCheck
                      size={15}
                      aria-hidden="true"
                    />

                    <span>
                      Authenticated session
                    </span>
                  </div>

                  <div className="dropdown-divider" />

                  {/* Dashboard link */}
                  <Link
                    to="/dashboard"
                    className="dropdown-item"
                    onClick={() =>
                      setDropdownOpen(false)
                    }
                  >
                    <LayoutDashboard size={18} />

                    <span>Dashboard</span>
                  </Link>

                  {/* Profile link */}
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() =>
                      setDropdownOpen(false)
                    }
                  >
                    <UserRound size={18} />

                    <span>My Profile</span>
                  </Link>

                  <div className="dropdown-divider" />

                  {/* Logout button */}
                  <button
                    type="button"
                    className="dropdown-item dropdown-logout"
                    onClick={handleLogout}
                    disabled={authLoading}
                  >
                    {authLoading ? (
                      <LoadingSpinner
                        inline
                        size="small"
                        message="Signing out..."
                      />
                    ) : (
                      <>
                        <LogOut size={18} />

                        <span>Sign Out</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (

            /* Guest navigation */

            <>
              <Link
                to="/login"
                className="btn btn-outline navbar-login-button"
              >
                <LogIn size={17} />

                Sign In
              </Link>

              <Link
                to="/register"
                className="btn btn-primary navbar-register-button"
              >
                Get Started

                <ArrowRight size={17} />
              </Link>
            </>
          )}
        </div>

        {/* =================================
            MOBILE MENU TOGGLE
        ================================= */}

        <button
          type="button"
          className="navbar-mobile-toggle"
          onClick={() =>
            setMobileMenuOpen(
              (previous) => !previous
            )
          }
          aria-label={
            mobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
          aria-controls="navbar-mobile-menu"
        >
          {mobileMenuOpen ? (
            <X size={26} />
          ) : (
            <Menu size={26} />
          )}
        </button>
      </div>

      {/* =================================
          MOBILE NAVIGATION MENU
      ================================= */}

      {mobileMenuOpen && (
        <nav
          id="navbar-mobile-menu"
          className="navbar-mobile-menu"
          aria-label="Mobile navigation"
        >
          {/* Mobile user information */}
          {!loading && isAuthenticated && (
            <div className="mobile-user-info">
              <div className="navbar-avatar">
                {getUserInitials(
                  user?.username
                )}
              </div>

              <div className="mobile-user-details">
                <strong>
                  {user?.username}
                </strong>

                <span>
                  {user?.email}
                </span>
              </div>
            </div>
          )}

          {/* Home link */}
          <NavLink
            to="/"
            end
            className={getNavLinkClass}
            onClick={() =>
              setMobileMenuOpen(false)
            }
          >
            <Home size={20} />

            Home
          </NavLink>

          {loading ? (
            <LoadingSpinner
              size="small"
              message="Checking authentication..."
            />
          ) : isAuthenticated ? (
            <>
              {/* Dashboard link */}
              <NavLink
                to="/dashboard"
                className={getNavLinkClass}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >
                <LayoutDashboard size={20} />

                Dashboard
              </NavLink>

              {/* Profile link */}
              <NavLink
                to="/profile"
                className={getNavLinkClass}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >
                <UserRound size={20} />

                My Profile
              </NavLink>

              <div className="dropdown-divider" />

              {/* Mobile logout */}
              <button
                type="button"
                className="mobile-logout-button"
                onClick={handleLogout}
                disabled={authLoading}
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

                    Sign Out
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* Mobile login */}
              <NavLink
                to="/login"
                className={getNavLinkClass}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >
                <LogIn size={20} />

                Sign In
              </NavLink>

              {/* Mobile registration */}
              <Link
                to="/register"
                className="btn btn-primary btn-block mobile-register-button"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >
                <UserPlus size={19} />

                Create Account

                <ArrowRight size={18} />
              </Link>
            </>
          )}
        </nav>
      )}

      {/* =================================
          LOGOUT ERROR
      ================================= */}

      {logoutError && (
        <div className="navbar-alert-container">
          <Alert
            type="error"
            title="Unable to sign out"
            message={logoutError}
            dismissible
            onClose={() => setLogoutError("")}
          />
        </div>
      )}
    </header>
  );
};

export default Navbar;

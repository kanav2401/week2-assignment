
import { useEffect } from "react";

import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// ========================================
// IMPORT APPLICATION PAGES
// ========================================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// ========================================
// IMPORT ROUTE PROTECTION COMPONENTS
// ========================================

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// ========================================
// IMPORT GLOBAL STYLES
// ========================================

import "./styles/index.css";
import "./styles/App.css";
import "./styles/auth.css";
import "./styles/dashboard.css";

// ========================================
// SCROLL TO TOP COMPONENT
// ========================================

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
};

// ========================================
// PAGE TITLE MANAGEMENT
// ========================================

const PageTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageTitles = {
      "/": "SecureAuth | Secure Authentication Platform",
      "/login": "Sign In | SecureAuth",
      "/register": "Create Account | SecureAuth",
      "/dashboard": "Dashboard | SecureAuth",
      "/profile": "My Profile | SecureAuth",
    };

    const normalizedPath =
      pathname.replace(/\/+$/, "") || "/";

    document.title =
      pageTitles[normalizedPath] ||
      "Page Not Found | SecureAuth";
  }, [pathname]);

  return null;
};

// ========================================
// SAFE AUTHENTICATION REDIRECT
// ========================================

const GuestOnlyRoute = () => {
  const location = useLocation();

  const previousLocation = location.state?.from;

  const allowedPaths = [
    "/dashboard",
    "/profile",
  ];

  let redirectTo = "/dashboard";

  if (
    previousLocation &&
    typeof previousLocation === "object" &&
    allowedPaths.includes(previousLocation.pathname)
  ) {
    redirectTo = {
      pathname: previousLocation.pathname,
      search: previousLocation.search || "",
      hash: previousLocation.hash || "",
    };
  }

  return (
    <PublicRoute redirectTo={redirectTo} />
  );
};

// ========================================
// MAIN APPLICATION COMPONENT
// ========================================

const App = () => {
  return (
    <div className="app">

      {/* Reset scroll position on navigation */}

      <ScrollToTop />

      {/* Update browser tab title */}

      <PageTitle />

      {/* Application routes */}

      <Routes>

        {/* ========================================
            PUBLIC ROUTES
        ======================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* ========================================
            GUEST-ONLY ROUTES

            Authenticated users are redirected
            to the dashboard or requested page.
        ======================================== */}

        <Route element={<GuestOnlyRoute />}>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

        </Route>

        {/* ========================================
            PROTECTED ROUTES

            Only authenticated users can
            access these pages.
        ======================================== */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>

        {/* ========================================
            NOT FOUND ROUTE
        ======================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </div>
  );
};

export default App;

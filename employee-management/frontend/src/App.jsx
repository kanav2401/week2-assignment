
import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";

import {
  Home,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

// Layout components
import Sidebar from "./components/sidebar";
import Navbar from "./components/Navbar";

// Application pages
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";

// Application styles
import "./styles/App.css";
import "./styles/components.css";

// Scroll to top when navigating between pages
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [pathname]);

  return null;
};

// Page not found component
const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="card not-found-card">
        <div className="not-found-icon">
          <AlertCircle
            size={60}
            strokeWidth={1.5}
          />
        </div>

        <h1 className="not-found-code">
          404
        </h1>

        <h2>Page Not Found</h2>

        <p>
          The page you are looking for does not
          exist or may have been moved.
        </p>

        <div className="not-found-actions">
          <Link
            to="/"
            className="btn btn-primary"
          >
            <Home size={18} />

            Go to Dashboard
          </Link>

          <Link
            to="/employees"
            className="btn btn-secondary"
          >
            <ArrowLeft size={18} />

            View Employees
          </Link>
        </div>
      </div>
    </div>
  );
};

// Main application layout
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const location = useLocation();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar when Escape is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  // Open mobile sidebar
  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };

  // Close mobile sidebar
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      {/* Application sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
      />

      {/* Main application content */}
      <div className="app-main">
        {/* Top navigation bar */}
        <Navbar
          onMenuClick={handleOpenSidebar}
        />

        {/* Scroll restoration */}
        <ScrollToTop />

        {/* Page content */}
        <main
          className="app-content"
          id="main-content"
        >
          <Routes>
            {/* Dashboard page */}
            <Route
              path="/"
              element={<Dashboard />}
            />

            {/* Employee directory */}
            <Route
              path="/employees"
              element={<Employees />}
            />

            {/* Add employee page */}
            <Route
              path="/employees/add"
              element={
                <AddEmployee key="add-employee" />
              }
            />

            {/* Edit employee page */}
            <Route
              path="/employees/edit/:id"
              element={
                <AddEmployee key="edit-employee" />
              }
            />

            {/* Invalid route */}
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </main>

        {/* Application footer */}
        <footer className="app-footer">
          <div className="app-footer-left">
            <p>
              © {new Date().getFullYear()} StaffHub.
              All rights reserved.
            </p>
          </div>

          <div className="app-footer-right">
            <span>
              Employee Management System
            </span>

            <span className="footer-separator">
              |
            </span>

            <span>Version 1.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

// Root application component
const App = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;

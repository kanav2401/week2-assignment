
import { useLocation } from "react-router-dom";

import {
  Menu,
  CalendarDays,
  UserRound,
  ChevronRight,
  LayoutDashboard
} from "lucide-react";

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();

  // Determine page title based on current route
  const getPageDetails = () => {
    const pathname = location.pathname;

    if (pathname === "/") {
      return {
        title: "Dashboard",
        subtitle: "Overview of your workforce"
      };
    }

    if (pathname === "/employees") {
      return {
        title: "Employees",
        subtitle: "Manage your employee records"
      };
    }

    if (pathname === "/employees/add") {
      return {
        title: "Add Employee",
        subtitle: "Create a new employee record"
      };
    }

    if (pathname.startsWith("/employees/edit/")) {
      return {
        title: "Edit Employee",
        subtitle: "Update employee information"
      };
    }

    return {
      title: "StaffHub",
      subtitle: "Employee Management System"
    };
  };

  const { title, subtitle } = getPageDetails();

  // Format current date
  const currentDate = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );

  return (
    <header className="navbar">
      {/* Left section */}
      <div className="navbar-left">
        {/* Mobile menu button */}
        <button
          type="button"
          className="navbar-menu-btn"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu size={24} />
        </button>

        {/* Page information */}
        <div className="navbar-page-info">
          <div className="navbar-breadcrumb">
            <LayoutDashboard size={14} />

            <span>Workspace</span>

            <ChevronRight size={14} />

            <span className="breadcrumb-active">
              {title}
            </span>
          </div>

          <h1 className="navbar-title">
            {title}
          </h1>

          <p className="navbar-subtitle">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="navbar-right">
        {/* Current date */}
        <div className="navbar-date">
          <CalendarDays
            size={19}
            strokeWidth={1.8}
          />

          <span>{currentDate}</span>
        </div>

        <div className="navbar-divider" />

        {/* Administrator profile */}
        <div className="navbar-profile">
          <div className="navbar-avatar">
            <UserRound size={22} />
          </div>

          <div className="navbar-profile-info">
            <h4>HR Admin</h4>

            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

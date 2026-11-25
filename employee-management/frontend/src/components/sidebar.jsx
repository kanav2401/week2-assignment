
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserPlus,
  Building2,
  ShieldCheck,
  X
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard
    },
    {
      name: "Employees",
      path: "/employees",
      icon: Users
    },
    {
      name: "Add Employee",
      path: "/employees/add",
      icon: UserPlus
    }
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${isOpen ? "sidebar-open" : ""}`}
        aria-label="Main navigation"
      >
        {/* Application logo */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <Building2 size={25} />
            </div>

            <div className="sidebar-brand-text">
              <h2>StaffHub</h2>
              <span>Employee Management</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation section */}
        <div className="sidebar-content">
          <p className="sidebar-section-title">
            WORKSPACE
          </p>

          <nav className="sidebar-nav">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-link ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  <Icon size={20} strokeWidth={1.8} />

                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="sidebar-footer">
          <div className="sidebar-admin">
            <div className="sidebar-admin-avatar">
              <ShieldCheck size={22} />
            </div>

            <div className="sidebar-admin-info">
              <h4>HR Administrator</h4>
              <span>Management Portal</span>
            </div>
          </div>

          <div className="sidebar-copyright">
            <p>StaffHub © {new Date().getFullYear()}</p>
            <span>Version 1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

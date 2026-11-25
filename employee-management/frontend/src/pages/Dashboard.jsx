
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Users,
  Building2,
  IndianRupee,
  Wallet,
  UserPlus,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  BarChart3,
  Clock,
  LayoutDashboard
} from "lucide-react";

import {
  getAllEmployees
} from "../services/employeeService";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch employee records
  useEffect(() => {
    let active = true;

    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllEmployees({
          sortBy: "createdAt",
          order: "desc"
        });

        if (active) {
          setEmployees(response.data || []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message ||
              "Failed to load dashboard data"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchEmployees();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((previous) => previous + 1);
  };

  // Format salary in Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    });
  };

  // Generate employee initials
  const getInitials = (name) => {
    return (name || "Employee")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  // Dashboard statistics
  const totalEmployees = employees.length;

  const totalDepartments = new Set(
    employees
      .map((employee) => employee.department)
      .filter(Boolean)
  ).size;

  const totalSalary = employees.reduce(
    (total, employee) =>
      total + (Number(employee.salary) || 0),
    0
  );

  const averageSalary =
    totalEmployees > 0
      ? totalSalary / totalEmployees
      : 0;

  // Department distribution
  const departmentCounts = employees.reduce(
    (result, employee) => {
      const department =
        employee.department || "Unassigned";

      result[department] =
        (result[department] || 0) + 1;

      return result;
    },
    Object.create(null)
  );

  const departmentDistribution = Object.entries(
    departmentCounts
  )
    .map(([department, count]) => ({
      department,
      count,
      percentage:
        totalEmployees > 0
          ? (count / totalEmployees) * 100
          : 0
    }))
    .sort((a, b) => b.count - a.count);

  // Department chart colors
  const chartColors = [
    "#4f46e5",
    "#059669",
    "#2563eb",
    "#d97706",
    "#db2777",
    "#0891b2",
    "#7c3aed",
    "#ea580c"
  ];

  // Recently added employees
  const recentEmployees = [...employees]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  // Statistics cards
  const statistics = [
    {
      title: "Total Employees",
      value: totalEmployees,
      description: "Registered employee records",
      icon: Users,
      color: "primary"
    },
    {
      title: "Total Departments",
      value: totalDepartments,
      description: "Departments across workforce",
      icon: Building2,
      color: "success"
    },
    {
      title: "Total Salary",
      value: formatCurrency(totalSalary),
      description: "Combined employee salaries",
      icon: IndianRupee,
      color: "warning"
    },
    {
      title: "Average Salary",
      value: formatCurrency(averageSalary),
      description: "Average salary per employee",
      icon: Wallet,
      color: "info"
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div
        className="loading-container"
        role="status"
        aria-live="polite"
      >
        <div className="spinner" />

        <h3>Loading Dashboard</h3>

        <p>
          Please wait while we fetch your workforce data.
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="card empty-state">
        <AlertCircle size={48} />

        <h3>Unable to Load Dashboard</h3>

        <p role="alert">{error}</p>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleRefresh}
        >
          <RefreshCw size={18} />

          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Welcome banner */}
      <section className="dashboard-welcome">
        <div className="welcome-content">
          <div className="welcome-label">
            <LayoutDashboard size={16} />

            <span>WORKFORCE OVERVIEW</span>
          </div>

          <h1>Welcome to StaffHub!</h1>

          <p>
            Manage your workforce, monitor employee
            records and organize your departments
            from one central workspace.
          </p>

          <div className="welcome-actions">
            <Link
              to="/employees/add"
              className="btn welcome-primary-btn"
            >
              <UserPlus size={18} />

              Add Employee
            </Link>

            <Link
              to="/employees"
              className="btn welcome-secondary-btn"
            >
              View Employees

              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        <div
          className="welcome-illustration"
          aria-hidden="true"
        >
          <Users size={120} strokeWidth={1.2} />
        </div>
      </section>

      {/* Dashboard section heading */}
      <div className="dashboard-section-header">
        <div>
          <h2>Workforce Statistics</h2>

          <p>
            An overview of your employee information
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleRefresh}
        >
          <RefreshCw size={17} />

          Refresh Data
        </button>
      </div>

      {/* Statistics cards */}
      <section className="dashboard-stats-grid">
        {statistics.map((statistic) => {
          const Icon = statistic.icon;

          return (
            <div
              className="stat-card"
              key={statistic.title}
            >
              <div className="stat-card-top">
                <span className="stat-card-label">
                  {statistic.title}
                </span>

                <div
                  className={`stat-card-icon stat-icon-${statistic.color}`}
                >
                  <Icon size={23} strokeWidth={1.8} />
                </div>
              </div>

              <h2 className="stat-card-value">
                {statistic.value}
              </h2>

              <p className="stat-card-description">
                {statistic.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Department and recent employee sections */}
      <div className="dashboard-details-grid">
        {/* Department distribution */}
        <section className="card department-card">
          <div className="dashboard-card-header">
            <div className="dashboard-card-icon">
              <BarChart3 size={22} />
            </div>

            <div>
              <h3>Department Distribution</h3>

              <p>Employees across departments</p>
            </div>
          </div>

          {departmentDistribution.length === 0 ? (
            <div className="empty-state">
              <Building2 size={40} />

              <h3>No Department Data</h3>

              <p>
                Add employees to view department
                distribution.
              </p>
            </div>
          ) : (
            <div className="department-chart">
              {departmentDistribution.map(
                (item, index) => (
                  <div
                    className="department-chart-item"
                    key={item.department}
                  >
                    <div className="department-chart-label">
                      <div className="department-chart-name">
                        <span
                          className="department-color-dot"
                          style={{
                            backgroundColor:
                              chartColors[
                                index %
                                  chartColors.length
                              ]
                          }}
                        />

                        <span>{item.department}</span>
                      </div>

                      <span className="department-chart-count">
                        {item.count}{" "}
                        {item.count === 1
                          ? "employee"
                          : "employees"}
                      </span>
                    </div>

                    <div
                      className="department-progress-track"
                      role="progressbar"
                      aria-label={item.department}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Number(
                        item.percentage.toFixed(1)
                      )}
                    >
                      <div
                        className="department-progress-fill"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor:
                            chartColors[
                              index %
                                chartColors.length
                            ]
                        }}
                      />
                    </div>

                    <span className="department-percentage">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                )
              )}
            </div>
          )}

          <div className="department-card-footer">
            <span>Total Departments</span>

            <strong>{totalDepartments}</strong>
          </div>
        </section>

        {/* Recently added employees */}
        <section className="card recent-employees-card">
          <div className="dashboard-card-header">
            <div className="dashboard-card-icon">
              <Clock size={22} />
            </div>

            <div>
              <h3>Recently Added Employees</h3>

              <p>Latest additions to your workforce</p>
            </div>
          </div>

          {recentEmployees.length === 0 ? (
            <div className="empty-state">
              <Users size={40} />

              <h3>No Employees Yet</h3>

              <p>
                Recently added employees will appear
                here.
              </p>

              <Link
                to="/employees/add"
                className="btn btn-primary btn-sm"
              >
                <UserPlus size={16} />

                Add Employee
              </Link>
            </div>
          ) : (
            <div className="recent-employees-list">
              {recentEmployees.map(
                (employee, index) => (
                  <div
                    className="recent-employee-item"
                    key={employee._id}
                  >
                    <div
                      className="recent-employee-avatar"
                      style={{
                        backgroundColor:
                          chartColors[
                            index % chartColors.length
                          ]
                      }}
                    >
                      {getInitials(employee.name)}
                    </div>

                    <div className="recent-employee-info">
                      <h4>{employee.name}</h4>

                      <p>{employee.role}</p>

                      <span>
                        {employee.department}
                      </span>
                    </div>

                    <div className="recent-employee-date">
                      <span>Added</span>

                      <strong>
                        {formatDate(employee.createdAt)}
                      </strong>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          <Link
            to="/employees"
            className="dashboard-view-all"
          >
            View All Employees

            <ArrowRight size={17} />
          </Link>
        </section>
      </div>

      {/* Quick actions */}
      <section className="dashboard-quick-actions">
        <div className="dashboard-section-header">
          <div>
            <h2>Quick Actions</h2>

            <p>
              Access frequently used management tools
            </p>
          </div>
        </div>

        <div className="quick-actions-grid">
          <Link
            to="/employees/add"
            className="quick-action-card"
          >
            <div className="quick-action-icon quick-action-primary">
              <UserPlus size={26} />
            </div>

            <div className="quick-action-info">
              <h3>Add New Employee</h3>

              <p>
                Register a new employee in the system
              </p>
            </div>

            <ArrowRight
              size={20}
              className="quick-action-arrow"
            />
          </Link>

          <Link
            to="/employees"
            className="quick-action-card"
          >
            <div className="quick-action-icon quick-action-success">
              <Users size={26} />
            </div>

            <div className="quick-action-info">
              <h3>Manage Employees</h3>

              <p>
                View, search, update and delete records
              </p>
            </div>

            <ArrowRight
              size={20}
              className="quick-action-arrow"
            />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;


import {
  Pencil,
  Trash2,
  Users,
  AlertCircle,
  RefreshCw,
  UserPlus,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from "lucide-react";

import { Link } from "react-router-dom";

const EmployeeTable = ({
  employees = [],
  loading = false,
  error = "",
  onEdit,
  onDelete,
  onRefresh,
  sortBy = "createdAt",
  order = "desc",
  onSort
}) => {
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

  // Generate consistent avatar colors
  const getAvatarColor = (name) => {
    const colors = [
      "#4f46e5",
      "#2563eb",
      "#0891b2",
      "#059669",
      "#d97706",
      "#db2777",
      "#7c3aed",
      "#ea580c"
    ];

    const hash = (name || "Employee")
      .split("")
      .reduce(
        (total, char) => total + char.charCodeAt(0),
        0
      );

    return colors[hash % colors.length];
  };

  // Format salary in Indian Rupees
  const formatSalary = (salary) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(salary);
  };

  // Format employee joining date
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

  // Assign department badge colors
  const getDepartmentClass = (department) => {
    const departmentName =
      department?.toLowerCase().trim() || "";

    const departmentColors = {
      engineering: "badge-primary",
      "human resources": "badge-success",
      hr: "badge-success",
      finance: "badge-warning",
      marketing: "badge-info",
      sales: "badge-danger",
      operations: "badge-primary",
      it: "badge-info",
      design: "badge-warning",
      administration: "badge-success"
    };

    return (
      departmentColors[departmentName] ||
      "badge-primary"
    );
  };

  // Handle sorting through table headers
  const handleSort = (field) => {
    if (!onSort) return;

    const nextOrder =
      sortBy === field && order === "asc"
        ? "desc"
        : "asc";

    onSort(field, nextOrder);
  };

  // Display sorting icon
  const renderSortIcon = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown size={14} />;
    }

    return order === "asc" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  // Get accessible sorting status
  const getAriaSort = (field) => {
    if (sortBy !== field) return "none";

    return order === "asc"
      ? "ascending"
      : "descending";
  };

  // Loading state
  if (loading) {
    return (
      <div
        className="loading-container"
        role="status"
        aria-live="polite"
      >
        <div className="spinner" />

        <h3>Loading Employees</h3>

        <p>Please wait while we fetch employee records.</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="empty-state table-error-state">
        <AlertCircle size={48} />

        <h3>Unable to Load Employees</h3>

        <p role="alert">{error}</p>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onRefresh}
        >
          <RefreshCw size={17} />

          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Users size={48} />
        </div>

        <h3>No Employees Found</h3>

        <p>
          No employee records match your current
          search or filters. Try changing your filters
          or add a new employee.
        </p>

        <Link
          to="/employees/add"
          className="btn btn-primary"
        >
          <UserPlus size={18} />

          Add Employee
        </Link>
      </div>
    );
  }

  return (
    <div className="employee-table-container">
      {/* Table wrapper for responsive scrolling */}
      <div className="employee-table-wrapper">
        <table
          className="employee-table"
          aria-label="Employee records"
        >
          <thead>
            <tr>
              <th scope="col" className="table-number">
                #
              </th>

              <th
                scope="col"
                aria-sort={getAriaSort("name")}
              >
                <button
                  type="button"
                  className="table-sort-btn"
                  onClick={() => handleSort("name")}
                >
                  Employee

                  {renderSortIcon("name")}
                </button>
              </th>

              <th
                scope="col"
                aria-sort={getAriaSort("department")}
              >
                <button
                  type="button"
                  className="table-sort-btn"
                  onClick={() =>
                    handleSort("department")
                  }
                >
                  Department

                  {renderSortIcon("department")}
                </button>
              </th>

              <th
                scope="col"
                aria-sort={getAriaSort("role")}
              >
                <button
                  type="button"
                  className="table-sort-btn"
                  onClick={() => handleSort("role")}
                >
                  Job Role

                  {renderSortIcon("role")}
                </button>
              </th>

              <th
                scope="col"
                aria-sort={getAriaSort("salary")}
              >
                <button
                  type="button"
                  className="table-sort-btn"
                  onClick={() => handleSort("salary")}
                >
                  Salary

                  {renderSortIcon("salary")}
                </button>
              </th>

              <th
                scope="col"
                aria-sort={getAriaSort("joinDate")}
              >
                <button
                  type="button"
                  className="table-sort-btn"
                  onClick={() =>
                    handleSort("joinDate")
                  }
                >
                  Joining Date

                  {renderSortIcon("joinDate")}
                </button>
              </th>

              <th scope="col" className="table-actions">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee, index) => (
              <tr key={employee._id}>
                {/* Serial number */}
                <td className="table-number">
                  {index + 1}
                </td>

                {/* Employee information */}
                <td>
                  <div className="employee-info">
                    <div
                      className="employee-avatar"
                      style={{
                        backgroundColor: getAvatarColor(
                          employee.name
                        )
                      }}
                    >
                      {getInitials(employee.name)}
                    </div>

                    <div className="employee-details">
                      <span className="employee-name">
                        {employee.name}
                      </span>

                      <span className="employee-id">
                        ID:{" "}
                        {employee._id
                          .slice(-6)
                          .toUpperCase()}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Department */}
                <td>
                  <span
                    className={`badge ${getDepartmentClass(
                      employee.department
                    )}`}
                  >
                    {employee.department}
                  </span>
                </td>

                {/* Job role */}
                <td className="employee-role">
                  {employee.role}
                </td>

                {/* Salary */}
                <td className="employee-salary">
                  {formatSalary(employee.salary)}
                </td>

                {/* Joining date */}
                <td className="employee-date">
                  {formatDate(employee.joinDate)}
                </td>

                {/* Edit and delete actions */}
                <td>
                  <div className="table-action-buttons">
                    <button
                      type="button"
                      className="icon-btn edit-btn"
                      onClick={() =>
                        onEdit(employee._id)
                      }
                      title="Edit employee"
                      aria-label={`Edit ${employee.name}`}
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      className="icon-btn delete-btn"
                      onClick={() => onDelete(employee)}
                      title="Delete employee"
                      aria-label={`Delete ${employee.name}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table footer */}
      <div className="employee-table-footer">
        <p>
          Showing <strong>{employees.length}</strong>{" "}
          {employees.length === 1
            ? "employee"
            : "employees"}
        </p>

        <span className="text-muted">
          Employee Management System
        </span>
      </div>
    </div>
  );
};

export default EmployeeTable;

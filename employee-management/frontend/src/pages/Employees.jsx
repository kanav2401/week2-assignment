
import {
  useEffect,
  useState,
  useCallback
} from "react";

import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  Users,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Building2,
  X
} from "lucide-react";

import SearchBar from "../components/SearchBar";
import EmployeeTable from "../components/EmployeeTable";
import ConfirmDialog from "../components/ConfirmDialog";

import {
  getAllEmployees,
  deleteEmployee
} from "../services/employeeService";

const Employees = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Employee states
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [totalEmployees, setTotalEmployees] =
    useState(0);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");
  const [summaryError, setSummaryError] =
    useState("");

  // Search and filter states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] =
    useState("");
  const [department, setDepartment] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // Refresh state
  const [refreshKey, setRefreshKey] = useState(0);

  // Delete confirmation states
  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState("");

  // Debounce employee search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch employee records with filters
  useEffect(() => {
    let active = true;

    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          sortBy,
          order
        };

        if (debouncedSearch) {
          params.search = debouncedSearch;
        }

        if (department) {
          params.department = department;
        }

        const response = await getAllEmployees(
          params
        );

        if (active) {
          setEmployees(response.data || []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message ||
              "Failed to fetch employee records"
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
  }, [
    debouncedSearch,
    department,
    sortBy,
    order,
    refreshKey
  ]);

  // Fetch all employees for summary and departments
  useEffect(() => {
    let active = true;

    const fetchEmployeeSummary = async () => {
      try {
        setSummaryError("");

        const response = await getAllEmployees();

        const allEmployees = response.data || [];

        // Extract unique department names
        const uniqueDepartments = [
          ...new Set(
            allEmployees
              .map((employee) => employee.department)
              .filter(Boolean)
          )
        ].sort((a, b) => a.localeCompare(b));

        if (active) {
          setDepartments(uniqueDepartments);
          setTotalEmployees(allEmployees.length);

          // Reset department if it no longer exists
          setDepartment((previous) => {
            if (
              previous &&
              !uniqueDepartments.includes(previous)
            ) {
              return "";
            }

            return previous;
          });
        }
      } catch (err) {
        if (active) {
          setSummaryError(
            "Unable to load employee summary. Please refresh."
          );
        }
      }
    };

    fetchEmployeeSummary();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  // Receive success message after adding or editing
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);

      // Clear navigation state to prevent repetition
      navigate(location.pathname, {
        replace: true,
        state: null
      });
    }
  }, [
    location.state,
    location.pathname,
    navigate
  ]);

  // Automatically hide success notifications
  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  // Refresh employee records
  const handleRefresh = useCallback(() => {
    setRefreshKey((previous) => previous + 1);
  }, []);

  // Handle sorting from table headers
  const handleSort = (field, direction) => {
    setSortBy(field);
    setOrder(direction);
  };

  // Navigate to edit employee page
  const handleEdit = (employeeId) => {
    navigate(`/employees/edit/${employeeId}`);
  };

  // Open delete confirmation dialog
  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setDeleteError("");
    setIsDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const handleCancelDelete = useCallback(() => {
    if (deleteLoading) return;

    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
    setDeleteError("");
  }, [deleteLoading]);

  // Confirm employee deletion
  const handleConfirmDelete = async (employee) => {
    if (!employee?._id || deleteLoading) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError("");
      setSuccessMessage("");

      const response = await deleteEmployee(
        employee._id
      );

      // Remove deleted employee from current list
      setEmployees((previous) =>
        previous.filter(
          (item) => item._id !== employee._id
        )
      );

      setSuccessMessage(
        response.message ||
          `${employee.name} deleted successfully`
      );

      // Close confirmation dialog
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);

      // Refresh employee list and department summary
      handleRefresh();
    } catch (err) {
      setDeleteError(
        err.message ||
          "Failed to delete employee. Please try again."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="employees-page">
      {/* Page heading */}
      <div className="employees-page-header">
        <div>
          <div className="page-section-label">
            <Users size={16} />

            <span>EMPLOYEE MANAGEMENT</span>
          </div>

          <h1>Employee Directory</h1>

          <p>
            View, search, add, update and manage
            all employee records from one place.
          </p>
        </div>

        <Link
          to="/employees/add"
          className="btn btn-primary"
        >
          <UserPlus size={19} />

          Add Employee
        </Link>
      </div>

      {/* Success notification */}
      {successMessage && (
        <div
          className="alert alert-success notification-alert"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={20} />

          <span>{successMessage}</span>

          <button
            type="button"
            className="notification-close"
            onClick={() => setSuccessMessage("")}
            aria-label="Dismiss notification"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Summary error notification */}
      {summaryError && (
        <div
          className="alert alert-warning"
          role="alert"
        >
          <AlertCircle size={19} />

          <span>{summaryError}</span>
        </div>
      )}

      {/* Employee summary cards */}
      <div className="employee-summary-grid">
        {/* Total employees */}
        <div className="employee-summary-card">
          <div className="employee-summary-icon summary-icon-primary">
            <Users size={24} />
          </div>

          <div className="employee-summary-info">
            <span>Total Employees</span>

            <h2>
              {summaryError ? "—" : totalEmployees}
            </h2>
          </div>
        </div>

        {/* Total departments */}
        <div className="employee-summary-card">
          <div className="employee-summary-icon summary-icon-success">
            <Building2 size={24} />
          </div>

          <div className="employee-summary-info">
            <span>Total Departments</span>

            <h2>
              {summaryError ? "—" : departments.length}
            </h2>
          </div>
        </div>

        {/* Filtered employee results */}
        <div className="employee-summary-card">
          <div className="employee-summary-icon summary-icon-info">
            <Users size={24} />
          </div>

          <div className="employee-summary-info">
            <span>Showing Results</span>

            <h2>
              {loading || error
                ? "—"
                : employees.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Employee directory card */}
      <section className="card employees-directory-card">
        <div className="employees-directory-header">
          <div>
            <h2>All Employees</h2>

            <p>
              Search, filter and manage employee
              information.
            </p>
          </div>

          <span className="badge badge-primary">
            {summaryError
              ? "Total unavailable"
              : `${totalEmployees} Total`}
          </span>
        </div>

        {/* Search, filter and sort controls */}
        <SearchBar
          search={search}
          setSearch={setSearch}
          department={department}
          setDepartment={setDepartment}
          sortBy={sortBy}
          setSortBy={setSortBy}
          order={order}
          setOrder={setOrder}
          departments={departments}
          onRefresh={handleRefresh}
          loading={loading}
        />

        {/* Employee records table */}
        <EmployeeTable
          employees={employees}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={handleRefresh}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
        />
      </section>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        employee={selectedEmployee}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleteLoading}
        error={deleteError}
      />
    </div>
  );
};

export default Employees;

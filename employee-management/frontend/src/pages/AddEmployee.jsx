
import { useEffect, useState } from "react";

import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import {
  UserPlus,
  UserRoundPen,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Info,
  ShieldCheck,
  ClipboardList
} from "lucide-react";

import EmployeeForm from "../components/EmployeeForm";

import {
  createEmployee,
  getEmployeeById,
  updateEmployee
} from "../services/employeeService";

const AddEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Determine whether the page is in edit mode
  const isEdit = Boolean(id);

  // Employee data states
  const [employee, setEmployee] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] =
    useState(false);

  // Error states
  const [fetchError, setFetchError] = useState("");
  const [submitError, setSubmitError] =
    useState("");

  // Retry state
  const [retryKey, setRetryKey] = useState(0);

  // Fetch existing employee information in edit mode
  useEffect(() => {
    let active = true;

    setSubmitError("");
    setFetchError("");
    setEmployee(null);

    if (!isEdit) {
      setLoading(false);
      return;
    }

    const fetchEmployee = async () => {
      try {
        setLoading(true);

        const response = await getEmployeeById(id);

        if (active) {
          setEmployee(response.data);
        }
      } catch (err) {
        if (active) {
          setFetchError(
            err.message ||
              "Unable to fetch employee information"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchEmployee();

    return () => {
      active = false;
    };
  }, [id, isEdit, retryKey]);

  // Handle employee creation and update
  const handleSubmit = async (employeeData) => {
    if (submitting) return;

    try {
      setSubmitting(true);
      setSubmitError("");

      let response;

      if (isEdit) {
        // Update existing employee
        response = await updateEmployee(
          id,
          employeeData
        );
      } else {
        // Create new employee
        response = await createEmployee(
          employeeData
        );
      }

      // Redirect to employee directory
      navigate("/employees", {
        replace: true,
        state: {
          message:
            response.message ||
            (isEdit
              ? "Employee updated successfully"
              : "Employee added successfully")
        }
      });
    } catch (err) {
      setSubmitError(
        err.message ||
          "Unable to save employee information"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel form and return to employee directory
  const handleCancel = () => {
    if (submitting) return;

    navigate("/employees");
  };

  // Retry fetching employee information
  const handleRetry = () => {
    setRetryKey((previous) => previous + 1);
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

        <h3>Loading Employee Information</h3>

        <p>
          Please wait while we fetch employee details.
        </p>
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="card empty-state">
        <AlertCircle size={48} />

        <h3>Unable to Load Employee</h3>

        <p role="alert">{fetchError}</p>

        <div className="flex-center gap-3">
          <Link
            to="/employees"
            className="btn btn-secondary"
          >
            <ArrowLeft size={17} />

            Back to Employees
          </Link>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRetry}
          >
            <RefreshCw size={17} />

            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-employee-page">
      {/* Back navigation */}
      <Link
        to="/employees"
        className="back-navigation-link"
      >
        <ArrowLeft size={18} />

        Back to Employees
      </Link>

      {/* Page header */}
      <div className="add-employee-page-header">
        <div>
          <div className="page-section-label">
            {isEdit ? (
              <UserRoundPen size={16} />
            ) : (
              <UserPlus size={16} />
            )}

            <span>EMPLOYEE MANAGEMENT</span>
          </div>

          <h1>
            {isEdit
              ? "Edit Employee"
              : "Add New Employee"}
          </h1>

          <p>
            {isEdit
              ? `Update employee information for ${
                  employee?.name || "this employee"
                }.`
              : "Register a new employee by completing the information below."}
          </p>
        </div>

        <div className="add-page-header-icon">
          {isEdit ? (
            <UserRoundPen size={34} />
          ) : (
            <UserPlus size={34} />
          )}
        </div>
      </div>

      {/* Main form layout */}
      <div className="employee-form-layout">
        {/* Employee form */}
        <section className="card employee-form-card">
          <EmployeeForm
            key={id || "new-employee"}
            initialData={employee}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={submitting}
            error={submitError}
            isEdit={isEdit}
          />
        </section>

        {/* Information sidebar */}
        <aside className="employee-form-sidebar">
          {/* Form guidelines */}
          <div className="card form-info-card">
            <div className="form-info-header">
              <div className="form-info-icon">
                <Info size={21} />
              </div>

              <h3>Form Guidelines</h3>
            </div>

            <ul className="form-guidelines-list">
              <li>
                Enter the employee's full name.
              </li>

              <li>
                Select an existing department or
                enter a new department name.
              </li>

              <li>
                Provide the correct job designation.
              </li>

              <li>
                Enter salary in Indian Rupees (INR).
              </li>

              <li>
                Select the employee's joining date.
              </li>

              <li>
                Review all details before submitting.
              </li>
            </ul>
          </div>

          {/* Required information */}
          <div className="card form-info-card">
            <div className="form-info-header">
              <div className="form-info-icon">
                <ClipboardList size={21} />
              </div>

              <h3>Required Information</h3>
            </div>

            <div className="required-fields-list">
              {[
                "Employee Name",
                "Department",
                "Job Role",
                "Salary",
                "Joining Date"
              ].map((field) => (
                <div
                  className="required-field-item"
                  key={field}
                >
                  <span className="required-field-dot" />

                  <span>{field}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Data validation information */}
          <div className="form-security-note">
            <ShieldCheck size={24} />

            <div>
              <h4>Data Validation</h4>

              <p>
                Employee information is validated
                before being saved to the database.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AddEmployee;

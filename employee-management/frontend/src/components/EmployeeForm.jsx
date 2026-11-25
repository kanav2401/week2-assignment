
import { useEffect, useState } from "react";

import {
  UserRound,
  Building2,
  BriefcaseBusiness,
  IndianRupee,
  CalendarDays,
  Save,
  X,
  LoaderCircle,
  AlertCircle
} from "lucide-react";

const EmployeeForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  error = "",
  isEdit = false
}) => {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    role: "",
    salary: "",
    joinDate: ""
  });

  const [errors, setErrors] = useState({});

  // Pre-fill form when editing an employee
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        department: initialData.department || "",
        role: initialData.role || "",
        salary: initialData.salary ?? "",
        joinDate: initialData.joinDate
          ? initialData.joinDate.slice(0, 10)
          : ""
      });
    } else {
      setFormData({
        name: "",
        department: "",
        role: "",
        salary: "",
        joinDate: ""
      });
    }

    setErrors({});
  }, [initialData]);

  // Suggested departments
  const departments = [
    "Engineering",
    "Human Resources",
    "Finance",
    "Marketing",
    "Sales",
    "Operations",
    "IT",
    "Design",
    "Administration",
    "Customer Support",
    "Research and Development",
    "Other"
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: ""
      }));
    }
  };

  // Validate all employee fields
  const validateForm = () => {
    const newErrors = {};

    // Employee name validation
    if (!formData.name.trim()) {
      newErrors.name = "Employee name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name =
        "Employee name must contain at least 2 characters";
    } else if (formData.name.trim().length > 100) {
      newErrors.name =
        "Employee name cannot exceed 100 characters";
    }

    // Department validation
    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    } else if (
      formData.department.trim().length > 100
    ) {
      newErrors.department =
        "Department cannot exceed 100 characters";
    }

    // Job role validation
    if (!formData.role.trim()) {
      newErrors.role = "Job role is required";
    } else if (formData.role.trim().length > 100) {
      newErrors.role =
        "Job role cannot exceed 100 characters";
    }

    // Salary validation
    if (String(formData.salary).trim() === "") {
      newErrors.salary = "Salary is required";
    } else if (
      !Number.isFinite(Number(formData.salary))
    ) {
      newErrors.salary = "Enter a valid salary";
    } else if (Number(formData.salary) < 0) {
      newErrors.salary = "Salary cannot be negative";
    }

    // Joining date validation
    if (!formData.joinDate) {
      newErrors.joinDate = "Joining date is required";
    } else if (
      Number.isNaN(
        new Date(formData.joinDate).getTime()
      )
    ) {
      newErrors.joinDate = "Enter a valid joining date";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!validateForm()) {
      return;
    }

    const employeeData = {
      name: formData.name.trim(),
      department: formData.department.trim(),
      role: formData.role.trim(),
      salary: Number(formData.salary),
      joinDate: formData.joinDate
    };

    await onSubmit(employeeData);
  };

  // Reset form to initial values
  const handleReset = () => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        department: initialData.department || "",
        role: initialData.role || "",
        salary: initialData.salary ?? "",
        joinDate: initialData.joinDate
          ? initialData.joinDate.slice(0, 10)
          : ""
      });
    } else {
      setFormData({
        name: "",
        department: "",
        role: "",
        salary: "",
        joinDate: ""
      });
    }

    setErrors({});
  };

  return (
    <div className="employee-form-container">
      {/* Form header */}
      <div className="employee-form-header">
        <div className="employee-form-header-icon">
          <UserRound size={26} />
        </div>

        <div>
          <h2>Employee Information</h2>

          <p>
            {isEdit
              ? "Update the employee details below."
              : "Enter the details of the new employee."}
          </p>
        </div>
      </div>

      {/* Backend error message */}
      {error && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          <AlertCircle size={19} />

          <span>{error}</span>
        </div>
      )}

      <form
        className="employee-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="employee-form-grid">
          {/* Employee name */}
          <div className="form-group">
            <label
              htmlFor="name"
              className="form-label"
            >
              Employee Name{" "}
              <span className="required">*</span>
            </label>

            <div className="form-input-wrapper">
              <UserRound
                size={19}
                className="form-input-icon"
              />

              <input
                type="text"
                id="name"
                name="name"
                className={`form-control ${
                  errors.name ? "error" : ""
                }`}
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                maxLength={100}
                disabled={loading}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? "name-error" : undefined
                }
                required
              />
            </div>

            {errors.name && (
              <span
                className="form-error"
                id="name-error"
              >
                {errors.name}
              </span>
            )}
          </div>

          {/* Department */}
          <div className="form-group">
            <label
              htmlFor="department"
              className="form-label"
            >
              Department{" "}
              <span className="required">*</span>
            </label>

            <div className="form-input-wrapper">
              <Building2
                size={19}
                className="form-input-icon"
              />

              <input
                type="text"
                id="department"
                name="department"
                list="department-options"
                className={`form-control ${
                  errors.department ? "error" : ""
                }`}
                placeholder="Select or enter department"
                value={formData.department}
                onChange={handleChange}
                maxLength={100}
                disabled={loading}
                aria-invalid={Boolean(errors.department)}
                aria-describedby={
                  errors.department
                    ? "department-error"
                    : undefined
                }
                required
              />

              <datalist id="department-options">
                {departments.map((department) => (
                  <option
                    key={department}
                    value={department}
                  />
                ))}
              </datalist>
            </div>

            {errors.department && (
              <span
                className="form-error"
                id="department-error"
              >
                {errors.department}
              </span>
            )}
          </div>

          {/* Job role */}
          <div className="form-group">
            <label
              htmlFor="role"
              className="form-label"
            >
              Job Role{" "}
              <span className="required">*</span>
            </label>

            <div className="form-input-wrapper">
              <BriefcaseBusiness
                size={19}
                className="form-input-icon"
              />

              <input
                type="text"
                id="role"
                name="role"
                className={`form-control ${
                  errors.role ? "error" : ""
                }`}
                placeholder="e.g. Software Developer"
                value={formData.role}
                onChange={handleChange}
                maxLength={100}
                disabled={loading}
                aria-invalid={Boolean(errors.role)}
                aria-describedby={
                  errors.role ? "role-error" : undefined
                }
                required
              />
            </div>

            {errors.role && (
              <span
                className="form-error"
                id="role-error"
              >
                {errors.role}
              </span>
            )}
          </div>

          {/* Salary */}
          <div className="form-group">
            <label
              htmlFor="salary"
              className="form-label"
            >
              Salary (INR){" "}
              <span className="required">*</span>
            </label>

            <div className="form-input-wrapper">
              <IndianRupee
                size={19}
                className="form-input-icon"
              />

              <input
                type="number"
                id="salary"
                name="salary"
                className={`form-control ${
                  errors.salary ? "error" : ""
                }`}
                placeholder="e.g. 45000"
                value={formData.salary}
                onChange={handleChange}
                min="0"
                step="any"
                disabled={loading}
                aria-invalid={Boolean(errors.salary)}
                aria-describedby={
                  errors.salary
                    ? "salary-error"
                    : undefined
                }
                required
              />
            </div>

            {errors.salary && (
              <span
                className="form-error"
                id="salary-error"
              >
                {errors.salary}
              </span>
            )}
          </div>

          {/* Joining date */}
          <div className="form-group">
            <label
              htmlFor="joinDate"
              className="form-label"
            >
              Joining Date{" "}
              <span className="required">*</span>
            </label>

            <div className="form-input-wrapper">
              <CalendarDays
                size={19}
                className="form-input-icon"
              />

              <input
                type="date"
                id="joinDate"
                name="joinDate"
                className={`form-control ${
                  errors.joinDate ? "error" : ""
                }`}
                value={formData.joinDate}
                onChange={handleChange}
                disabled={loading}
                aria-invalid={Boolean(errors.joinDate)}
                aria-describedby={
                  errors.joinDate
                    ? "joinDate-error"
                    : undefined
                }
                required
              />
            </div>

            {errors.joinDate && (
              <span
                className="form-error"
                id="joinDate-error"
              >
                {errors.joinDate}
              </span>
            )}
          </div>
        </div>

        {/* Required fields information */}
        <div className="form-required-note">
          <AlertCircle size={16} />

          <span>
            Fields marked with an asterisk (*) are
            required.
          </span>
        </div>

        {/* Form action buttons */}
        <div className="employee-form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            <X size={18} />

            Cancel
          </button>

          <div className="form-action-right">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={loading}
            >
              Reset Form
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="rotating"
                  />

                  {isEdit
                    ? "Updating..."
                    : "Adding..."}
                </>
              ) : (
                <>
                  <Save size={18} />

                  {isEdit
                    ? "Update Employee"
                    : "Add Employee"}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;


import axios from "axios";

// Configure Axios instance
const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json"
  },

  timeout: 15000
});

// Handle API errors
const handleError = (error) => {
  const response = error.response?.data;

  if (response?.errors?.length > 0) {
    const message = response.errors
      .map((item) => item.message)
      .join(", ");

    throw new Error(message);
  }

  if (response?.message) {
    throw new Error(response.message);
  }

  if (error.code === "ECONNABORTED") {
    throw new Error(
      "Request timed out. Please try again."
    );
  }

  if (!error.response) {
    throw new Error(
      "Unable to connect to the server. Please check your connection."
    );
  }

  throw new Error(
    error.message || "Something went wrong"
  );
};

// Get all employees with search, filter and sorting
export const getAllEmployees = async (params = {}) => {
  try {
    const response = await API.get("/employees", {
      params
    });

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get employee by ID
export const getEmployeeById = async (id) => {
  try {
    const response = await API.get(`/employees/${id}`);

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Create a new employee
export const createEmployee = async (employeeData) => {
  try {
    const response = await API.post(
      "/employees",
      employeeData
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Update an existing employee
export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await API.put(
      `/employees/${id}`,
      employeeData
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete an employee
export const deleteEmployee = async (id) => {
  try {
    const response = await API.delete(`/employees/${id}`);

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Check backend and database health
export const checkServerHealth = async () => {
  try {
    const response = await API.get("/health");

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export default API;

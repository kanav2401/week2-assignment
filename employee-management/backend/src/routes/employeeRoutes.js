
const express = require("express");

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");

const router = express.Router();

// Get all employees
router.get("/", getAllEmployees);

// Get a single employee by ID
router.get("/:id", getEmployeeById);

// Create a new employee
router.post("/", createEmployee);

// Update an existing employee
router.put("/:id", updateEmployee);

// Delete an employee
router.delete("/:id", deleteEmployee);

module.exports = router;

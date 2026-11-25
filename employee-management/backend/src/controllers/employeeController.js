
const mongoose = require("mongoose");
const Employee = require("../models/Employee");

const allowedFields = [
  "name",
  "department",
  "role",
  "salary",
  "joinDate"
];

const getEmployeeData = (body) => {
  const data = {};

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      data[field] = body[field];
    }
  });

  return data;
};

const createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create(
      getEmployeeData(req.body)
    );

    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

const getAllEmployees = async (req, res, next) => {
  try {
    const {
      search = "",
      department = "",
      sortBy = "createdAt",
      order = "desc"
    } = req.query;

    const filter = {};

    if (typeof search === "string" && search.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        {
          name: {
            $regex: escapedSearch,
            $options: "i"
          }
        },
        {
          department: {
            $regex: escapedSearch,
            $options: "i"
          }
        },
        {
          role: {
            $regex: escapedSearch,
            $options: "i"
          }
        }
      ];
    }

    if (typeof department === "string" && department.trim()) {
      filter.department = department.trim();
    }

    const allowedSortFields = [
      "name",
      "department",
      "role",
      "salary",
      "joinDate",
      "createdAt",
      "updatedAt"
    ];

    const sortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const sortOrder = order === "asc" ? 1 : -1;

    const employees = await Employee.find(filter).sort({
      [sortField]: sortOrder,
      _id: 1
    });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID"
      });
    }

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID"
      });
    }

    const updateData = getEmployeeData(req.body);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid employee fields provided"
      });
    }

    const employee = await Employee.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true
      }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID"
      });
    }

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};


const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"]
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      maxlength: [100, "Department cannot exceed 100 characters"]
    },

    role: {
      type: String,
      required: [true, "Employee role is required"],
      trim: true,
      maxlength: [100, "Role cannot exceed 100 characters"]
    },

    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
      validate: {
        validator: Number.isFinite,
        message: "Salary must be a valid number"
      }
    },

    joinDate: {
      type: Date,
      required: [true, "Joining date is required"]
    }
  },
  {
    timestamps: true
  }
);

employeeSchema.index({ name: 1 });
employeeSchema.index({ department: 1 });

module.exports = mongoose.model("Employee", employeeSchema);

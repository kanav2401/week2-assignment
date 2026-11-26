
const { body } = require("express-validator");

// Registration validation
const registerValidator = [
  // Username validation
  body("username")
    .isString()
    .withMessage("Username must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage(
      "Username must contain between 3 and 30 characters"
    )
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "Username can only contain letters, numbers and underscores"
    )
    .toLowerCase(),

  // Email validation
  body("email")
    .isString()
    .withMessage("Email must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isLength({ max: 254 })
    .withMessage("Email address is too long")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .toLowerCase(),

  // Password validation
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage(
      "Password must contain at least 8 characters"
    )
    .custom((value) => {
      if (Buffer.byteLength(value, "utf8") > 72) {
        throw new Error(
          "Password cannot exceed 72 bytes"
        );
      }

      return true;
    })
    .matches(/[A-Z]/)
    .withMessage(
      "Password must contain at least one uppercase letter"
    )
    .matches(/[a-z]/)
    .withMessage(
      "Password must contain at least one lowercase letter"
    )
    .matches(/[0-9]/)
    .withMessage(
      "Password must contain at least one number"
    )
    .matches(/[^A-Za-z0-9\s]/)
    .withMessage(
      "Password must contain at least one special character"
    ),

  // Confirm password validation
  body("confirmPassword")
    .isString()
    .withMessage("Confirm password must be a string")
    .bail()
    .notEmpty()
    .withMessage("Please confirm your password")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }

      return true;
    }),
];

// Login validation
const loginValidator = [
  // Email validation
  body("email")
    .isString()
    .withMessage("Email must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isLength({ max: 254 })
    .withMessage("Email address is too long")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .toLowerCase(),

  // Password validation
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .custom((value) => {
      if (Buffer.byteLength(value, "utf8") > 72) {
        throw new Error("Invalid password");
      }

      return true;
    }),
];

module.exports = {
  registerValidator,
  loginValidator,
};


const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// User database schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must contain at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscores",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [254, "Email address is too long"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must contain at least 8 characters"],
      select: false,
      validate: {
        validator: function (value) {
          return Buffer.byteLength(value, "utf8") <= 72;
        },
        message: "Password cannot exceed 72 bytes",
      },
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,

    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;

        return ret;
      },
    },
  }
);

// Hash password before saving the user
userSchema.pre("save", async function () {
  // Hash only when the password is created or modified
  if (!this.isModified("password")) {
    return;
  }

  const saltRounds = Number(
    process.env.BCRYPT_SALT_ROUNDS || 12
  );

  if (
    !Number.isInteger(saltRounds) ||
    saltRounds < 10 ||
    saltRounds > 15
  ) {
    throw new Error("Invalid bcrypt salt rounds");
  }

  this.password = await bcrypt.hash(
    this.password,
    saltRounds
  );
});

// Compare entered password with stored password hash
userSchema.methods.comparePassword = async function (
  enteredPassword
) {
  if (!this.password) {
    return false;
  }

  return await bcrypt.compare(
    enteredPassword,
    this.password
  );
};

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = User;

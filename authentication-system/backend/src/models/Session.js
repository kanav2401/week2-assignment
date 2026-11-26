
const mongoose = require("mongoose");

// Session database schema
const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },

    refreshTokenHash: {
      type: String,
      required: [true, "Refresh token hash is required"],
      select: false,
    },

    expiresAt: {
      type: Date,
      required: [true, "Session expiration date is required"],
    },

    revokedAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,

    toJSON: {
      transform: function (doc, ret) {
        delete ret.refreshTokenHash;
        delete ret.__v;

        return ret;
      },
    },
  }
);

// Automatically remove expired sessions from MongoDB
sessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

// Improve queries for active user sessions
sessionSchema.index({
  userId: 1,
  revokedAt: 1,
  expiresAt: 1,
});

// Check whether the session is still active
sessionSchema.methods.isActive = function () {
  return (
    this.revokedAt === null &&
    this.expiresAt.getTime() > Date.now()
  );
};

// Revoke the session during logout
sessionSchema.methods.revoke = async function () {
  if (!this.revokedAt) {
    this.revokedAt = new Date();

    await this.save();
  }

  return this;
};

// Create Session model
const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;


const crypto = require("crypto");

// Generate a SHA-256 hash of a token
const hashToken = (token) => {
  if (typeof token !== "string" || !token.trim()) {
    throw new Error("A valid token is required for hashing");
  }

  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

module.exports = hashToken;

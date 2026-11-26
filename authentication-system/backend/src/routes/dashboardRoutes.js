
const express = require("express");

const {
  getDashboard,
} = require("../controllers/dashboardController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// Protect all dashboard routes
router.use(authMiddleware);

// Get authenticated user dashboard
// GET /api/dashboard
router.get(
  "/",
  getDashboard
);

module.exports = router;

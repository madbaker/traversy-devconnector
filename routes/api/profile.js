const express = require("express");
const router = express.Router();

// @route   GET api/profile/test
// @desc    Tests the Profile route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Profile Route Works" }));

module.exports = router;
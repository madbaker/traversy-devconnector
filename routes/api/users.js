const express = require("express");
const router = express.Router();

// @route   GET api/users/test
// @desc    Tests the Users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "User Route Works" }));

module.exports = router;

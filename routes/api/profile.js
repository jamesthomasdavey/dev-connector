const express = require("express");
const router = express.Router();

// @route     get api/profile/test
// @desc      tests profile route
// @access    public
router.get("/test", (req, res) => res.json({ msg: "Profile works" }));

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  registerUser,
} = require("../controller/UserController");

router.post("/register", registerUser);
router.get("/:id", getUserProfile);

module.exports = router;

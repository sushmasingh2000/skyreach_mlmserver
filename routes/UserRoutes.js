const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  registerUser,
  getUserWallet,
  getIncome,
  purchasePackage,
  requestWithdrawal,
  getUserWithdrawals,
  getUserPackageHistory,
  loginUser,
} = require("../controller/UserController");
const { verifyToken } = require("../middleware/veifytoken");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get-profile-data", verifyToken, getUserProfile);
router.get("/get-wallet-data", verifyToken ,getUserWallet);
router.get("/get-unilevel-income",verifyToken,  getIncome);
router.post("/buy-package", verifyToken,  purchasePackage);
router.get("/get-package", verifyToken,  getUserPackageHistory);
router.post("/withdrwal-transaction", verifyToken, requestWithdrawal);
router.get("/get-withdrwal-transaction", verifyToken, getUserWithdrawals);



module.exports = router;

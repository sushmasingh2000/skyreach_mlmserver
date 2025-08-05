const User = require("../models/User");
const Referral = require("../models/Referral");
const { distributeUnilevelCommission } = require("../services/Unilevel");
const Wallet = require("../models/Wallet");
const Income = require("../models/Income");
const Package = require("../models/Package");
const Withdrawal = require("../models/Withdrawal");
const jwt = require("jsonwebtoken");

const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, referredBy } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    const referralCode = generateReferralCode();
    const newUser = await User.create({
      name,
      email,
      password,
      referralCode,
      referredBy,
    });
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy });
      if (referrer) {
        await Referral.updateOne(
          { userId: referrer._id },
          { $push: { referredIds: newUser._id } },
          { upsert: true }
        );
      }
    }
    await distributeUnilevelCommission(newUser._id, 1000);
    res.status(200).json({ message: "User Registration Successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, "sushma", {
      expiresIn: "1d",
    });
    res.status(200).json({
      message: "Login Successfully",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({message: "Profile List Get successfully", data:user});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    res.json({message: "Wallet List Get successfully", data: wallet});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
//level
const getIncome = async (req, res) => {
  try {
    const logs = await Income.find({ userId: req.userId }).populate("fromUserId", "name email");
    res.json(
     { message: "Income List Get successfully", data: logs});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

//Binary
const getAllBinaryIncome = async (req, res) => {
  try {
    const logs = await BinaryLog.find({userId:req.userId}).populate("userId", "name email") 
    res.json({
      message: "All binary incomes fetched successfully",
      data: logs,
    });
  } catch (err) {
    console.error("Error fetching  binary incomes:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const purchasePackage = async (req, res) => {
  try {
    const { amount } = req.body;
     const userId = req.userId;
    const newPackage = await Package.create({
      userId,
      amount,
    });
    await distributeUnilevelCommission(userId, amount);
    res.status(200).json({ message: "Package purchased successfully", Package: newPackage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserPackageHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const history = await Package.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ 
      message: "Package List Get successfully",
      data: history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const requestWithdrawal = async (req, res) => {
  try {
    const { amount, walletAddress } = req.body;
    const userId = req.userId
    if (!walletAddress) {
      return res.status(400).json({ message: "Wallet address is required" });
    }
    if (amount < 50) {
      return res.status(400).json({ message: "Minimum withdrawal is ₹50" });
    }
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }
    // Calculate tax (5%)
    const tax = Math.round((5 / 100) * amount);
    const net = amount - tax;
    //  Don't deduct yet — wait for admin approval
    const withdrawal = await Withdrawal.create({
      userId,
      amount,
      walletAddress,
      taxDeducted: tax,
      netAmount: net,
      status: "pending", // ✅ For admin approval
    });
    res.status(200).json({
      message: "Withdrawal request submitted successfully",
      withdrawal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const getUserWithdrawals = async (req, res) => {
  try {
    const  userId  = req.userId;
    const withdrawals = await Withdrawal.find({ userId }).sort({ requestedAt: -1 });
    res.status(200).json({ 
      message: "Withdrawal List Get successfully",
      data: withdrawals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { getUserProfile, registerUser, getUserWallet, getIncome, 
  purchasePackage , requestWithdrawal , getUserPackageHistory,getUserWithdrawals , loginUser, getAllBinaryIncome};

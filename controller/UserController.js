const User = require("../models/User");
const Referral = require("../models/Referral");

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
    res.status(201).json({ message: "User registered", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserProfile, registerUser };

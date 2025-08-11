const User = require("../models/User");
const Wallet = require("../models/Wallet");
const BinaryLog = require("../models/Binarylog");

const PAIR_BONUS = 500;
const DAILY_CAP = 5000;

async function distributeBinaryIncome(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const today = new Date().setHours(0, 0, 0, 0);

  const left = (user.carryLeft || 0) + (user.leftCount || 0);
  const right = (user.carryRight || 0) + (user.rightCount || 0);

  if (isNaN(left) || isNaN(right)) {
    throw new Error(`Invalid left or right count: left=${left}, right=${right}`);
  }

  const pairs = Math.min(left, right);
  if (pairs <= 0) return;

  let amount = pairs * PAIR_BONUS;
  if (amount > DAILY_CAP) amount = DAILY_CAP;

  const usedPairs = Math.floor(amount / PAIR_BONUS);
  const newCarryLeft = left - usedPairs;
  const newCarryRight = right - usedPairs;

  console.log('Updating wallet with binary income:', {
    userId,
    amount,
    newCarryLeft,
    newCarryRight,
  });

  await Wallet.findOneAndUpdate(
    { userId },
    { $inc: { balance: amount } },
    { upsert: true }
  );

  await BinaryLog.create({
    userId,
    date: today,
    pairsMatched: usedPairs,
    amount,
    carryLeft: newCarryLeft,
    carryRight: newCarryRight,
  });

  await User.findByIdAndUpdate(userId, {
    carryLeft: newCarryLeft,
    carryRight: newCarryRight,
    leftCount: 0,
    rightCount: 0,
  });
}

module.exports = { distributeBinaryIncome };

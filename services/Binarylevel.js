// services/binaryService.js
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const BinaryLog = require("../models/Binarylog");

const PAIR_BONUS = 500;
const DAILY_CAP = 5000;

async function distributeBinaryIncome(userId) {
  const user = await User.findById(userId);
  const today = new Date().setHours(0, 0, 0, 0);

  const left = user.carryLeft + user.leftCount;
  const right = user.carryRight + user.rightCount;
  const pairs = Math.min(left, right);

  if (pairs <= 0) return;

  let amount = pairs * PAIR_BONUS;
  if (amount > DAILY_CAP) amount = DAILY_CAP;

  const usedPairs = Math.floor(amount / PAIR_BONUS);
  const newCarryLeft = left - usedPairs;
  const newCarryRight = right - usedPairs;

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

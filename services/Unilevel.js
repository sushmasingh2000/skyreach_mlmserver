const Income = require("../models/Income");
const User = require("../models/User");
const Wallet = require("../models/Wallet");

const distributeUnilevelCommission = async (userId, amount) => {
  amount = Number(amount);
  if (isNaN(amount)) throw new Error("Invalid amount");

  const commissionPercents = [10, 5, 3, 2, 1];
  let currentUser = await User.findById(userId);

  for (let level = 0; level < 5; level++) {
    const referrerCode = currentUser.referredBy;
    if (!referrerCode) break;

    const referrer = await User.findOne({ referralCode: referrerCode });
    if (!referrer) break;

    const commission = (commissionPercents[level] / 100) * amount;

    if (isNaN(commission)) {
      console.error('Commission is NaN', { commission, amount, level });
      break;
    }

    console.log('Updating wallet balance:', {
      userId: referrer._id,
      commission,
    });

    await Wallet.findOneAndUpdate(
      { userId: referrer._id },
      { $inc: { balance: commission }, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    await Income.create({
      userId: referrer._id,
      fromUserId: userId,
      level: level + 1,
      incomeType: "level_commission",
      amount: commission,
    });

    currentUser = referrer;
  }
};
module.exports = { distributeUnilevelCommission };

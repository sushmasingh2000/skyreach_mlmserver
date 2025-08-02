const User = require("../models/User");
const Wallet = require("../models/Wallet");
const IncomeLog = require("../models/Income");

const distributeUnilevelCommission = async (userId, amount) => {
  const commissionPercents = [10, 5, 3, 2, 1];
  let currentUser = await User.findById(userId);

  for (let level = 0; level < 5; level++) {
    const referrerCode = currentUser.referredBy;
    if (!referrerCode) break;

    const referrer = await User.findOne({ referralCode: referrerCode });
    if (!referrer) break;

    const commission = (commissionPercents[level] / 100) * amount;

    await Wallet.findOneAndUpdate(
      { userId: referrer._id },
      { $inc: { balance: commission }, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    await IncomeLog.create({
      userId: referrer._id,
      fromUserId: userId,
      level: level + 1,
      incomeType: "level_commission",
      amount: commission,
    });

    currentUser = referrer;
  }
};

module.exports = {
  distributeUnilevelCommission,
};

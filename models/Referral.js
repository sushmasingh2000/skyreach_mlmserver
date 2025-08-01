const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  referredIds: [mongoose.Schema.Types.ObjectId], 
});

module.exports = mongoose.model("Referral", referralSchema);

const mongoose = require("mongoose");

const incomeLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // jiske wajah se income mili
  level: Number,
  incomeType: String, // e.g., "level_commission"
  amount: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("IncomeLog", incomeLogSchema);

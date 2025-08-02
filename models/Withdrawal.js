// models/Withdrawal.js
const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  walletAddress: { type: String, required: true },
  taxDeducted: { type: Number },
  netAmount: { type: Number },
  status: {
    type: String,
    enum: ["pending", "completed", "rejected"],
    default: "pending",
  },
  requestedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Withdrawal", withdrawalSchema);
